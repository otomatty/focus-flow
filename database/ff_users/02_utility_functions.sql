-- updated_at列を更新する関数
create or replace function ff_users.update_updated_at_column()
returns trigger as $$
begin
    -- タイムスタンプをUTCで保存
    new.updated_at = (now() at time zone 'UTC');
    return new;
end;
$$ language plpgsql;

-- キャッシュバージョンを更新する関数
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
comment on function ff_users.update_updated_at_column() is 'レコードの更新日時を自動的に更新するトリガー関数';
comment on function ff_users.update_cache_version() is 'キャッシュバージョンを自動的にインクリメントするトリガー関数';

-- 共通のバリデーション関数
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