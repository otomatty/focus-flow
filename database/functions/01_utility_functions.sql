-- updated_at更新用の関数
create or replace function update_updated_at_column()
returns trigger
security definer
set search_path = public
as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- コメント
comment on function update_updated_at_column() is 'updated_at列を現在のUTC時刻に自動更新するトリガー関数';

-- 権限の設定
grant execute on function update_updated_at_column() to authenticated;
grant execute on function update_updated_at_column() to service_role;

-- キャッシュバージョン更新用の関数
create or replace function ff_users.update_cache_version()
returns trigger as $$
begin
    new.cache_version = old.cache_version + 1;
    new.last_activity_at = now();
    return new;
end;
$$ language plpgsql;

-- ユーザーの権限チェック用関数
create or replace function ff_users.has_role(p_user_id uuid, p_role_name text)
returns boolean as $$
begin
    return exists (
        select 1
        from ff_users.user_role_mappings urm
        join ff_users.user_roles ur on urm.role_id = ur.id
        where urm.user_id = p_user_id
        and ur.name = p_role_name
        and urm.is_active = true
    );
end;
$$ language plpgsql; 