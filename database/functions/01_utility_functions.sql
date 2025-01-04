-- updated_at更新用の関数
create or replace function ff_users.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

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