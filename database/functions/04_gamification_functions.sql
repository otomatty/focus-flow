-- レベル計算関数
create or replace function calculate_level(p_exp integer)
returns integer as $$
begin
    -- 経験値からレベルを計算（レベルが上がるごとに必要経験値が増加）
    return floor(sqrt(p_exp::float / 100))::integer + 1;
end;
$$ language plpgsql;

-- 経験値加算関数
create or replace function add_experience_points(
    p_user_id uuid,
    p_exp_points integer
)
returns table (
    new_exp integer,
    new_level integer,
    leveled_up boolean
) as $$
declare
    current_exp integer;
    current_level integer;
    new_exp integer;
    new_level integer;
begin
    -- 現在の経験値とレベルを取得
    select experience_points, level
    into current_exp, current_level
    from user_profiles
    where user_id = p_user_id;
    
    -- 新しい経験値を計算
    new_exp := current_exp + p_exp_points;
    
    -- 新しいレベルを計算
    new_level := calculate_level(new_exp);
    
    -- プロフィールを更新
    update user_profiles
    set experience_points = new_exp,
        level = new_level
    where user_id = p_user_id;
    
    return query
    select 
        new_exp,
        new_level,
        new_level > current_level as leveled_up;
end;
$$ language plpgsql;

-- バッジ獲得条件チェック関数
create or replace function check_badge_conditions(
    p_user_id uuid,
    p_condition_type text,
    p_value jsonb
)
returns table (
    badge_id uuid,
    badge_name text,
    badge_description text
) as $$
begin
    return query
    select 
        b.id,
        b.name,
        b.description
    from badges b
    left join user_badges ub on b.id = ub.badge_id and ub.user_id = p_user_id
    where b.condition_type = p_condition_type
    and b.condition_value <= p_value
    and ub.id is null;
end;
$$ language plpgsql;

-- クエスト進捗更新関数
create or replace function update_quest_progress(
    p_user_id uuid,
    p_quest_type text,
    p_progress jsonb
)
returns void as $$
declare
    quest_record record;
begin
    -- アクティブなクエストを取得して進捗を更新
    for quest_record in
        select uq.id, uq.progress, q.requirements
        from user_quests uq
        join quests q on uq.quest_id = q.id
        where uq.user_id = p_user_id
        and uq.status = 'in_progress'
        and q.quest_type = p_quest_type
    loop
        -- 進捗を更新
        update user_quests
        set progress = quest_record.progress || p_progress
        where id = quest_record.id;
        
        -- クエスト完了チェック
        if (quest_record.progress || p_progress) >= quest_record.requirements then
            update user_quests
            set 
                status = 'completed',
                completed_at = now()
            where id = quest_record.id;
        end if;
    end loop;
end;
$$ language plpgsql; 