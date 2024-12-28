-- スケジュールテーブル
create table if not exists schedules (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    day_of_week integer not null check (day_of_week between 0 and 6),
    start_time time not null,
    end_time time not null,
    activity_type text not null,
    title text not null,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- 開始時間は終了時間より前でなければならない
    constraint valid_time_range check (start_time < end_time)
); 