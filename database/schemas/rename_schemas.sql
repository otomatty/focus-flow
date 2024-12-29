-- スキーマ名の変更
alter schema users rename to ff_users;
alter schema skills rename to ff_skills;
alter schema learning rename to ff_learning;
alter schema tasks rename to ff_tasks;
alter schema gamification rename to ff_gamification;
alter schema achievements rename to ff_achievements;
alter schema focus rename to ff_focus;

-- サーチパスの更新
alter database postgres set search_path to "$user", auth, ff_users, ff_skills, ff_learning, ff_tasks, ff_gamification, ff_achievements, ff_focus, public;

-- スキーマの説明を更新
comment on schema ff_users is 'ユーザープロファイルと設定を管理するスキーマ';
comment on schema ff_skills is 'スキル関連のテーブルを管理するスキーマ';
comment on schema ff_learning is '学習リソース関連のテーブルを管理するスキーマ';
comment on schema ff_tasks is 'タスク関連のテーブルを管理するスキーマ';
comment on schema ff_gamification is 'レベルやクエスト関連のテーブルを管理するスキーマ';
comment on schema ff_achievements is 'バッジや実績関連のテーブルを管理するスキーマ';
comment on schema ff_focus is '集中セッション関連のテーブルを管理するスキーマ';

-- 各スキーマのテーブル一覧コメントを更新
comment on schema ff_users is E'ユーザープロファイルと設定を管理するスキーマ\n含まれるテーブル：\n- user_profiles\n- user_settings\n- user_roles\n- user_role_mappings';

comment on schema ff_skills is E'スキル関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- skill_categories\n- skill_details\n- skill_ranks\n- skill_evaluations\n- user_skills';

comment on schema ff_learning is E'学習リソース関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- learning_resources\n- learning_paths\n- learning_path_resources\n- user_learning_paths\n- learning_resource_recommendations\n- user_learning_progress\n- learning_resource_reviews';

comment on schema ff_tasks is E'タスク関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- tasks\n- task_breakdowns\n- task_groups\n- task_group_memberships\n- task_relationships\n- task_dependencies\n- task_experience\n- task_reminders';

comment on schema ff_gamification is E'レベルやクエスト関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- user_levels\n- level_settings\n- quests\n- user_quests';

comment on schema ff_achievements is E'バッジや実績関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- badges\n- user_badges';

comment on schema ff_focus is E'集中セッション関連のテーブルを管理するスキーマ\n含まれるテーブル：\n- focus_sessions\n- schedules\n- schedule_tasks';

-- 権限の再設定
do $$
declare
    schema_name text;
begin
    for schema_name in select unnest(array['ff_users', 'ff_skills', 'ff_learning', 'ff_tasks', 'ff_gamification', 'ff_achievements', 'ff_focus'])
    loop
        execute format('grant usage on schema %I to authenticated', schema_name);
        execute format('grant select on all tables in schema %I to authenticated', schema_name);
        execute format('grant insert, update, delete on all tables in schema %I to authenticated', schema_name);
        execute format('grant usage on all sequences in schema %I to authenticated', schema_name);
        
        -- service_roleに全ての権限を付与
        execute format('grant all privileges on all tables in schema %I to service_role', schema_name);
        execute format('grant all privileges on all sequences in schema %I to service_role', schema_name);
        
        -- 今後作成されるテーブルに対するデフォルト権限を設定
        execute format('alter default privileges in schema %I grant select, insert, update, delete on tables to authenticated', schema_name);
        execute format('alter default privileges in schema %I grant usage on sequences to authenticated', schema_name);
    end loop;
end $$; 