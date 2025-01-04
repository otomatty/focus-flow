-- 通知管理用のスキーマ作成
create schema if not exists ff_notifications;

-- 通知カテゴリマスターテーブル
create table if not exists ff_notifications.categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null unique,                   -- season, quest, focus, achievement など
    display_name text not null,                  -- 表示名
    description text,                            -- カテゴリの説明
    icon text,                                   -- アイコン識別子
    color text,                                  -- カラーコード
    priority integer default 0,                  -- 優先度（高いほど優先）
    is_active boolean default true,              -- カテゴリの有効/無効
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 通知テンプレートテーブル
create table if not exists ff_notifications.templates (
    id uuid primary key default uuid_generate_v4(),
    category_id uuid references ff_notifications.categories(id) not null,
    name text not null,                         -- テンプレート識別子
    title_template text not null,               -- タイトルテンプレート
    body_template text not null,                -- 本文テンプレート
    action_type text,                           -- link, modal, toast など
    action_data jsonb,                          -- アクション用のデータ
    priority integer default 0,                 -- 優先度（高いほど優先）
    is_active boolean default true,             -- テンプレートの有効/無効
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (category_id, name)
);

-- ユーザー通知設定テーブル
create table if not exists ff_notifications.user_preferences (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    category_id uuid references ff_notifications.categories(id) not null,
    email_enabled boolean default true,          -- メール通知の有効/無効
    push_enabled boolean default true,           -- プッシュ通知の有効/無効
    in_app_enabled boolean default true,         -- アプリ内通知の有効/無効
    quiet_hours jsonb default '{
        "enabled": false,
        "start_time": "22:00",
        "end_time": "07:00",
        "timezone": "Asia/Tokyo"
    }'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (user_id, category_id)
);

-- 通知テーブル
create table if not exists ff_notifications.notifications (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    category_id uuid references ff_notifications.categories(id) not null,
    template_id uuid references ff_notifications.templates(id) not null,
    title text not null,
    body text not null,
    action_type text,                           -- link, modal, toast など
    action_data jsonb,                          -- アクション用のデータ
    metadata jsonb default '{}'::jsonb,         -- 追加のメタデータ
    read_at timestamp with time zone,           -- 既読日時
    expires_at timestamp with time zone,        -- 有効期限
    priority integer default 0,                 -- 優先度（高いほど優先）
    status text not null default 'pending',     -- pending, sent, failed
    delivery_attempts jsonb default '[]'::jsonb, -- 配信試行履歴
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (status in ('pending', 'sent', 'failed'))
);

-- 通知配信履歴テーブル
create table if not exists ff_notifications.delivery_history (
    id uuid primary key default uuid_generate_v4(),
    notification_id uuid references ff_notifications.notifications(id) not null,
    delivery_type text not null,                -- email, push, in_app
    status text not null,                       -- success, failed
    provider text,                              -- 使用した配信プロバイダ
    provider_response jsonb,                    -- プロバイダからのレスポンス
    error_message text,                         -- エラーメッセージ（失敗時）
    created_at timestamp with time zone default now(),
    check (delivery_type in ('email', 'push', 'in_app')),
    check (status in ('success', 'failed'))
);

-- テーブルコメント
comment on table ff_notifications.categories is '通知カテゴリを管理するテーブル';
comment on table ff_notifications.templates is '通知テンプレートを管理するテーブル';
comment on table ff_notifications.user_preferences is 'ユーザーごとの通知設定を管理するテーブル';
comment on table ff_notifications.notifications is '通知を管理するテーブル';
comment on table ff_notifications.delivery_history is '通知配信履歴を管理するテーブル';

-- インデックス
create index if not exists idx_notifications_user on ff_notifications.notifications(user_id);
create index if not exists idx_notifications_category on ff_notifications.notifications(category_id);
create index if not exists idx_notifications_status on ff_notifications.notifications(status);
create index if not exists idx_notifications_created_at on ff_notifications.notifications(created_at);
create index if not exists idx_user_preferences_user on ff_notifications.user_preferences(user_id);
create index if not exists idx_delivery_history_notification on ff_notifications.delivery_history(notification_id);

