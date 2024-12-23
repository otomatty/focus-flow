-- タスクテーブル
create table if not exists tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    title text not null,
    description text,
    due_date timestamp with time zone,
    priority text check (priority in ('high', 'medium', 'low')),
    category text,
    status text check (status in ('not_started', 'in_progress', 'completed')),
    is_recurring boolean default false,
    recurring_pattern jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
); 