-- プロジェクト関連の拡張機能
create extension if not exists moddatetime schema extensions;

-- ff_tasksスキーマの作成
create schema if not exists ff_tasks;

-- プロジェクト関連の型定義
create type ff_tasks.project_status as enum (
    'not_started',
    'in_progress',
    'completed',
    'on_hold',
    'cancelled'
);

create type ff_tasks.project_priority as enum (
    'urgent',
    'high',
    'medium',
    'low'
);

create type ff_tasks.activity_type as enum (
    'project_create',
    'project_update',
    'project_archive',
    'task_create',
    'task_update',
    'task_delete',
    'member_add',
    'member_remove',
    'member_role_update'
);

-- プロジェクトテーブル
create table if not exists ff_tasks.projects (
    id uuid primary key default uuid_generate_v4(),
    name text not null,
    description text,
    status ff_tasks.project_status not null default 'not_started',
    priority ff_tasks.project_priority not null default 'medium',
    color text default 'default',
    start_date timestamp with time zone,
    end_date timestamp with time zone,
    owner_id uuid not null references auth.users(id) on delete cascade,
    is_archived boolean not null default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- プロジェクトメンバーシップテーブル
create table if not exists ff_tasks.project_members (
    project_id uuid references ff_tasks.projects(id) on delete cascade,
    user_id uuid references auth.users(id) on delete cascade,
    role text not null check (role in ('owner', 'admin', 'member', 'viewer')),
    joined_at timestamp with time zone default now(),
    primary key (project_id, user_id)
);

-- プロジェクトアクティビティテーブル
create table if not exists ff_tasks.project_activities (
    id uuid primary key default uuid_generate_v4(),
    project_id uuid not null references ff_tasks.projects(id) on delete cascade,
    type ff_tasks.activity_type not null,
    action text not null,
    user_id uuid not null references auth.users(id) on delete cascade,
    details jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- インデックス
create index project_activities_project_id_idx on ff_tasks.project_activities(project_id);
create index project_activities_created_at_idx on ff_tasks.project_activities(created_at);
create index project_members_user_id_idx on ff_tasks.project_members(user_id);
create index projects_owner_id_idx on ff_tasks.projects(owner_id);

-- RLSポリシー
alter table ff_tasks.projects enable row level security;
alter table ff_tasks.project_members enable row level security;
alter table ff_tasks.project_activities enable row level security;

-- 既存のポリシーを削除
drop policy if exists "project_owner_select" on ff_tasks.projects;
drop policy if exists "project_member_select" on ff_tasks.projects;
drop policy if exists "project_owner_insert" on ff_tasks.projects;
drop policy if exists "project_owner_admin_update" on ff_tasks.projects;
drop policy if exists "project_owner_delete" on ff_tasks.projects;
drop policy if exists "membership_owner_select" on ff_tasks.project_members;
drop policy if exists "membership_admin_select" on ff_tasks.project_members;
drop policy if exists "activity_owner_select" on ff_tasks.project_activities;
drop policy if exists "activity_member_select" on ff_tasks.project_activities;

-- プロジェクトのRLSポリシー
-- プロジェクトの参照権限（オーナーまたはメンバー）
create policy "project_access" on ff_tasks.projects
    for select using (
        owner_id = auth.uid() -- オーナー
        or id in ( -- メンバー
            select project_id 
            from ff_tasks.project_members 
            where user_id = auth.uid()
        )
    );

-- プロジェクトの作成権限（認証済みユーザー）
create policy "project_insert" on ff_tasks.projects
    for insert with check (auth.uid() = owner_id);

-- プロジェクトの更新権限（オーナーのみ）
create policy "project_update" on ff_tasks.projects
    for update using (owner_id = auth.uid());

-- プロジェクトの削除権限（オーナーのみ）
create policy "project_delete" on ff_tasks.projects
    for delete using (owner_id = auth.uid());

-- メンバーシップのRLSポリシー
-- メンバーシップの参照権限（自分のメンバーシップのみ）
create policy "membership_access" on ff_tasks.project_members
    for select using (user_id = auth.uid());

-- アクティビティのRLSポリシー
-- アクティビティの参照権限（関連プロジェクトのメンバーのみ）
create policy "activity_access" on ff_tasks.project_activities
    for select using (
        project_id in (
            select id 
            from ff_tasks.projects 
            where owner_id = auth.uid() 
            or id in (
                select project_id 
                from ff_tasks.project_members 
                where user_id = auth.uid()
            )
        )
    );

-- 更新日時トリガー
create or replace trigger handle_updated_at before update on ff_tasks.projects
    for each row execute procedure moddatetime (updated_at);

create or replace trigger handle_activities_updated_at before update on ff_tasks.project_activities
    for each row execute procedure moddatetime (updated_at); 