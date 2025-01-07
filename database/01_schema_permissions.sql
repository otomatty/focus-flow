-- カスタムスキーマの権限設定
DO $$ 
DECLARE 
    schema_name text;
BEGIN
    FOR schema_name IN 
        SELECT unnest(ARRAY[
            'ff_agents',
            'ff_focus',
            'ff_gamification',
            'ff_habits',
            'ff_logs',
            'ff_notifications',
            'ff_schedules',
            'ff_skills',
            'ff_social',
            'ff_tasks',
            'ff_users',
            'ff_notes',
            'common',
            'auth'
        ])
    LOOP
        -- スキーマの権限設定
        EXECUTE format('GRANT USAGE ON SCHEMA %I TO postgres, anon, authenticated, service_role', schema_name);
        EXECUTE format('GRANT ALL ON ALL TABLES IN SCHEMA %I TO postgres, anon, authenticated, service_role', schema_name);
        EXECUTE format('GRANT ALL ON ALL ROUTINES IN SCHEMA %I TO postgres, anon, authenticated, service_role', schema_name);
        EXECUTE format('GRANT ALL ON ALL SEQUENCES IN SCHEMA %I TO postgres, anon, authenticated, service_role', schema_name);

        -- デフォルト権限の設定
        EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA %I GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role', schema_name);
        EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA %I GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role', schema_name);
        EXECUTE format('ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA %I GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role', schema_name);
    END LOOP;
END $$;

-- 注意事項:
-- 1. このスクリプトを実行する前に、00_init.sqlを実行してスキーマを作成してください
-- 2. Supabaseのダッシュボード > Settings > API > Config > Exposed Schemasに
--    上記のスキーマを追加する必要があります
-- 3. 実際のプロダクション環境では、より細かい権限設定を検討してください
-- 4. RLSポリシーは別途設定が必要です 