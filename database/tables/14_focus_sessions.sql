-- 集中セッションテーブル（月次パーティション）
create table if not exists focus_sessions (
    id uuid not null default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    schedule_id uuid references schedules(id),
    start_time timestamp with time zone not null,
    end_time timestamp with time zone,
    duration interval,
    is_completed boolean default false,
    bonus_points integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- パーティションキーを含む主キー制約
    primary key (id, start_time)
) partition by range (start_time);

-- 初期パーティションの作成（2024年1月から12月まで）
do $$
begin
    for i in 1..12 loop
        execute format(
            'create table if not exists focus_sessions_y2024m%s partition of focus_sessions
            for values from (%L) to (%L)',
            lpad(i::text, 2, '0'),
            format('2024-%s-01', lpad(i::text, 2, '0')),
            case when i = 12 
                then '2025-01-01' 
                else format('2024-%s-01', lpad((i + 1)::text, 2, '0'))
            end
        );
    end loop;
end $$; 