-- タスクの種類を定義
create type task_type as enum (
    'task',           -- 通常タスク
    'milestone',      -- マイルストーン
    'summary'         -- サマリータスク
);

-- タスクテーブル
create table if not exists tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    project_id uuid references projects(id) on delete cascade,
    title text not null,
    description text,
    task_type task_type not null default 'task',
    start_date timestamp with time zone,
    due_date timestamp with time zone,
    priority text check (priority in ('high', 'medium', 'low')),
    category text,
    status text check (status in (
        'not_started', 'in_progress', 'in_review',
        'blocked', 'completed', 'cancelled'
    )),
    progress_percentage integer check (progress_percentage between 0 and 100),
    is_recurring boolean default false,
    recurring_pattern jsonb,
    ai_generated boolean default false,
    difficulty_level integer check (difficulty_level between 1 and 5),
    estimated_duration interval,
    actual_duration interval,
    style jsonb default '{"color": null, "icon": null}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- タスク更新時のタイムスタンプを自動更新するトリガー
create or replace function update_tasks_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger tasks_updated_at
    before update on tasks
    for each row
    execute function update_tasks_updated_at(); 