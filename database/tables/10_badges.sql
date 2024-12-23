-- バッジマスターテーブル
create table if not exists badges (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text not null,
    condition_type text not null,
    condition_value jsonb not null,
    image_url text,
    created_at timestamp with time zone default now()
);

-- 初期バッジデータの投入
insert into badges (name, description, condition_type, condition_value) values
    ('first_task_complete', '初めてのタスク完了', 'task_complete', '{"count": 1}'::jsonb),
    ('focus_master', '集中の達人', 'focus_session_complete', '{"count": 10}'::jsonb),
    ('schedule_keeper', 'スケジュール管理の達人', 'schedule_follow', '{"days": 7}'::jsonb)
on conflict (name) do nothing; 