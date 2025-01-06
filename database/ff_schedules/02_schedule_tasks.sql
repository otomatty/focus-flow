-- スケジュールとタスクの紐付けテーブル
create table if not exists ff_schedules.schedule_tasks (
    id uuid primary key default uuid_generate_v4(),
    schedule_id uuid references ff_schedules.schedules(id) on delete cascade,
    task_id uuid references ff_tasks.tasks(id) on delete cascade,
    created_at timestamp with time zone default now()
); 