-- usersスキーマへの移動
alter table if exists public.user_profiles set schema users;
alter table if exists public.user_settings set schema users;
alter table if exists public.user_roles set schema users;
alter table if exists public.user_role_mappings set schema users;

-- skillsスキーマへの移動
alter table if exists public.skill_categories set schema skills;
alter table if exists public.skill_details set schema skills;
alter table if exists public.skill_ranks set schema skills;
alter table if exists public.skill_evaluations set schema skills;
alter table if exists public.user_skills set schema skills;

-- learningスキーマへの移動
alter table if exists public.learning_resources set schema learning;
alter table if exists public.learning_paths set schema learning;
alter table if exists public.learning_path_resources set schema learning;
alter table if exists public.user_learning_paths set schema learning;
alter table if exists public.learning_resource_recommendations set schema learning;
alter table if exists public.user_learning_progress set schema learning;
alter table if exists public.learning_resource_reviews set schema learning;

-- tasksスキーマへの移動
alter table if exists public.tasks set schema tasks;
alter table if exists public.task_breakdowns set schema tasks;
alter table if exists public.task_groups set schema tasks;
alter table if exists public.task_group_memberships set schema tasks;
alter table if exists public.task_relationships set schema tasks;
alter table if exists public.task_dependencies set schema tasks;
alter table if exists public.task_experience set schema tasks;
alter table if exists public.task_reminders set schema tasks;
alter table if exists public.projects set schema tasks;

-- gamificationスキーマへの移動
alter table if exists public.user_levels set schema gamification;
alter table if exists public.level_settings set schema gamification;
alter table if exists public.quests set schema gamification;
alter table if exists public.user_quests set schema gamification;

-- achievementsスキーマへの移動
alter table if exists public.badges set schema achievements;
alter table if exists public.user_badges set schema achievements;

-- focusスキーマへの移動
alter table if exists public.focus_sessions set schema focus;
alter table if exists public.schedules set schema focus;
alter table if exists public.schedule_tasks set schema focus;

-- パーティションテーブルの移動（focus_sessions_y2024mXX）
do $$
begin
    for i in 1..12 loop
        execute format(
            'alter table if exists public.focus_sessions_y2024m%s set schema focus',
            lpad(i::text, 2, '0')
        );
    end loop;
end $$;

-- 各スキーマのオブジェクト権限を設定
do $$
declare
    schema_name text;
begin
    for schema_name in select unnest(array['users', 'skills', 'learning', 'tasks', 'gamification', 'achievements', 'focus'])
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