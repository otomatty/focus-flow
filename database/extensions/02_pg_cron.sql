-- ff_utilsスキーマの作成
create schema if not exists ff_utils;
comment on schema ff_utils is 'ユーティリティ関数とツールを管理するスキーマ';

-- pg_cronの設定
do language plpgsql $$
begin
    if current_database() = 'focus_flow' then
        raise notice 'pg_cron設定: データベース名は既に設定されています';
    end if;
end $$;

-- pg_cron拡張の作成
begin;

-- 既存の権限を取り消し
revoke all on all tables in schema cron from service_role cascade;
revoke all on schema cron from service_role cascade;

create extension if not exists pg_cron;

-- コメント
comment on extension pg_cron is 'PostgreSQLのジョブスケジューリング拡張機能';

-- pg_cronの権限設定
grant usage on schema cron to service_role;
grant all privileges on all tables in schema cron to service_role;
grant all privileges on all sequences in schema cron to service_role;
grant all privileges on all routines in schema cron to service_role;

-- cron jobsの実行権限を設定
grant execute on function ff_logs.cleanup_old_logs() to service_role;

-- cronジョブのメタデータテーブルへのアクセス権限
grant select, insert, update, delete on cron.job to service_role;
grant select, insert, update, delete on cron.job_run_details to service_role;

-- 将来作成されるオブジェクトに対する権限を設定
alter default privileges in schema cron
    grant all privileges on tables to service_role;
alter default privileges in schema cron
    grant all privileges on sequences to service_role;
alter default privileges in schema cron
    grant all privileges on routines to service_role;

commit;

-- エラーハンドリング用の関数
create or replace function ff_utils.handle_cron_job_error()
returns trigger as $$
begin
    -- ジョブ実行エラーをログに記録
    insert into ff_logs.system_logs (
        event_type,
        event_source,
        event_data,
        error_detail,
        created_by
    ) values (
        'CRON_JOB_ERROR',
        'pg_cron',
        jsonb_build_object(
            'job_id', new.jobid,
            'job_name', (select jobname from cron.job where jobid = new.jobid),
            'command', (select command from cron.job where jobid = new.jobid),
            'status', new.status,
            'return_message', new.return_message
        ),
        case 
            when new.status = 'failed' then 
                jsonb_build_object('error', new.return_message)
            else null
        end,
        null  -- システムによる自動記録
    );
    return new;
end;
$$ language plpgsql security definer;

-- cronジョブの実行結果を監視するトリガー
drop trigger if exists tr_monitor_cron_job_runs on cron.job_run_details;
create trigger tr_monitor_cron_job_runs
    after insert on cron.job_run_details
    for each row
    execute function ff_utils.handle_cron_job_error();

-- 既存のcronジョブをクリーンアップ
do $$
declare
    job_exists boolean;
begin
    -- ジョブが存在するか確認
    select exists(
        select 1 from cron.job where jobname = 'cleanup_old_logs'
    ) into job_exists;

    -- 存在する場合のみ削除
    if job_exists then
        perform cron.unschedule('cleanup_old_logs');
        raise notice 'cleanup_old_logsジョブを削除しました。';
    else
        raise notice 'cleanup_old_logsジョブは存在しません。新規作成します。';
    end if;
exception
    when others then
        raise notice 'ジョブのクリーンアップ中にエラーが発生しました: %', SQLERRM;
end $$;

-- cronジョブの再スケジュール
select cron.schedule(
    'cleanup_old_logs',                    -- ジョブ名
    '0 0 1 * *',                          -- 毎月1日の0:00に実行
    $$
    begin;
        select ff_logs.cleanup_old_logs();
    exception
        when others then
            -- エラーをログに記録
            insert into ff_logs.system_logs (
                event_type,
                event_source,
                event_data,
                error_detail,
                created_by
            ) values (
                'CLEANUP_LOGS_ERROR',
                'cleanup_old_logs',
                jsonb_build_object(
                    'error_code', SQLSTATE,
                    'error_message', SQLERRM
                ),
                jsonb_build_object(
                    'stack_trace', pg_exception_context(),
                    'error_detail', pg_exception_detail()
                ),
                null
            );
            raise;
    end;
    $$                                     -- トランザクションとエラーハンドリングを含むSQL
); 