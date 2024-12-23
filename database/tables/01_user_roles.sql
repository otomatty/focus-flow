-- ユーザーロールマスターテーブル
create table if not exists user_roles (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text,
    created_at timestamp with time zone default now()
);

-- 初期データの投入
insert into user_roles (name, description) values
    ('admin', 'システム管理者'),
    ('user', '一般ユーザー')
on conflict (name) do nothing; 