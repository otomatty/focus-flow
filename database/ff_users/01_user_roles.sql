-- ff_usersスキーマの作成
create schema if not exists ff_users;

-- ユーザーロールマスターテーブル
create table if not exists ff_users.user_roles (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.user_roles is 'ユーザーロールを管理するマスターテーブル';
comment on column ff_users.user_roles.id is 'ロールの一意識別子';
comment on column ff_users.user_roles.name is 'ロール名';
comment on column ff_users.user_roles.description is 'ロールの説明';
comment on column ff_users.user_roles.created_at is 'レコード作成日時';
comment on column ff_users.user_roles.updated_at is 'レコード更新日時';

-- トリガーの設定
create trigger update_user_roles_updated_at
    before update on ff_users.user_roles
    for each row
    execute function update_updated_at_column();

-- 初期データの投入
insert into ff_users.user_roles (name, description) values
    ('SYSTEM_ADMIN', 'システム全体の管理権限を持つ最上位ロール。ユーザー管理、システム設定、監査ログの確認など、すべての機能にアクセス可能。'),
    ('USER', '一般ユーザー。基本的な機能へのアクセスが可能。'),
    ('CONTRIBUTOR', 'プロジェクトへの貢献者。コードの提供やバグ修正が可能。'),
    ('CORE_CONTRIBUTOR', '主要な貢献者。重要な機能の開発やレビューが可能。'),
    ('MAINTAINER', 'プロジェクトのメンテナー。リリース管理やPRのマージが可能。'),
    ('GUEST', 'ゲストユーザー。限定的な閲覧権限のみを持つ一時的なアクセスロール。')
on conflict (name) do update set
    description = EXCLUDED.description; 