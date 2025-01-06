-- publicスキーマのクリーンアップ

-- 既存のテーブルを確認するためのクエリ（コメントアウト状態で保持）
--------------------------------
-- SELECT tablename 
-- FROM pg_tables 
-- WHERE schemaname = 'public';
--------------------------------

-- 外部キー制約を一時的に無効化
SET session_replication_role = 'replica';

-- publicスキーマの全テーブルを削除
DROP TABLE IF EXISTS public.agents CASCADE;
DROP TABLE IF EXISTS public.user_agent_relationships CASCADE;
DROP TABLE IF EXISTS public.conversations CASCADE;
DROP TABLE IF EXISTS public.shared_experiences CASCADE;
DROP TABLE IF EXISTS public.relationship_parameter_history CASCADE;
DROP TABLE IF EXISTS public.conversation_evaluations CASCADE;
DROP TABLE IF EXISTS public.conversation_tags CASCADE;

-- 外部キー制約を再度有効化
SET session_replication_role = 'origin';

-- 削除確認のためのクエリ（コメントアウト状態で保持）
-- SELECT tablename 
-- FROM pg_tables 
-- WHERE schemaname = 'public';

-- 注意事項:
-- 1. このスクリプトを実行する前に、必ずデータのバックアップを取得してください
-- 2. テーブルの削除は取り消せない操作です
-- 3. publicスキーマ自体は削除しないでください（Supabaseの動作に必要です）
-- 4. 削除前に既存のテーブルを確認する場合は、コメントアウトされたクエリを使用してください
-- 5. 想定外のテーブルがある場合は、上記のDROP TABLE文を適宜追加してください 