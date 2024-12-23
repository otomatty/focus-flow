-- ユーザープロファイルテーブル
create table if not exists user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    level integer default 1,
    experience_points integer default 0,
    cache_version integer default 1,
    last_activity_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
); 