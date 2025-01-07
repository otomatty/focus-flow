-- functionsスキーマの作成
create schema if not exists functions;

-- スキーマへの権限設定
grant usage on schema functions to authenticated;
grant usage on schema functions to service_role;

-- デフォルトの権限設定
alter default privileges in schema functions
    grant execute on functions to authenticated;

alter default privileges in schema functions
    grant execute on functions to service_role;

-- コメント
comment on schema functions is '共通関数を管理するスキーマ'; 