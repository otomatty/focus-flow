-- pg_trgm拡張機能の作成
create extension if not exists pg_trgm;

-- コメント
comment on extension pg_trgm is 'テキスト類似性検索と文字列マッチングのための拡張機能';

-- 権限の設定
grant execute on all functions in schema public to service_role;

-- 将来作成されるオブジェクトに対する権限を設定
alter default privileges in schema public
    grant all privileges on functions to service_role; 