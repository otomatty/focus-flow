-- 既存の権限を取り消し
revoke all privileges on all tables in schema cron from service_role cascade;
revoke all privileges on all routines in schema cron from service_role cascade;
revoke all privileges on all sequences in schema cron from service_role cascade;
revoke usage on schema cron from service_role cascade;

-- pg_cron拡張の作成
create extension if not exists pg_cron;

-- コメント
comment on extension pg_cron is 'PostgreSQLのジョブスケジューリング拡張機能';

-- pg_cronの権限設定
grant usage on schema cron to service_role;
grant all privileges on all tables in schema cron to service_role;
grant all privileges on all sequences in schema cron to service_role;
grant all privileges on all routines in schema cron to service_role;

-- cron jobsの実行権限を設定
grant execute on function ff_logs.cleanup_old_logs(integer) to service_role;
grant execute on function ff_focus.create_focus_sessions_partition() to service_role;

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