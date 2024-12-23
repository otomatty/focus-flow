-- アクティブなタスク取得関数
create or replace function get_active_tasks(p_user_id uuid)
returns table (
    id uuid,
    title text,
    description text,
    due_date timestamp with time zone,
    priority text,
    category text,
    status text
) as $$
begin
    return query
    select 
        t.id, t.title, t.description, t.due_date, t.priority, t.category, t.status
    from tasks t
    where t.user_id = p_user_id
    and t.status != 'completed'
    and (t.due_date is null or t.due_date >= current_date)
    order by 
        case when t.due_date is null then 1 else 0 end,
        t.due_date,
        case t.priority
            when 'high' then 1
            when 'medium' then 2
            when 'low' then 3
        end;
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
            user_id, title, description, due_date, priority, 
            category, status, is_recurring, recurring_pattern
        )
        select
            task_record.user_id,
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
            task_record.recurring_pattern;
    end loop;
end;
$$ language plpgsql; 