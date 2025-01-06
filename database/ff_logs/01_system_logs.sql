-- ff_logsスキーマの作成
create schema if not exists ff_logs;

-- 更新を防ぐためのトリガー関数
CREATE OR REPLACE FUNCTION ff_logs.prevent_updates()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'Updates are not allowed on this table';
END;
$$ LANGUAGE plpgsql;

-- システムログテーブル
create table if not exists ff_logs.system_logs (
    id uuid primary key default uuid_generate_v4(),
    event_type text not null,
    event_source text not null,
    event_data jsonb not null default '{}'::jsonb,
    severity text not null default 'INFO' check (severity in ('INFO', 'WARNING', 'ERROR', 'CRITICAL')),
    created_by uuid references auth.users(id),
    created_at timestamp with time zone default now()
);

-- 更新防止トリガーの作成
CREATE TRIGGER no_updates
    BEFORE UPDATE ON ff_logs.system_logs
    FOR EACH ROW
    EXECUTE FUNCTION ff_logs.prevent_updates();

-- テーブルコメント
comment on table ff_logs.system_logs is 'システム全体のイベントログを記録するテーブル';

-- カラムコメント
comment on column ff_logs.system_logs.id is 'ログエントリの一意識別子';
comment on column ff_logs.system_logs.event_type is 'イベントの種類（例: USER_CREATED, ROLE_ASSIGNED等）';
comment on column ff_logs.system_logs.event_source is 'イベントが発生したソース（関数名やトリガー名）';
comment on column ff_logs.system_logs.event_data is 'イベントの詳細データ';
comment on column ff_logs.system_logs.severity is 'ログの重要度';
comment on column ff_logs.system_logs.created_by is 'イベントを発生させたユーザーのID';
comment on column ff_logs.system_logs.created_at is 'ログエントリの作成日時';

-- インデックス
create index if not exists idx_system_logs_event_type on ff_logs.system_logs(event_type);
create index if not exists idx_system_logs_severity on ff_logs.system_logs(severity);
create index if not exists idx_system_logs_created_at on ff_logs.system_logs(created_at desc);
create index if not exists idx_system_logs_created_by on ff_logs.system_logs(created_by);
create index if not exists idx_system_logs_event_source on ff_logs.system_logs(event_source);

-- イベントデータのJSONBインデックス（よく検索される可能性のあるフィールド）
create index if not exists idx_system_logs_event_data_user_id on ff_logs.system_logs((event_data->>'user_id'));
create index if not exists idx_system_logs_event_data_error_code on ff_logs.system_logs((event_data->>'error_code'));

-- ログ保持期間を管理するための関数
create or replace function ff_logs.cleanup_old_logs(retention_days integer default 90)
returns void as $$
begin
    delete from ff_logs.system_logs
    where created_at < now() - (retention_days || ' days')::interval;
end;
$$ language plpgsql security definer;

comment on function ff_logs.cleanup_old_logs(integer) is '指定された日数より古いログを削除する関数';

-- エラーログを記録するテーブル
CREATE TABLE ff_logs.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_detail TEXT,
    error_hint TEXT,
    error_context TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- エラーハンドリング用の関数
CREATE OR REPLACE FUNCTION ff_logs.log_error(
    p_function_name TEXT,
    p_error_message TEXT,
    p_error_detail TEXT DEFAULT NULL,
    p_error_hint TEXT DEFAULT NULL,
    p_error_context TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO ff_logs.error_logs (
        function_name,
        error_message,
        error_detail,
        error_hint,
        error_context
    ) VALUES (
        p_function_name,
        p_error_message,
        p_error_detail,
        p_error_hint,
        p_error_context
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- エラーログのクリーンアップ関数
CREATE OR REPLACE FUNCTION ff_logs.cleanup_error_logs(
    p_days_to_keep INTEGER DEFAULT 30
)
RETURNS void AS $$
BEGIN
    DELETE FROM ff_logs.error_logs
    WHERE created_at < current_timestamp - (p_days_to_keep || ' days')::interval;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- インデックスの作成
CREATE INDEX IF NOT EXISTS idx_error_logs_created_at 
ON ff_logs.error_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_error_logs_function_name 
ON ff_logs.error_logs(function_name);

-- RLSポリシーの設定
ALTER TABLE ff_logs.error_logs ENABLE ROW LEVEL SECURITY;

-- システム管理者のみがエラーログにアクセス可能
CREATE POLICY error_logs_admin_policy ON ff_logs.error_logs
    USING (
        EXISTS (
            SELECT 1 FROM ff_users.user_role_mappings urm
            JOIN ff_users.user_roles ur ON urm.role_id = ur.id
            WHERE urm.user_id = auth.uid()
            AND ur.name = 'SYSTEM_ADMIN'
        )
    );
