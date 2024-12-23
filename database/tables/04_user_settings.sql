-- ユーザー設定テーブル
create table if not exists user_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    theme_color text default 'default',
    notification_enabled boolean default true,
    voice_input_enabled boolean default true,
    focus_mode_restrictions jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
); 