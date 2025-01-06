




-- ltreeモジュールの有効化（もし存在しない場合）
create extension if not exists ltree;

-- ビュータイプの列挙型を定義
create type ff_tasks.view_type as enum ('list', 'kanban', 'gantt', 'mindmap');

-- タスクグループテーブル
create table if not exists ff_tasks.task_groups (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid references ff_tasks.projects(id) on delete cascade,
    parent_group_id uuid references ff_tasks.task_groups(id),
    name text not null,
    description text,
    path ltree,
    active_view_type ff_tasks.view_type,
    metadata jsonb default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- メタデータの構造を検証
    constraint valid_metadata check (
        jsonb_typeof(metadata) = 'object' and
        (metadata ? 'icon' or not metadata ? 'icon') and
        (metadata ? 'color' or not metadata ? 'color') and
        (metadata ? 'custom_fields' or not metadata ? 'custom_fields')
    )
);

-- タスクグループのビュー設定テーブル
create table if not exists ff_tasks.task_group_views (
    id uuid primary key default uuid_generate_v4(),
    group_id uuid references ff_tasks.task_groups(id) on delete cascade,
    view_type ff_tasks.view_type,
    is_enabled boolean default true,
    settings jsonb default '{}',
    last_used_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(group_id, view_type)
);

-- デフォルトのビュー設定を定義する関数
create or replace function ff_tasks.get_default_view_settings(p_view_type ff_tasks.view_type)
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
create or replace function ff_tasks.initialize_view_settings()
returns trigger as $$
begin
    -- デフォルトのビュー設定を挿入
    insert into ff_tasks.task_group_views (group_id, view_type, settings)
    values
        (new.id, 'list', ff_tasks.get_default_view_settings('list')),
        (new.id, 'kanban', ff_tasks.get_default_view_settings('kanban')),
        (new.id, 'gantt', ff_tasks.get_default_view_settings('gantt')),
        (new.id, 'mindmap', ff_tasks.get_default_view_settings('mindmap'));
    
    return new;
end;
$$ language plpgsql;

create trigger initialize_task_group_views
    after insert on ff_tasks.task_groups
    for each row
    execute function ff_tasks.initialize_view_settings();

-- ビュー使用時のタイムスタンプ更新
create or replace function ff_tasks.update_view_last_used()
returns trigger as $$
begin
    update ff_tasks.task_group_views
    set last_used_at = now()
    where group_id = new.id
    and view_type = new.active_view_type;
    return new;
end;
$$ language plpgsql;

create trigger update_view_last_used_timestamp
    after update of active_view_type on ff_tasks.task_groups
    for each row
    execute function ff_tasks.update_view_last_used();

-- インデックスの作成
create index task_groups_path_idx on ff_tasks.task_groups using gist (path);
create index task_group_views_group_id_idx on ff_tasks.task_group_views(group_id);
create index task_group_views_view_type_idx on ff_tasks.task_group_views(view_type);
create index task_group_views_settings_idx on ff_tasks.task_group_views using gin(settings);

-- 親グループIDの制約を追加
alter table ff_tasks.task_groups
add constraint task_groups_no_circular_reference
check (parent_group_id != id);

-- グループの階層パスを自動で更新する関数
create or replace function ff_tasks.update_group_path()
returns trigger as $$
declare
    parent_path ltree;
begin
    if new.parent_group_id is null then
        new.path = text2ltree(new.id::text);
    else
        select path into parent_path from ff_tasks.task_groups where id = new.parent_group_id;
        if found then
            new.path = parent_path || text2ltree(new.id::text);
        end if;
    end if;
    return new;
end;
$$ language plpgsql;

-- グループ作成時にパスを自動設定するトリガー
create trigger set_group_path
    before insert or update of parent_group_id on ff_tasks.task_groups
    for each row
    execute function ff_tasks.update_group_path();

-- タイムスタンプ更新トリガー
create trigger handle_updated_at 
    before update on ff_tasks.task_groups
    for each row 
    execute procedure moddatetime (updated_at);

create trigger handle_views_updated_at
    before update on ff_tasks.task_group_views
    for each row
    execute procedure moddatetime (updated_at);

-- RLSポリシーの設定
alter table ff_tasks.task_groups enable row level security;
alter table ff_tasks.task_group_views enable row level security;

-- タスクグループのRLSポリシー
create policy "プロジェクトメンバーはタスクグループを参照可能"
    on ff_tasks.task_groups
    for select
    using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = task_groups.project_id
            and user_id = auth.uid()
        )
    );

create policy "プロジェクトメンバーはタスクグループを作成可能"
    on ff_tasks.task_groups
    for insert
    with check (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = task_groups.project_id
            and user_id = auth.uid()
            and role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクトメンバーはタスクグループを更新可能"
    on ff_tasks.task_groups
    for update
    using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = task_groups.project_id
            and user_id = auth.uid()
            and role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクト管理者はタスクグループを削除可能"
    on ff_tasks.task_groups
    for delete
    using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = task_groups.project_id
            and user_id = auth.uid()
            and role in ('OWNER', 'ADMIN')
        )
    );

create policy "システム管理者はタスクグループを管理可能"
    on ff_tasks.task_groups
    for all
    using (ff_users.is_system_admin(auth.uid()));

-- タスクグループビューのRLSポリシー
create policy "プロジェクトメンバーはビュー設定を参照可能"
    on ff_tasks.task_group_views
    for select
    using (
        exists (
            select 1 from ff_tasks.task_groups g
            join ff_tasks.project_members pm on g.project_id = pm.project_id
            where g.id = task_group_views.group_id
            and pm.user_id = auth.uid()
        )
    );

create policy "プロジェクトメンバーはビュー設定を更新可能"
    on ff_tasks.task_group_views
    for update
    using (
        exists (
            select 1 from ff_tasks.task_groups g
            join ff_tasks.project_members pm on g.project_id = pm.project_id
            where g.id = task_group_views.group_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "システム管理者はビュー設定を管理可能"
    on ff_tasks.task_group_views
    for all
    using (ff_users.is_system_admin(auth.uid()));

-- テーブルコメント
comment on table ff_tasks.task_groups is 'タスクをグループ化して管理するためのテーブル';
comment on table ff_tasks.task_group_views is 'タスクグループの表示設定を管理するテーブル';

-- カラムコメント
comment on column ff_tasks.task_groups.project_id is '所属するプロジェクトのID';
comment on column ff_tasks.task_groups.parent_group_id is '親グループのID';
comment on column ff_tasks.task_groups.name is 'グループ名';
comment on column ff_tasks.task_groups.description is 'グループの説明';
comment on column ff_tasks.task_groups.path is 'グループの階層構造を表すパス';
comment on column ff_tasks.task_groups.active_view_type is 'アクティブなビューの種類';
comment on column ff_tasks.task_groups.metadata is 'グループのメタデータ';

comment on column ff_tasks.task_group_views.group_id is '所属するグループのID';
comment on column ff_tasks.task_group_views.view_type is 'ビューの種類';
comment on column ff_tasks.task_group_views.is_enabled is 'ビューの有効/無効';
comment on column ff_tasks.task_group_views.settings is 'ビューの設定';
comment on column ff_tasks.task_group_views.last_used_at is '最後に使用した日時'; 