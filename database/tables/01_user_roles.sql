-- ユーザーロールマスターテーブル
create table if not exists ff_users.user_roles (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,
    description text,
    role_type text check (role_type in ('SYSTEM', 'CONTRIBUTOR', 'SPECIAL')),
    permissions jsonb default '[]'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.user_roles is 'ユーザーロールを管理するマスターテーブル';
comment on column ff_users.user_roles.id is 'ロールの一意識別子';
comment on column ff_users.user_roles.name is 'ロール名';
comment on column ff_users.user_roles.description is 'ロールの説明';
comment on column ff_users.user_roles.role_type is 'ロールの種類（SYSTEM/CONTRIBUTOR/SPECIAL）';
comment on column ff_users.user_roles.permissions is 'ロールに付与された権限のリスト';
comment on column ff_users.user_roles.created_at is 'レコード作成日時';
comment on column ff_users.user_roles.updated_at is 'レコード更新日時';

-- トリガーの設定
create trigger update_user_roles_updated_at
    before update on ff_users.user_roles
    for each row
    execute function update_updated_at_column();

-- 初期データの投入
insert into ff_users.user_roles (name, description, role_type, permissions) values
    ('SYSTEM_ADMIN', 'システム管理者', 'SYSTEM', '[
        "MANAGE_SYSTEM",
        "MANAGE_USERS",
        "MANAGE_ROLES",
        "MANAGE_CONTENT",
        "ACCESS_ADMIN_PANEL",
        "VIEW_ANALYTICS"
    ]'::jsonb),
    ('USER', '一般ユーザー', 'SYSTEM', '[
        "MANAGE_OWN_CONTENT",
        "USE_BASIC_FEATURES"
    ]'::jsonb),
    ('DEVELOPER', '開発者', 'CONTRIBUTOR', '[
        "ACCESS_DEV_TOOLS",
        "MANAGE_TEST_DATA",
        "VIEW_LOGS",
        "ACCESS_API_DOCS"
    ]'::jsonb),
    ('CONTENT_MODERATOR', 'コンテンツモデレーター', 'CONTRIBUTOR', '[
        "MODERATE_CONTENT",
        "MANAGE_REPORTS",
        "VIEW_USER_CONTENT"
    ]'::jsonb),
    ('COMMUNITY_MANAGER', 'コミュニティマネージャー', 'CONTRIBUTOR', '[
        "MANAGE_COMMUNITY",
        "MANAGE_EVENTS",
        "COLLECT_FEEDBACK",
        "SEND_ANNOUNCEMENTS"
    ]'::jsonb),
    ('TEMPLATE_CREATOR', 'テンプレート作成者', 'SPECIAL', '[
        "CREATE_OFFICIAL_TEMPLATES",
        "EDIT_TEMPLATES",
        "REVIEW_TEMPLATES"
    ]'::jsonb),
    ('BETA_TESTER', 'ベータテスター', 'SPECIAL', '[
        "ACCESS_BETA_FEATURES",
        "PROVIDE_FEEDBACK"
    ]'::jsonb),
    ('SUPPORT_AGENT', 'サポートエージェント', 'SPECIAL', '[
        "VIEW_SUPPORT_TICKETS",
        "MANAGE_SUPPORT_TICKETS",
        "VIEW_USER_INFO"
    ]'::jsonb)
on conflict (name) do update set
    description = EXCLUDED.description,
    role_type = EXCLUDED.role_type,
    permissions = EXCLUDED.permissions; 