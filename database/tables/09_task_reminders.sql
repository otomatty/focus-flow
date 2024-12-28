-- タスクリマインダーテーブル
create table if not exists task_reminders (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid references tasks(id) on delete cascade,
    reminder_time timestamp with time zone not null,
    is_sent boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
); 