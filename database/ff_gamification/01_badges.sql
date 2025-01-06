create schema if not exists ff_gamification;

-- バッジマスターテーブル
create table if not exists ff_gamification.badges (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text not null,
    condition_type text not null,
    condition_value jsonb not null,
    image_url text,
    created_at timestamp with time zone default now()
);

-- 初期バッジデータの投入
insert into ff_gamification.badges (name, description, condition_type, condition_value) values
    ('prestige_1', 'プレステージ1達成', 'prestige_reached', '{"prestige": 1}'::jsonb),
    ('prestige_2', 'プレステージ2達成', 'prestige_reached', '{"prestige": 2}'::jsonb),
    ('prestige_3', 'プレステージ3達成', 'prestige_reached', '{"prestige": 3}'::jsonb),
    ('prestige_4', 'プレステージ4達成', 'prestige_reached', '{"prestige": 4}'::jsonb),
    ('prestige_5', 'プレステージ5達成', 'prestige_reached', '{"prestige": 5}'::jsonb),
    ('prestige_6', 'プレステージ6達成', 'prestige_reached', '{"prestige": 6}'::jsonb),
    ('prestige_7', 'プレステージ7達成', 'prestige_reached', '{"prestige": 7}'::jsonb),
    ('prestige_8', 'プレステージ8達成', 'prestige_reached', '{"prestige": 8}'::jsonb),
    ('prestige_9', 'プレステージ9達成', 'prestige_reached', '{"prestige": 9}'::jsonb),
    ('prestige_10', 'プレステージ10達成', 'prestige_reached', '{"prestige": 10}'::jsonb)
on conflict (name) do nothing; 