-- 更新日時自動更新のトリガー関数
create or replace function ff_notifications.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 更新日時自動更新のトリガー
create trigger update_categories_updated_at
    before update on ff_notifications.categories
    for each row
    execute function ff_notifications.update_updated_at_column();

create trigger update_templates_updated_at
    before update on ff_notifications.templates
    for each row
    execute function ff_notifications.update_updated_at_column();

create trigger update_user_preferences_updated_at
    before update on ff_notifications.user_preferences
    for each row
    execute function ff_notifications.update_updated_at_column();

create trigger update_notifications_updated_at
    before update on ff_notifications.notifications
    for each row
    execute function ff_notifications.update_updated_at_column();

-- 通知作成関数
create or replace function ff_notifications.create_notification(
    p_user_id uuid,
    p_category_name text,
    p_template_name text,
    p_template_data jsonb
)
returns uuid as $$
declare
    v_category_id uuid;
    v_template_id uuid;
    v_notification_id uuid;
    v_template record;
    v_title text;
    v_body text;
begin
    -- カテゴリIDの取得
    select id into v_category_id
    from ff_notifications.categories
    where name = p_category_name and is_active = true;

    if not found then
        raise exception 'Category not found: %', p_category_name;
    end if;

    -- テンプレートの取得
    select id, title_template, body_template, action_type, action_data
    into v_template
    from ff_notifications.templates
    where category_id = v_category_id
    and name = p_template_name
    and is_active = true;

    if not found then
        raise exception 'Template not found: %', p_template_name;
    end if;

    -- テンプレートの展開
    v_title := ff_notifications.render_template(v_template.title_template, p_template_data);
    v_body := ff_notifications.render_template(v_template.body_template, p_template_data);

    -- 通知の作成
    insert into ff_notifications.notifications (
        user_id,
        category_id,
        template_id,
        title,
        body,
        action_type,
        action_data,
        metadata
    )
    values (
        p_user_id,
        v_category_id,
        v_template.id,
        v_title,
        v_body,
        v_template.action_type,
        v_template.action_data,
        p_template_data
    )
    returning id into v_notification_id;

    return v_notification_id;
end;
$$ language plpgsql;

-- テンプレート展開関数（簡易版）
create or replace function ff_notifications.render_template(
    p_template text,
    p_data jsonb
)
returns text as $$
declare
    v_result text;
    v_key text;
    v_value text;
begin
    v_result := p_template;
    
    for v_key, v_value in select * from jsonb_each_text(p_data)
    loop
        v_result := replace(v_result, '{{' || v_key || '}}', v_value);
    end loop;
    
    return v_result;
end;
$$ language plpgsql;

-- デフォルトカテゴリの作成
insert into ff_notifications.categories (name, display_name, description, icon, color, priority)
values
    ('season', 'シーズン', 'シーズン関連の通知', 'calendar', '#4CAF50', 100),
    ('quest', 'クエスト', 'クエスト関連の通知', 'task', '#2196F3', 90),
    ('focus', '集中セッション', '集中セッション関連の通知', 'timer', '#FF9800', 80),
    ('achievement', '実績', '実績達成の通知', 'trophy', '#9C27B0', 70)
on conflict (name) do nothing;

-- デフォルトテンプレートの作成
insert into ff_notifications.templates (
    category_id,
    name,
    title_template,
    body_template,
    action_type,
    action_data
)
select
    c.id,
    'season_end',
    'シーズン{{season_number}}が終了します',
    'シーズン{{season_number}}は{{end_date}}に終了します。最後まで頑張りましょう！',
    'link',
    '{"path": "/seasons/{{season_id}}"}'::jsonb
from ff_notifications.categories c
where c.name = 'season'
on conflict (category_id, name) do nothing; 