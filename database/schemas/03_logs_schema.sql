-- ff_logsスキーマの作成
create schema if not exists ff_logs;

comment on schema ff_logs is 'システムログを管理するスキーマ';

-- システムログテーブルの作成
create table if not exists ff_logs.system_logs (
    id uuid primary key default uuid_generate_v4(),
    event_type text not null,
    event_source text not null,
    event_data jsonb not null default '{}'::jsonb,
    error_detail jsonb,
    created_at timestamp with time zone default now(),
    created_by uuid references auth.users(id),
    check (event_type in (
        'DEFAULT_ROLE_ASSIGNED',
        'DEFAULT_ROLE_ASSIGNMENT_ERROR',
        'USER_CREATED',
        'USER_UPDATED',
        'USER_DELETED',
        'ROLE_ASSIGNED',
        'ROLE_REVOKED',
        'SETTINGS_UPDATED',
        'PROFILE_UPDATED',
        'LOGIN_SUCCESS',
        'LOGIN_FAILED',
        'LOGOUT',
        'PASSWORD_RESET_REQUESTED',
        'PASSWORD_RESET_COMPLETED',
        'EMAIL_VERIFICATION_REQUESTED',
        'EMAIL_VERIFICATION_COMPLETED',
        'SYSTEM_ERROR',
        'SECURITY_VIOLATION',
        'DATA_MIGRATION',
        'BACKUP_CREATED',
        'BACKUP_RESTORED'
    ))
);

-- テーブルコメント
comment on table ff_logs.system_logs is 'システム全体のイベントログを記録するテーブル';

-- カラムコメント
comment on column ff_logs.system_logs.id is 'ログエントリの一意識別子';
comment on column ff_logs.system_logs.event_type is 'イベントの種類';
comment on column ff_logs.system_logs.event_source is 'イベントが発生したソース（関数名やモジュール名）';
comment on column ff_logs.system_logs.event_data is 'イベントの詳細データ';
comment on column ff_logs.system_logs.error_detail is 'エラー発生時の詳細情報';
comment on column ff_logs.system_logs.created_at is 'ログエントリの作成日時';
comment on column ff_logs.system_logs.created_by is 'ログを作成したユーザーのID';

-- インデックス
create index if not exists idx_system_logs_event_type on ff_logs.system_logs (event_type);
create index if not exists idx_system_logs_created_at on ff_logs.system_logs (created_at);
create index if not exists idx_system_logs_created_by on ff_logs.system_logs (created_by);
create index if not exists idx_system_logs_event_source on ff_logs.system_logs (event_source);

-- パーティショニング用の関数
create or replace function ff_logs.create_system_logs_partition()
returns trigger as $$
declare
    partition_date text;
    partition_name text;
    start_date timestamp;
    end_date timestamp;
begin
    -- パーティション名の生成（YYYY_MM形式）
    partition_date := to_char(new.created_at, 'YYYY_MM');
    partition_name := 'system_logs_' || partition_date;
    
    -- パーティションの開始日と終了日を計算
    start_date := date_trunc('month', new.created_at);
    end_date := start_date + interval '1 month';
    
    -- パーティションが存在しない場合は作成
    if not exists (
        select 1
        from pg_class c
        join pg_namespace n on n.oid = c.relnamespace
        where n.nspname = 'ff_logs'
        and c.relname = partition_name
    ) then
        execute format(
            'create table if not exists ff_logs.%I partition of ff_logs.system_logs
            for values from (%L) to (%L)',
            partition_name,
            start_date,
            end_date
        );
        
        -- 新しいパーティションにインデックスを作成
        execute format(
            'create index if not exists %I on ff_logs.%I (event_type)',
            'idx_' || partition_name || '_event_type',
            partition_name
        );
        
        execute format(
            'create index if not exists %I on ff_logs.%I (created_at)',
            'idx_' || partition_name || '_created_at',
            partition_name
        );
    end if;
    
    return new;
end;
$$ language plpgsql;

-- パーティショニングトリガーの作成
create trigger tr_create_system_logs_partition
    before insert on ff_logs.system_logs
    for each row
    execute function ff_logs.create_system_logs_partition();

-- RLSの設定
alter table ff_logs.system_logs enable row level security;

-- システム管理者のみがログを参照可能
create policy "システム管理者のみログを参照可能"
    on ff_logs.system_logs for select
    using (ff_users.is_system_admin(auth.uid()));

-- システム管理者のみがログを作成可能
create policy "システム管理者のみログを作成可能"
    on ff_logs.system_logs for insert
    with check (ff_users.is_system_admin(auth.uid()));

-- 古いログを自動的に削除する関数
create or replace function ff_logs.cleanup_old_logs()
returns void as $$
declare
    retention_period interval := interval '1 year';
    cutoff_date timestamp with time zone;
    partition_record record;
begin
    cutoff_date := now() - retention_period;
    
    -- 古いパーティションを削除
    for partition_record in
        select tablename, schemaname
        from pg_tables
        where schemaname = 'ff_logs'
        and tablename like 'system_logs_%'
    loop
        if to_timestamp(
            split_part(partition_record.tablename, '_', 3) || '_' || 
            split_part(partition_record.tablename, '_', 4),
            'YYYY_MM'
        ) < cutoff_date then
            execute format('drop table if exists %I.%I', 
                partition_record.schemaname, 
                partition_record.tablename
            );
        end if;
    end loop;
end;
$$ language plpgsql security definer; 