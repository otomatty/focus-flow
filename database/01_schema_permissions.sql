-- カスタムスキーマの権限設定

-- ff_agents スキーマの権限設定
GRANT USAGE ON SCHEMA ff_agents TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_agents TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_agents TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_agents TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_agents GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_agents GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_agents GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_focus スキーマの権限設定
GRANT USAGE ON SCHEMA ff_focus TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_focus TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_focus TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_focus TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_focus GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_focus GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_focus GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_gamification スキーマの権限設定
GRANT USAGE ON SCHEMA ff_gamification TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_gamification TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_gamification TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_gamification TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_gamification GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_gamification GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_gamification GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_habits スキーマの権限設定
GRANT USAGE ON SCHEMA ff_habits TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_habits TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_habits TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_habits TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_habits GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_habits GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_habits GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_logs スキーマの権限設定
GRANT USAGE ON SCHEMA ff_logs TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_logs TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_logs TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_logs TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_logs GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_logs GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_logs GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_notifications スキーマの権限設定
GRANT USAGE ON SCHEMA ff_notifications TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_notifications TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_notifications TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_notifications TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_notifications GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_notifications GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_notifications GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_schedules スキーマの権限設定
GRANT USAGE ON SCHEMA ff_schedules TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_schedules TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_schedules TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_schedules TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_schedules GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_schedules GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_schedules GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_skills スキーマの権限設定
GRANT USAGE ON SCHEMA ff_skills TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_skills TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_skills TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_skills TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_skills GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_skills GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_skills GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_social スキーマの権限設定
GRANT USAGE ON SCHEMA ff_social TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_social TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_social TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_social TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_social GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_social GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_social GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_tasks スキーマの権限設定
GRANT USAGE ON SCHEMA ff_tasks TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_tasks TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_tasks TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_tasks TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_tasks GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_tasks GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_tasks GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_users スキーマの権限設定
GRANT USAGE ON SCHEMA ff_users TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_users TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_users TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_users TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_users GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_users GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_users GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- common スキーマの権限設定
GRANT USAGE ON SCHEMA common TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA common TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA common TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA common TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA common GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA common GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA common GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- ff_notes スキーマの権限設定
GRANT USAGE ON SCHEMA ff_notes TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA ff_notes TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA ff_notes TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA ff_notes TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_notes GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_notes GRANT ALL ON ROUTINES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA ff_notes GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;

-- 注意事項:
-- 1. このスクリプトを実行する前に、00_init.sqlを実行してスキーマを作成してください
-- 2. Supabaseのダッシュボード > Settings > API > Config > Exposed Schemasに
--    上記のスキーマを追加する必要があります
-- 3. 実際のプロダクション環境では、より細かい権限設定を検討してください
-- 4. RLSポリシーは別途設定が必要です 