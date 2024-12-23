-- クエストマスターテーブル
create table if not exists quests (
    id uuid primary key default uuid_generate_v4(),
    title text not null unique,
    description text not null,
    quest_type text not null,
    requirements jsonb not null,
    reward_exp integer not null,
    reward_badge_id uuid references badges(id),
    duration_type text check (duration_type in ('daily', 'weekly')),
    created_at timestamp with time zone default now()
);

-- 初期クエストデータの投入
insert into quests (title, description, quest_type, requirements, reward_exp, duration_type) values
    ('デイリータスクマスター', '1日のタスクをすべて完了する', 'task_complete', '{"count": 5}'::jsonb, 100, 'daily'),
    ('集中の時間', '1日の集中セッションを完了する', 'focus_session', '{"minutes": 120}'::jsonb, 150, 'daily'),
    ('週間プランナー', '週間スケジュールを完全に実行する', 'schedule_follow', '{"completion_rate": 80}'::jsonb, 500, 'weekly')
on conflict (title) do nothing; 