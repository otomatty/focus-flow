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

-- プロジェクトのRLSポリシー
create policy "プロジェクトはメンバーが参照可能" on ff_tasks.projects
    for select using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = projects.id
            and user_id = auth.uid()
        )
    );

create policy "プロジェクトは認証済みユーザーが作成可能" on ff_tasks.projects
    for insert with check (auth.uid() = owner_id);

create policy "プロジェクトはオーナーと管理者のみが更新可能" on ff_tasks.projects
    for update using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = projects.id
            and user_id = auth.uid()
            and role in ('owner', 'admin')
        )
    );

create policy "プロジェクトはオーナーのみが削除可能" on ff_tasks.projects
    for delete using (auth.uid() = owner_id);

-- メンバーシップのRLSポリシー
create policy "メンバーシップはプロジェクトメンバーが参照可能" on ff_tasks.project_members
    for select using (
        exists (
            select 1 from ff_tasks.project_members pm
            where pm.project_id = project_members.project_id
            and pm.user_id = auth.uid()
        )
    );

-- アクティビティのRLSポリシー
create policy "アクティビティはプロジェクトメンバーが参照可能" on ff_tasks.project_activities
    for select using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = project_activities.project_id
            and user_id = auth.uid()
        )
    );

-- 更新日時トリガー
create trigger handle_updated_at before update on ff_tasks.projects
    for each row execute procedure moddatetime (updated_at);

create trigger handle_activities_updated_at before update on ff_tasks.project_activities
    for each row execute procedure moddatetime (updated_at); 