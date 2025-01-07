-- ユーザープロファイルテーブル
create table if not exists ff_users.user_profiles (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    display_name text,
    email text,
    profile_image text,
    bio text,                                    -- 自己紹介文
    title text,                                  -- 肩書き・役職
    location text,                               -- 所在地
    website text,                                -- 個人サイト/ポートフォリオ
    social_links jsonb default '{
        "github": null,
        "twitter": null,
        "linkedin": null,
        "facebook": null,
        "instagram": null
    }'::jsonb,                                   -- ソーシャルリンク
    languages text,                              -- 使用言語（単一言語）
    timezone text,                               -- タイムゾーン
    cache_version integer default 1,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.user_profiles is 'ユーザーのプロフィール情報を管理するテーブル';

-- カラムコメント
comment on column ff_users.user_profiles.id is 'プロフィールの一意識別子';
comment on column ff_users.user_profiles.user_id is 'ユーザーID';
comment on column ff_users.user_profiles.display_name is '表示名';
comment on column ff_users.user_profiles.email is 'メールアドレス';
comment on column ff_users.user_profiles.profile_image is 'プロフィール画像のURL';
comment on column ff_users.user_profiles.bio is '自己紹介文';
comment on column ff_users.user_profiles.title is '肩書き・役職';
comment on column ff_users.user_profiles.location is '所在地';
comment on column ff_users.user_profiles.website is '個人サイト/ポートフォリオのURL';
comment on column ff_users.user_profiles.social_links is 'ソーシャルメディアリンク';
comment on column ff_users.user_profiles.languages is '使用可能な言語';
comment on column ff_users.user_profiles.timezone is 'ユーザーのタイムゾーン';
comment on column ff_users.user_profiles.cache_version is 'キャッシュバージョン';
comment on column ff_users.user_profiles.created_at is 'レコード作成日時';
comment on column ff_users.user_profiles.updated_at is 'レコード更新日時';

-- 新規ユーザー登録時のプロフィール作成関数
create or replace function ff_users.create_user_profile()
returns trigger as $$
declare
    provider text;
    social_links_data jsonb;
    user_timezone text;
    error_details text;
begin
    -- システムログに記録
    begin
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'USER_PROFILE_CREATION_STARTED',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'email', new.email,
                'metadata', new.raw_user_meta_data
            ),
            null,
            'INFO'
        );
    exception when others then
        -- ログ記録に失敗してもプロファイル作成は続行
        error_details := SQLERRM;
        raise notice 'Failed to log profile creation start: %', error_details;
    end;

    -- 認証プロバイダーを取得
    begin
        provider := coalesce(new.raw_user_meta_data->>'provider', 'email');
    exception when others then
        error_details := SQLERRM;
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'ERROR_GETTING_PROVIDER',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'error', error_details
            ),
            null,
            'ERROR'
        );
        provider := 'email'; -- デフォルト値を設定
    end;
    
    -- プロバイダーに応じてソーシャルリンクを設定
    begin
        if provider = 'github' then
            social_links_data := jsonb_build_object(
                'github', new.raw_user_meta_data->>'html_url',
                'twitter', null,
                'linkedin', null,
                'facebook', null,
                'instagram', null
            );
        else
            social_links_data := '{
                "github": null,
                "twitter": null,
                "linkedin": null,
                "facebook": null,
                "instagram": null
            }'::jsonb;
        end if;
    exception when others then
        error_details := SQLERRM;
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'ERROR_SETTING_SOCIAL_LINKS',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'error', error_details
            ),
            null,
            'ERROR'
        );
        social_links_data := '{}'::jsonb; -- デフォルト値を設定
    end;

    -- タイムゾーンの設定（デフォルトはAsia/Tokyo）
    begin
        user_timezone := coalesce(new.raw_user_meta_data->>'timezone', 'Asia/Tokyo');
    exception when others then
        error_details := SQLERRM;
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'ERROR_SETTING_TIMEZONE',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'error', error_details
            ),
            null,
            'ERROR'
        );
        user_timezone := 'Asia/Tokyo'; -- デフォルト値を設定
    end;

    -- プロファイルの作成
    begin
        insert into ff_users.user_profiles (
            user_id,
            display_name,
            email,
            profile_image,
            social_links,
            timezone
        )
        values (
            new.id,
            coalesce(new.raw_user_meta_data->>'name', new.email),
            new.email,
            case 
                when provider = 'github' then new.raw_user_meta_data->>'avatar_url'
                when provider = 'google' then new.raw_user_meta_data->>'picture'
                else null
            end,
            social_links_data,
            user_timezone
        );
    exception when others then
        error_details := SQLERRM;
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'ERROR_CREATING_PROFILE',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'error', error_details,
                'provider', provider,
                'email', new.email
            ),
            null,
            'ERROR'
        );
        raise exception 'Failed to create user profile: %', error_details;
    end;

    -- 成功ログを記録
    begin
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'USER_PROFILE_CREATED',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'display_name', coalesce(new.raw_user_meta_data->>'name', new.email),
                'provider', provider
            ),
            null,
            'INFO'
        );
    exception when others then
        -- ログ記録に失敗してもプロファイル作成は完了しているので続行
        error_details := SQLERRM;
        raise notice 'Failed to log profile creation success: %', error_details;
    end;

    -- ユーザーロールを割り当て
    begin
        perform ff_users.assign_default_user_role(new);
    exception when others then
        error_details := SQLERRM;
        insert into ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            created_by,
            severity
        ) values (
            'ERROR_ASSIGNING_ROLE',
            'create_user_profile',
            jsonb_build_object(
                'user_id', new.id,
                'error', error_details
            ),
            null,
            'ERROR'
        );
        -- ロール割り当てに失敗してもプロファイル作成は完了しているので続行
        raise notice 'Failed to assign default role: %', error_details;
    end;

    return new;
end;
$$ language plpgsql security definer;

-- 新規ユーザー登録時のトリガー
drop trigger if exists tr_create_user_profile on auth.users;
create trigger tr_create_user_profile
    after insert on auth.users
    for each row
    order 10  -- プロフィール作成を最初に実行
    execute function ff_users.create_user_profile();

-- プロフィール更新時のトリガー
drop trigger if exists update_user_profiles_updated_at on ff_users.user_profiles;
create trigger update_user_profiles_updated_at
    before update on ff_users.user_profiles
    for each row
    execute function ff_users.update_updated_at_column();

drop trigger if exists update_user_profiles_cache_version on ff_users.user_profiles;
create trigger update_user_profiles_cache_version
    before update on ff_users.user_profiles
    for each row
    execute function ff_users.update_cache_version();

-- インデックス
create index if not exists idx_user_profiles_user_id on ff_users.user_profiles(user_id);
create index if not exists idx_user_profiles_email on ff_users.user_profiles(email);
create index if not exists idx_user_profiles_display_name on ff_users.user_profiles(display_name);

-- 既存のデータを移行するための関数
-- create or replace function ff_users.migrate_languages()
-- returns void as $$
-- begin
--     -- 一時的なテキストカラムを追加
--     alter table ff_users.user_profiles 
--     add column if not exists languages_new text;

--     -- 配列の最初の要素を新しいカラムに移行
--     update ff_users.user_profiles
--     set languages_new = (
--         case 
--             when languages is null then null
--             when array_length(languages, 1) > 0 then languages[1]
--             else null
--         end
--     );

--     -- 古いカラムを削除
--     alter table ff_users.user_profiles
--     drop column languages;

--     -- 新しいカラムの名前を変更
--     alter table ff_users.user_profiles
--     rename column languages_new to languages;
-- end;
-- $$ language plpgsql; 