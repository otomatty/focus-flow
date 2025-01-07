-- 依存関係のあるトリガーを削除
drop trigger if exists update_user_profiles_cache_version on ff_users.user_profiles;

-- キャッシュバージョンを更新する関数
drop function if exists ff_users.update_cache_version();
create or replace function ff_users.update_cache_version()
returns trigger as $$
begin
    -- nullの場合は1から開始
    if new.cache_version is null then
        new.cache_version := 1;
    else
        new.cache_version := coalesce(old.cache_version, 0) + 1;
    end if;
    return new;
end;
$$ language plpgsql;

-- テーブルコメント
comment on function ff_users.update_cache_version() is 'キャッシュバージョンを自動的にインクリメントするトリガー関数';

-- 共通のバリデーション関数
drop function if exists ff_users.validate_timezone(text);
create or replace function ff_users.validate_timezone(timezone text)
returns boolean as $$
begin
    return timezone is null or exists (
        select 1 from pg_timezone_names where name = timezone
    );
end;
$$ language plpgsql;

comment on function ff_users.validate_timezone(text) is 'タイムゾーン文字列が有効かどうかを検証する関数';

-- ユーザーのロールを確認するユーティリティ関数

-- システム管理者かどうかを確認する関数
drop function if exists ff_users.is_system_admin(uuid);
create or replace function ff_users.is_system_admin(user_id uuid)
returns boolean as $$
begin
    return exists (
        select 1
        from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on ur.id = urm.role_id
        where urm.user_id = user_id
        and ur.name = 'SYSTEM_ADMIN'
    );
end;
$$ language plpgsql security definer;

comment on function ff_users.is_system_admin(uuid) is 'ユーザーがシステム管理者ロールを持っているかどうかを確認する関数';

-- 特定のロールを持っているかどうかを確認する関数
drop function if exists ff_users.has_role(uuid, text);
create or replace function ff_users.has_role(user_id uuid, role_name text)
returns boolean as $$
begin
    return exists (
        select 1
        from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on ur.id = urm.role_id
        where urm.user_id = user_id
        and ur.name = role_name
    );
end;
$$ language plpgsql security definer;

comment on function ff_users.has_role(uuid, text) is 'ユーザーが指定されたロールを持っているかどうかを確認する関数';

-- キャッシュバージョン更新トリガーの再作成
create trigger update_user_profiles_cache_version
    before update on ff_users.user_profiles
    for each row
    execute function ff_users.update_cache_version(); 