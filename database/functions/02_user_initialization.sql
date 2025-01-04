-- まず既存のトリガーを削除
drop trigger if exists tr_user_login on auth.users;

-- 既存の関数を削除
drop function if exists ff_users.initialize_user_data(uuid);
drop function if exists ff_logs.log_debug(text, text, jsonb);
drop function if exists auth.on_user_login();

-- デバッグログ用のテーブル作成
create table if not exists ff_logs.debug_logs (
    id uuid primary key default uuid_generate_v4(),
    function_name text not null,
    step_name text not null,
    log_data jsonb not null,
    created_at timestamp with time zone default now()
);

comment on table ff_logs.debug_logs is 'デバッグ用のログテーブル';

-- デバッグログ記録用の関数
create or replace function ff_logs.log_debug(
    function_name text,
    step_name text,
    log_data jsonb
) returns void as $$
begin
    insert into ff_logs.debug_logs (function_name, step_name, log_data)
    values (function_name, step_name, log_data);
exception
    when others then
        -- デバッグログの記録に失敗した場合でもエラーは発生させない
        raise notice 'デバッグログの記録に失敗: % - % - %', function_name, step_name, log_data;
end;
$$ language plpgsql security definer;

-- デーザーの初期化状態をチェックし、必要に応じて初期データを作成する関数
create or replace function ff_users.initialize_user_data(user_id uuid)
returns void as $$
declare
    current_user_id uuid;
    current_role text;
begin
    -- 実行コンテキストの記録
    select session_user::text, current_user::text into current_user_id, current_role;
    perform ff_logs.log_debug(
        'initialize_user_data',
        'start',
        jsonb_build_object(
            'user_id', user_id,
            'session_user', session_user,
            'current_user', current_user,
            'current_database', current_database(),
            'current_schema', current_schema()
        )
    );

    -- ユーザー設定のチェックと作成
    perform ff_logs.log_debug(
        'initialize_user_data',
        'checking_user_settings',
        jsonb_build_object(
            'user_id', user_id,
            'has_settings', exists (
                select 1
                from ff_users.user_settings
                where user_id = $1
            )
        )
    );

    if not exists (
        select 1
        from ff_users.user_settings
        where user_id = $1
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
            $1,
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
            'initialize_user_data',
            jsonb_build_object(
                'user_id', $1
            ),
            $1
        );
    end if;

exception
    when others then
        perform ff_logs.log_debug(
            'initialize_user_data',
            'fatal_error',
            jsonb_build_object(
                'error_code', SQLSTATE,
                'error_message', SQLERRM,
                'user_id', $1,
                'stack_trace', pg_exception_context()
            )
        );
        raise;
end;
$$ language plpgsql security definer;

comment on function ff_users.initialize_user_data(uuid) is 'ユーザーの初期化状態をチェックし、必要に応じて初期データを作成する関数';

-- RLSポリシーの設定
grant execute on function ff_users.initialize_user_data(uuid) to authenticated;

-- ログイン時のトリガー関数
create or replace function auth.on_user_login()
returns trigger as $$
begin
    perform ff_logs.log_debug(
        'on_user_login',
        'trigger_start',
        jsonb_build_object(
            'TG_OP', TG_OP,
            'new_id', new.id,
            'old_id', old.id,
            'session_user', session_user,
            'current_user', current_user
        )
    );

    -- ユーザーが完全に作成されていることを確認
    if TG_OP = 'UPDATE' and new.id is not null then
        begin
            perform ff_users.initialize_user_data(new.id);
            
            perform ff_logs.log_debug(
                'on_user_login',
                'initialization_success',
                jsonb_build_object(
                    'user_id', new.id
                )
            );
        exception
            when others then
                perform ff_logs.log_debug(
                    'on_user_login',
                    'initialization_error',
                    jsonb_build_object(
                        'error_code', SQLSTATE,
                        'error_message', SQLERRM,
                        'user_id', new.id
                    )
                );
                raise;
        end;
    end if;

    return new;
end;
$$ language plpgsql security definer;

-- ログイントリガーの設定（重複を削除）
drop trigger if exists tr_user_login on auth.users;
create trigger tr_user_login
    after update of last_sign_in_at on auth.users
    for each row
    execute function auth.on_user_login();

-- 権限の設定
grant usage on schema ff_logs to service_role, authenticated, anon;
grant insert, select on ff_logs.debug_logs to service_role, authenticated, anon;
grant execute on function ff_logs.log_debug(text, text, jsonb) to service_role, authenticated, anon;
grant execute on function ff_users.initialize_user_data(uuid) to authenticated;
grant execute on function auth.on_user_login() to authenticated; 