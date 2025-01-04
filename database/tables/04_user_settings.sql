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
        "collaboration_requests": true,
        "achievement_updates": true,
        "learning_reminders": true,
        "focus_time_alerts": true,
        "daily_summaries": true,
        "weekly_reports": true
    }'::jsonb,
    collaboration_preferences jsonb default '{
        "preferred_times": [],
        "communication_style": "text",
        "collaboration_style": "async",
        "availability_hours": {
            "weekday": {"start": "09:00", "end": "17:00"},
            "weekend": {"start": null, "end": null}
        },
        "preferred_languages": ["ja"],
        "time_zone": "Asia/Tokyo"
    }'::jsonb,
    interface_preferences jsonb default '{
        "sidebar_position": "left",
        "default_view": "list",
        "font_size": "medium",
        "high_contrast": false,
        "animations_reduced": false,
        "keyboard_shortcuts_enabled": true
    }'::jsonb,
    privacy_settings jsonb default '{
        "profile_visibility": "public",
        "activity_visibility": "followers",
        "learning_history_visibility": "private",
        "show_online_status": true,
        "allow_messages_from": "all",
        "show_learning_progress": true
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
comment on column ff_users.user_settings.collaboration_preferences is 'コラボレーション設定';
comment on column ff_users.user_settings.interface_preferences is 'インターフェース設定';
comment on column ff_users.user_settings.privacy_settings is 'プライバシー設定';
comment on column ff_users.user_settings.created_at is 'レコード作成日時';
comment on column ff_users.user_settings.updated_at is 'レコード更新日時';

-- トリガー
drop trigger if exists update_user_settings_updated_at on ff_users.user_settings;
create trigger update_user_settings_updated_at
    before update on ff_users.user_settings
    for each row
    execute function ff_users.update_updated_at_column();

-- 新規ユーザーにデフォルト設定を付与するトリガー関数
create or replace function ff_users.assign_default_user_settings()
returns trigger as $$
begin
    -- ユーザーに設定が存在しない場合のみ、デフォルト設定を作成
    if not exists (
        select 1
        from ff_users.user_settings
        where user_id = new.id
    ) then
        insert into ff_users.user_settings (
            user_id,
            theme_color,
            notification_enabled,
            voice_input_enabled,
            focus_mode_restrictions,
            notification_preferences,
            collaboration_preferences,
            interface_preferences,
            privacy_settings
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
                "collaboration_requests": true,
                "achievement_updates": true,
                "learning_reminders": true,
                "focus_time_alerts": true,
                "daily_summaries": true,
                "weekly_reports": true
            }'::jsonb,
            '{
                "preferred_times": [],
                "communication_style": "text",
                "collaboration_style": "async",
                "availability_hours": {
                    "weekday": {"start": "09:00", "end": "17:00"},
                    "weekend": {"start": null, "end": null}
                },
                "preferred_languages": ["ja"],
                "time_zone": "Asia/Tokyo"
            }'::jsonb,
            '{
                "sidebar_position": "left",
                "default_view": "list",
                "font_size": "medium",
                "high_contrast": false,
                "animations_reduced": false,
                "keyboard_shortcuts_enabled": true
            }'::jsonb,
            '{
                "profile_visibility": "public",
                "activity_visibility": "followers",
                "learning_history_visibility": "private",
                "show_online_status": true,
                "allow_messages_from": "all",
                "show_learning_progress": true
            }'::jsonb
        );

        -- ログ記録
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
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- auth.usersテーブルに対するトリガーを作成
drop trigger if exists tr_assign_default_user_settings on auth.users;
create trigger tr_assign_default_user_settings
    after insert on auth.users
    for each row
    execute function ff_users.assign_default_user_settings(); 