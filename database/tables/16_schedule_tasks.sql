-- スケジュールとタスクの紐付けテーブル
create table if not exists schedule_tasks (
    id uuid primary key default uuid_generate_v4(),
    schedule_id uuid references schedules(id) on delete cascade,
    task_id uuid references tasks(id) on delete cascade,
    created_at timestamp with time zone default now()
); 