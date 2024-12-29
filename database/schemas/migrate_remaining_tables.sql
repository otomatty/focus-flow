-- 特定のテーブルをff_tasksスキーマに移動
alter table if exists public.project_activities set schema ff_tasks;
alter table if exists public.project_tasks set schema ff_tasks;
alter table if exists public.task_group_views set schema ff_tasks;

-- publicスキーマの残りのテーブルをff_skillsスキーマに移動
do $$
declare
    table_name text;
begin
    -- 既知のスキーマに属するテーブルを除外し、publicスキーマの全テーブルを取得
    for table_name in 
        select tablename 
        from pg_tables 
        where schemaname = 'public'
        and tablename not like 'spatial_ref_sys' -- PostGISのシステムテーブルを除外
        and tablename not like 'schema_migrations' -- マイグレーション管理テーブルを除外
        and tablename not like 'pg_%' -- PostgreSQLのシステムテーブルを除外
    loop
        execute format('alter table if exists public.%I set schema ff_skills', table_name);
        raise notice 'Moving table % to ff_skills schema', table_name;
    end loop;
end $$;

-- 移動したテーブルの一覧を表示
select 
    schemaname as schema_name,
    tablename as table_name
from pg_tables 
where schemaname in ('ff_tasks', 'ff_skills')
order by schemaname, tablename; 