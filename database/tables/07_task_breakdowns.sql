-- タスク分解テーブル
create table if not exists task_breakdowns (
    id uuid primary key default uuid_generate_v4(),
    parent_task_id uuid references tasks(id) on delete cascade,
    title text not null,
    description text,
    estimated_duration interval,
    order_index integer not null,
    status text check (status in ('not_started', 'in_progress', 'completed')),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- タスク分解更新時のタイムスタンプを自動更新するトリガー
create or replace function update_task_breakdowns_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger task_breakdowns_updated_at
    before update on task_breakdowns
    for each row
    execute function update_task_breakdowns_updated_at(); 