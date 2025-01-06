-- データベースの初期化

-- 既存のスキーマを削除
DROP SCHEMA IF EXISTS ff_users CASCADE;
DROP SCHEMA IF EXISTS ff_skills CASCADE;
DROP SCHEMA IF EXISTS ff_learning CASCADE;
DROP SCHEMA IF EXISTS ff_tasks CASCADE;
DROP SCHEMA IF EXISTS ff_gamification CASCADE;
DROP SCHEMA IF EXISTS ff_achievements CASCADE;
DROP SCHEMA IF EXISTS ff_focus CASCADE;
DROP SCHEMA IF EXISTS ff_goals CASCADE;
DROP SCHEMA IF EXISTS ff_habits CASCADE;
DROP SCHEMA IF EXISTS ff_logs CASCADE;
DROP SCHEMA IF EXISTS ff_party CASCADE;
DROP SCHEMA IF EXISTS ff_quest CASCADE;
DROP SCHEMA IF EXISTS ff_schedules CASCADE;
DROP SCHEMA IF EXISTS ff_social CASCADE;
DROP SCHEMA IF EXISTS ff_time_table CASCADE;
DROP SCHEMA IF EXISTS ff_statistics CASCADE;
DROP SCHEMA IF EXISTS ff_seasons CASCADE;
DROP SCHEMA IF EXISTS ff_notifications CASCADE;
DROP SCHEMA IF EXISTS ff_subscriptions CASCADE;

-- 新しいスキーマを作成
CREATE SCHEMA ff_agents;
CREATE SCHEMA ff_focus;
CREATE SCHEMA ff_gamification;
CREATE SCHEMA ff_habits;
CREATE SCHEMA ff_logs;
CREATE SCHEMA ff_notifications;
CREATE SCHEMA ff_schedules;
CREATE SCHEMA ff_skills;
CREATE SCHEMA ff_social;
CREATE SCHEMA ff_tasks;
CREATE SCHEMA ff_users;
CREATE SCHEMA ff_notes;
CREATE SCHEMA common;

-- スキーマの作成確認
SELECT schema_name 
FROM information_schema.schemata 
WHERE schema_name LIKE 'ff_%';

-- 拡張機能の確認
SELECT * FROM pg_extension;

-- 共通スキーマの作成
CREATE SCHEMA IF NOT EXISTS common;

-- 更新時刻を自動更新する関数
CREATE OR REPLACE FUNCTION common.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 注意事項:
-- 1. このスクリプトを実行する前に、必ずデータのバックアップを取得してください
-- 2. スキーマの削除は取り消せない操作です
-- 3. 実行後、各スキーマに対して適切なRLSポリシーを設定する必要があります
-- 4. 本番環境での実行は、メンテナンス時間中に行うことを推奨します 