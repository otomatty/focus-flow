-- ff_usersスキーマの作成
create schema if not exists ff_users;

-- updated_at列を更新する関数
create or replace function ff_users.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = current_timestamp;
    return new;
end;
$$ language plpgsql;

-- キャッシュバージョンを更新する関数
create or replace function ff_users.update_cache_version()
returns trigger as $$
begin
    new.cache_version = old.cache_version + 1;
    return new;
end;
$$ language plpgsql; 