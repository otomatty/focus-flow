-- スキーマの作成
create schema if not exists users;
create schema if not exists skills;
create schema if not exists learning;
create schema if not exists tasks;
create schema if not exists gamification;
create schema if not exists achievements;
create schema if not exists focus;

-- スキーマへの権限設定
grant usage on schema users to authenticated;
grant usage on schema skills to authenticated;
grant usage on schema learning to authenticated;
grant usage on schema tasks to authenticated;
grant usage on schema gamification to authenticated;
grant usage on schema achievements to authenticated;
grant usage on schema focus to authenticated;

-- anon（未認証ユーザー）には最小限の権限のみ付与
grant usage on schema users to anon;

-- service_roleには全ての権限を付与
grant all on schema users to service_role;
grant all on schema skills to service_role;
grant all on schema learning to service_role;
grant all on schema tasks to service_role;
grant all on schema gamification to service_role;
grant all on schema achievements to service_role;
grant all on schema focus to service_role;

-- publicスキーマの権限を制限
revoke create on schema public from public;
revoke all on schema public from public;
grant usage on schema public to authenticated;
grant usage on schema public to anon;
grant all on schema public to service_role;

-- スキーマのサーチパスの設定
alter database postgres set search_path to "$user", auth, users, skills, learning, tasks, gamification, achievements, focus, public;

-- スキーマの説明
comment on schema users is 'ユーザープロファイルと設定を管理するスキーマ';
comment on schema skills is 'スキル関連のテーブルを管理するスキーマ';
comment on schema learning is '学習リソース関連のテーブルを管理するスキーマ';
comment on schema tasks is 'タスク関連のテーブルを管理するスキーマ';
comment on schema gamification is 'レベルやクエスト関連のテーブルを管理するスキーマ';
comment on schema achievements is 'バッジや実績関連のテーブルを管理するスキーマ';
comment on schema focus is '集中セッション関連のテーブルを管理するスキーマ';
comment on schema public is 'デフォルトのスキーマ（使用を最小限に抑える）';

-- 各スキーマに含まれるテーブル一覧をコメントとして追加
comment on schema users is E'ユーザープロファイルと設定を管理するスキーマ\n含まれるテーブル：\n- user_profiles\n- user_settings\n- user_roles\n- user_role_mappings';

comment on schema skills is E'スキル関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- skill_categories\n- skill_details\n- skill_ranks\n- skill_evaluations\n- user_skills';

comment on schema learning is E'学習リソース関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- learning_resources\n- learning_paths\n- learning_path_resources\n- user_learning_paths\n- learning_resource_recommendations\n- user_learning_progress\n- learning_resource_reviews';

comment on schema tasks is E'タスク関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- tasks\n- task_breakdowns\n- task_groups\n- task_group_memberships\n- task_relationships\n- task_dependencies\n- task_experience\n- task_reminders';

comment on schema gamification is E'レベルやクエスト関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- user_levels\n- level_settings\n- quests\n- user_quests';

comment on schema achievements is E'バッジや実績関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- badges\n- user_badges';

comment on schema focus is E'集中セッション関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- focus_sessions\n- schedules\n- schedule_tasks'; 