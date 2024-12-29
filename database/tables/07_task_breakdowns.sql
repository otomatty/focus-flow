-- タスク分解テーブル
create table if not exists task_breakdowns (
    id uuid primary key default uuid_generate_v4(),
    parent_task_id uuid references tasks(id) not null,
    title text not null,
    description text,
    order_index integer not null,
    estimated_duration interval,
    actual_duration interval,
    status text check (status in ('not_started', 'in_progress', 'completed')),
    experience_points integer default 0,
    skill_category text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- インデックスの作成
create index task_breakdowns_parent_task_id_idx on task_breakdowns(parent_task_id);
create index task_breakdowns_order_index_idx on task_breakdowns(order_index);

-- 更新日時を自動更新するトリガー
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