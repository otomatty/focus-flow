-- 既存のオブジェクトを削除
-- まずtask_groupsテーブルのトリガーを削除
drop trigger if exists update_view_last_used_timestamp on task_groups;
drop trigger if exists initialize_task_group_views on task_groups;
drop trigger if exists set_group_path on task_groups;
drop trigger if exists maintain_group_positions on task_groups;
drop trigger if exists task_groups_updated_at on task_groups;
drop trigger if exists update_task_groups_timestamp on task_groups;

-- 関数を削除
drop function if exists update_timestamp();
drop function if exists update_view_last_used();
drop function if exists initialize_view_settings();
drop function if exists get_default_view_settings(text);
drop function if exists update_group_path();
drop function if exists update_group_positions();
drop function if exists update_task_groups_updated_at();

-- インデックスを削除（テーブルが存在する場合のみ）
do $$
begin
    if exists (select 1 from pg_class where relname = 'task_group_views') then
        drop index if exists task_group_views_settings_idx;
        drop index if exists task_group_views_view_type_idx;
        drop index if exists task_group_views_group_id_idx;
    end if;
end$$;

drop index if exists task_groups_path_idx;

-- テーブルを削除
drop table if exists task_group_views;
drop table if exists task_groups cascade;

-- ltreeモジュールの有効化（もし存在しない場合）
create extension if not exists ltree;

-- タスクグループテーブル
create table if not exists task_groups (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references projects(id) on delete cascade,
    parent_group_id uuid references task_groups(id),
    name text not null,
    description text,
    path ltree,
    active_view_type text check (active_view_type in ('list', 'kanban', 'gantt', 'mindmap')),
    metadata jsonb default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- タスクグループのビュー設定テーブル
create table if not exists task_group_views (
    id uuid primary key default uuid_generate_v4(),
    group_id uuid references task_groups(id) on delete cascade,
    view_type text check (view_type in ('list', 'kanban', 'gantt', 'mindmap')),
    is_enabled boolean default true,
    settings jsonb default '{}',
    last_used_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(group_id, view_type)
);

-- デフォルトのビュー設定を定義する関数
create or replace function get_default_view_settings(p_view_type text)
returns jsonb as $$
begin
    return case p_view_type
        when 'list' then '{
            "sort_by": "due_date",
            "group_by": null,
            "positions": {},
            "expanded_groups": [],
            "filters": {}
        }'::jsonb
        when 'kanban' then '{
            "columns": ["not_started", "in_progress", "completed"],
            "swimlanes": [],
            "positions": {},
            "collapsed_columns": [],
            "filters": {}
        }'::jsonb
        when 'gantt' then '{
            "zoom_level": "day",
            "show_dependencies": true,
            "show_progress": true,
            "positions": {},
            "collapsed_groups": [],
            "filters": {},
            "timeline_start": null,
            "timeline_end": null
        }'::jsonb
        when 'mindmap' then '{
            "layout": "horizontal",
            "auto_layout": true,
            "positions": {},
            "expanded_nodes": [],
            "zoom_level": 1,
            "center_position": {"x": 0, "y": 0}
        }'::jsonb
        else '{}'::jsonb
    end;
end;
$$ language plpgsql;

-- ビュー設定の初期化トリガー
create or replace function initialize_view_settings()
returns trigger as $$
begin
    -- デフォルトのビュー設定を挿入
    insert into task_group_views (group_id, view_type, settings)
    values
        (new.id, 'list', get_default_view_settings('list')),
        (new.id, 'kanban', get_default_view_settings('kanban')),
        (new.id, 'gantt', get_default_view_settings('gantt')),
        (new.id, 'mindmap', get_default_view_settings('mindmap'));
    
    return new;
end;
$$ language plpgsql;

create trigger initialize_task_group_views
    after insert on task_groups
    for each row
    execute function initialize_view_settings();

-- ビュー使用時のタイムスタンプ更新
create or replace function update_view_last_used()
returns trigger as $$
begin
    update task_group_views
    set last_used_at = now()
    where group_id = new.id
    and view_type = new.active_view_type;
    return new;
end;
$$ language plpgsql;

create trigger update_view_last_used_timestamp
    after update of active_view_type on task_groups
    for each row
    execute function update_view_last_used();

-- インデックスの作成
create index task_groups_path_idx on task_groups using gist (path);
create index task_group_views_group_id_idx on task_group_views(group_id);
create index task_group_views_view_type_idx on task_group_views(view_type);
create index task_group_views_settings_idx on task_group_views using gin(settings);

-- 親グループIDの制約を追加
alter table task_groups
add constraint task_groups_no_circular_reference
check (parent_group_id != id);

-- グループの階層パスを自動で更新する関数
create or replace function update_group_path()
returns trigger as $$
declare
    parent_path ltree;
begin
    if new.parent_group_id is null then
        new.path = text2ltree(new.id::text);
    else
        select path into parent_path from task_groups where id = new.parent_group_id;
        if found then
            new.path = parent_path || text2ltree(new.id::text);
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

-- グループ作成時にパスを自動設定するトリガー
create trigger set_group_path
    before insert or update of parent_group_id on task_groups
    for each row
    execute function update_group_path();

-- タイムスタンプ更新トリガー
create or replace function update_timestamp()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_task_groups_timestamp
    before update on task_groups
    for each row
    execute function update_timestamp();

create trigger update_task_group_views_timestamp
    before update on task_group_views
    for each row
    execute function update_timestamp(); 