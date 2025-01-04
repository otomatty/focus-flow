-- ユーザーバッジテーブル
create table if not exists ff_achievements.user_badges (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    badge_id uuid references ff_achievements.badges(id) not null,
    acquired_at timestamp with time zone default now(),
    -- 同じバッジを複数回獲得できないようにする
    unique(user_id, badge_id)
); 