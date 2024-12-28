-- 既存の関数を削除
drop function if exists get_active_tasks(uuid);
drop function if exists get_task_breakdowns(uuid);
drop function if exists calculate_task_experience(integer, interval, interval);
drop function if exists update_user_skill(uuid, text, integer);
drop function if exists update_overdue_tasks();
drop function if exists generate_recurring_tasks();

-- レベルごとの必要経験値を計算する関数
create or replace function calculate_required_exp(level integer)
returns integer as $$
begin
    return (100 * power(level, 1.5))::integer;
end;
$$ language plpgsql;

-- アクティブなタスク取得関数
create or replace function get_active_tasks(p_user_id uuid)
returns table (
    id uuid,
    title text,
    description text,
    due_date timestamp with time zone,
    priority text,
    category text,
    status text,
    difficulty_level integer,
    estimated_duration interval,
    actual_duration interval,
    ai_generated boolean,
    project_id uuid,
    group_ids uuid[],
    dependency_count integer
) as $$
begin
    return query
    select 
        t.id, t.title, t.description, t.due_date, t.priority, t.category, t.status,
        t.difficulty_level, t.estimated_duration, t.actual_duration, t.ai_generated,
        t.project_id,
        array_agg(distinct tgm.group_id) as group_ids,
        count(distinct td.prerequisite_task_id) as dependency_count
    from tasks t
    left join task_group_memberships tgm on t.id = tgm.task_id
    left join task_dependencies td on t.id = td.dependent_task_id
    where t.user_id = p_user_id
    and t.status != 'completed'
    and (t.due_date is null or t.due_date >= current_date)
    group by t.id
    order by 
        t.due_date nulls last,
        case t.priority
            when 'high' then 1
            when 'medium' then 2
            when 'low' then 3
        end;
end;
$$ language plpgsql;

-- サループ内のタスク取得関数
create or replace function get_group_tasks(p_group_id uuid)
returns table (
    id uuid,
    title text,
    description text,
    status text,
    priority text,
    position integer,
    group_path ltree
) as $$
begin
    return query
    select 
        t.id, t.title, t.description, t.status, t.priority,
        tgm.position,
        tg.path as group_path
    from tasks t
    join task_group_memberships tgm on t.id = tgm.task_id
    join task_groups tg on tgm.group_id = tg.id
    where tg.id = p_group_id
    order by tgm.position;
end;
$$ language plpgsql;

-- タスク分解取得関数
create or replace function get_task_breakdowns(p_task_id uuid)
returns table (
    id uuid,
    title text,
    description text,
    estimated_duration interval,
    order_index integer,
    status text
) as $$
begin
    return query
    select 
        tb.id, tb.title, tb.description, tb.estimated_duration,
        tb.order_index, tb.status
    from task_breakdowns tb
    where tb.parent_task_id = p_task_id
    order by tb.order_index;
end;
$$ language plpgsql;

-- タスク経験値計算関数
create or replace function calculate_task_experience(
    p_difficulty_level integer,
    p_estimated_duration interval,
    p_actual_duration interval,
    p_current_level integer
)
returns integer as $$
declare
    base_exp integer;
    time_bonus integer;
    level_multiplier float;
begin
    -- 基本経験値（難易度に基づく）
    base_exp := 100 * p_difficulty_level;
    
    -- レベルが高いほど低レベルのタスクからの経験値が減少
    level_multiplier := greatest(0.1, 1.0 - (p_current_level * 0.05));
    
    -- 時間ボーナス（予定時間内に終わった場合）
    if p_actual_duration <= p_estimated_duration then
        -- 早く終わるほどボーナスが増加
        time_bonus := (extract(epoch from (p_estimated_duration - p_actual_duration))/3600)::integer * 10;
    else
        -- 遅れた場合はペナルティ
        time_bonus := -((extract(epoch from (p_actual_duration - p_estimated_duration))/3600)::integer * 5);
    end if;
    
    -- 最終経験値の計算（最低でも1経験値は保証）
    return greatest(1, ((base_exp * level_multiplier) + time_bonus)::integer);
end;
$$ language plpgsql;

-- ユーザースキル更新関数
create or replace function update_user_skill(
    p_user_id uuid,
    p_skill_category text,
    p_exp_gained integer
)
returns table (
    new_level integer,
    exp_to_next_level integer,
    total_exp integer,
    gained_exp integer
) as $$
declare
    current_exp integer;
    current_level integer;
    next_level_exp integer;
    v_new_level integer;
    v_exp_to_next integer;
begin
    -- 現在のスキル情報を取得または新規作成
    insert into user_skills (user_id, skill_category)
    values (p_user_id, p_skill_category)
    on conflict (user_id, skill_category) do nothing;
    
    -- ��在の経験値とレベルを取得
    select us.total_exp, us.current_level
    into current_exp, current_level
    from user_skills us
    where us.user_id = p_user_id and us.skill_category = p_skill_category;
    
    -- 経験値を更新
    update user_skills
    set total_exp = total_exp + p_exp_gained
    where user_id = p_user_id and skill_category = p_skill_category
    returning total_exp into current_exp;
    
    -- 新しいレベルを計算
    v_new_level := 1;
    while calculate_required_exp(v_new_level + 1) <= current_exp loop
        v_new_level := v_new_level + 1;
    end loop;
    
    -- レベルが変わった場合は更新
    if v_new_level != current_level then
        update user_skills
        set current_level = v_new_level
        where user_id = p_user_id and skill_category = p_skill_category;
    end if;
    
    -- 次のレベルまでの必要経験値を計算
    v_exp_to_next := calculate_required_exp(v_new_level + 1) - current_exp;
    
    -- 結果を返す
    return query
    select 
        v_new_level,
        v_exp_to_next,
        current_exp,
        p_exp_gained;
end;
$$ language plpgsql;

-- 期限切れタスクのステータス更新関数
create or replace function update_overdue_tasks()
returns void as $$
begin
    update tasks
    set status = 'failed'
    where status = 'not_started'
    and due_date < current_date;
end;
$$ language plpgsql;

-- 繰り返しタスクの生成関数
create or replace function generate_recurring_tasks()
returns void as $$
declare
    task_record record;
begin
    for task_record in 
        select *
        from tasks
        where is_recurring = true
        and status = 'completed'
    loop
        -- recurring_patternに基づいて次回のタスクを生成
        insert into tasks (
            user_id, project_id, title, description, due_date, priority, 
            category, status, is_recurring, recurring_pattern,
            difficulty_level, estimated_duration, ai_generated
        )
        select
            task_record.user_id,
            task_record.project_id,
            task_record.title,
            task_record.description,
            case (task_record.recurring_pattern->>'type')
                when 'daily' then task_record.due_date + interval '1 day'
                when 'weekly' then task_record.due_date + interval '1 week'
                when 'monthly' then task_record.due_date + interval '1 month'
                else null
            end,
            task_record.priority,
            task_record.category,
            'not_started',
            true,
            task_record.recurring_pattern,
            task_record.difficulty_level,
            task_record.estimated_duration,
            task_record.ai_generated;
    end loop;
end;
$$ language plpgsql; 