-- ff_utilsスキーマの作成
create schema if not exists ff_utils;
comment on schema ff_utils is 'ユーティリティ関数とツールを管理するスキーマ';

-- エラーハンドリング用の関数
create or replace function ff_utils.log_cron_error(
    p_event_type text,
    p_event_source text,
    p_error_code text,
    p_error_message text
)
returns void as $$
begin
    insert into ff_logs.system_logs (
        event_type,
        event_source,
        event_data,
        severity,
        created_by
    ) values (
        p_event_type,
        p_event_source,
        jsonb_build_object(
            'error_code', p_error_code,
            'error_message', p_error_message
        ),
        'ERROR',
        null
    );
end;
$$ language plpgsql security definer;

-- 既存のcronジョブをクリーンアップ
do $$
declare
    job_exists boolean;
begin
    -- ログクリーンアップジョブの確認と削除
    select exists(
        select 1 from cron.job where jobname = 'cleanup_old_logs'
    ) into job_exists;

    if job_exists then
        perform cron.unschedule('cleanup_old_logs');
        raise notice 'cleanup_old_logsジョブを削除しました。';
    end if;

    -- パーティション作成ジョブの確認と削除
    select exists(
        select 1 from cron.job where jobname = 'create_focus_sessions_partition'
    ) into job_exists;

    if job_exists then
        perform cron.unschedule('create_focus_sessions_partition');
        raise notice 'create_focus_sessions_partitionジョブを削除しました。';
    end if;
exception
    when others then
        raise notice 'ジョブのクリーンアップ中にエラーが発生しました: %', SQLERRM;
end $$;

-- ログクリーンアップジョブのスケジュール
select cron.schedule(
    'cleanup_old_logs',                    -- ジョブ名
    '0 0 1 * *',                          -- 毎月1日の0:00に実行
    $$
    begin;
        select ff_logs.cleanup_old_logs(90);  -- デフォルトの90日を明示的に指定
    exception
        when others then
            perform ff_utils.log_cron_error(
                'CLEANUP_LOGS_ERROR',
                'cleanup_old_logs',
                SQLSTATE,
                SQLERRM
            );
            raise;
    end;
    $$
);

-- 集中セッションパーティション作成ジョブのスケジュール
select cron.schedule(
    'create_focus_sessions_partition',     -- ジョブ名
    '0 0 1 * *',                          -- 毎月1日の0:00に実行
    $$
    begin;
        select ff_focus.create_focus_sessions_partition();
    exception
        when others then
            perform ff_utils.log_cron_error(
                'CREATE_PARTITION_ERROR',
                'create_focus_sessions_partition',
                SQLSTATE,
                SQLERRM
            );
            raise;
    end;
    $$
); 

-- pg_cronを使用してスケジュール実行を設定
select cron.schedule(
    'create_focus_sessions_partition', -- ジョブの名前
    '0 0 1 * *',                      -- 毎月1日の午前0時に実行
    $$select ff_focus.create_focus_sessions_partition()$$
); 