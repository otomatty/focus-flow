-- スキーマアクセス権限の更新
ALTER ROLE anon SET search_path TO public, ff_users, ff_skills, ff_learning, ff_tasks, ff_gamification, ff_achievements, ff_focus, ff_goals, ff_habits, ff_logs, ff_party, ff_quest, ff_schedules, ff_social, ff_time_table;
ALTER ROLE authenticated SET search_path TO public, ff_users, ff_skills, ff_learning, ff_tasks, ff_gamification, ff_achievements, ff_focus, ff_goals, ff_habits, ff_logs, ff_party, ff_quest, ff_schedules, ff_social, ff_time_table;
ALTER ROLE service_role SET search_path TO public, ff_users, ff_skills, ff_learning, ff_tasks, ff_gamification, ff_achievements, ff_focus, ff_goals, ff_habits, ff_logs, ff_party, ff_quest, ff_schedules, ff_social, ff_time_table;

-- 各スキーマへのアクセス権限付与
GRANT USAGE ON SCHEMA ff_users TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_skills TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_learning TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_tasks TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_gamification TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_achievements TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_focus TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_goals TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_habits TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_logs TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_party TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_quest TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_schedules TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_social TO anon, authenticated;
GRANT USAGE ON SCHEMA ff_time_table TO anon, authenticated;

-- 各スキーマのテーブルへのアクセス権限付与（既存および今後作成されるテーブル）
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_users GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_skills GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_learning GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_tasks GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_gamification GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_achievements GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_focus GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_goals GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_habits GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_logs GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_party GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_quest GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_schedules GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_social GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;
ALTER DEFAULT PRIVILEGES IN SCHEMA ff_time_table GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO authenticated;

-- 既存のテーブルへのアクセス権限付与
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_users TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_skills TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_learning TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_tasks TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_gamification TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_achievements TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_focus TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_goals TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_habits TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_logs TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_party TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_quest TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_schedules TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_social TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA ff_time_table TO authenticated;

-- シーケンスへのアクセス権限付与
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_users TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_skills TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_learning TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_tasks TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_gamification TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_achievements TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_focus TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_goals TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_habits TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_logs TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_party TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_quest TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_schedules TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_social TO authenticated;
GRANT USAGE ON ALL SEQUENCES IN SCHEMA ff_time_table TO authenticated; 