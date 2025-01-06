-- ユーザー設定テーブル
create table if not exists ff_users.user_settings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    theme_color text default 'default',
    notification_enabled boolean default true,
    voice_input_enabled boolean default true,
    focus_mode_restrictions jsonb default '{
        "social_media": true,
        "entertainment": true,
        "shopping": false,
        "news": false,
        "custom_urls": []
    }'::jsonb,
    notification_preferences jsonb default '{
        "email": true,
        "push": true,
        "focus_time_alerts": true,
        "daily_summaries": true,
        "weekly_reports": true
    }'::jsonb,
    interface_preferences jsonb default '{
        "sidebar_position": "left",
        "default_view": "list",
        "font_size": "medium",
        "high_contrast": false,
        "animations_reduced": false,
        "keyboard_shortcuts_enabled": true
    }'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.user_settings is 'ユーザーの設定情報を管理するテーブル';

-- カラムコメント
comment on column ff_users.user_settings.id is '設定の一意識別子';
comment on column ff_users.user_settings.user_id is 'ユーザーID';
comment on column ff_users.user_settings.theme_color is 'UIテーマカラー';
comment on column ff_users.user_settings.notification_enabled is '通知の有効/無効';
comment on column ff_users.user_settings.voice_input_enabled is '音声入力の有効/無効';
comment on column ff_users.user_settings.focus_mode_restrictions is 'フォーカスモード時の制限設定';
comment on column ff_users.user_settings.notification_preferences is '詳細な通知設定';
comment on column ff_users.user_settings.interface_preferences is 'インターフェース設定';
comment on column ff_users.user_settings.created_at is 'レコード作成日時';
comment on column ff_users.user_settings.updated_at is 'レコード更新日時';

-- トリガー
create trigger update_user_settings_updated_at
    before update on ff_users.user_settings
    for each row
    execute function ff_users.update_updated_at_column();

-- 新規ユーザーにデフォルト設定を付与するトリガー関数
create or replace function ff_users.assign_default_user_settings()
returns trigger as $$
begin
    insert into ff_users.user_settings (
        user_id,
        theme_color,
        notification_enabled,
        voice_input_enabled,
        focus_mode_restrictions,
        notification_preferences,
        interface_preferences
    ) values (
        new.id,
        'default',
        true,
        true,
        '{
            "social_media": true,
            "entertainment": true,
            "shopping": false,
            "news": false,
            "custom_urls": []
        }'::jsonb,
        '{
            "email": true,
            "push": true,
            "focus_time_alerts": true,
            "daily_summaries": true,
            "weekly_reports": true
        }'::jsonb,
        '{
            "sidebar_position": "left",
            "default_view": "list",
            "font_size": "medium",
            "high_contrast": false,
            "animations_reduced": false,
            "keyboard_shortcuts_enabled": true
        }'::jsonb
    );

    -- システムログに記録
    insert into ff_logs.system_logs (
        event_type,
        event_source,
        event_data,
        created_by
    ) values (
        'DEFAULT_SETTINGS_CREATED',
        'assign_default_user_settings',
        jsonb_build_object(
            'user_id', new.id
        ),
        new.id
    );

    return new;
end;
$$ language plpgsql security definer;

-- トリガーの設定
create trigger tr_assign_default_user_settings
    after insert on auth.users
    for each row
    execute function ff_users.assign_default_user_settings(); 