-- プロジェクト関連の拡張機能
create extension if not exists moddatetime schema extensions;

-- プロジェクトの列挙型
create type project_status as enum ('not_started', 'in_progress', 'completed', 'on_hold');
create type project_priority as enum ('high', 'medium', 'low');

-- アクティビティの種類を定義
create type activity_type as enum (
  'project_update',  -- プロジェクトの更新
  'task_create',     -- タスクの作成
  'task_update',     -- タスクの更新
  'task_delete',     -- タスクの削除
  'member_update'    -- メンバー関連の更新
);

-- プロジェクトテーブルの作成
create table if not exists projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  status project_status not null default 'not_started',
  priority project_priority not null default 'medium',
  color text default 'default',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  user_id uuid not null references auth.users(id) on delete cascade,
  is_archived boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- プロジェクトタスク中間テーブルの作成
create table if not exists project_tasks (
  project_id uuid not null references projects(id) on delete cascade,
  task_id uuid not null references tasks(id) on delete cascade,
  position integer not null,
  created_at timestamp with time zone default now(),
  primary key (project_id, task_id)
);

-- プロジェクトアクティビティテーブルの作成
create table if not exists project_activities (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  type activity_type not null,
  action text not null,
  user_id uuid not null references auth.users(id) on delete cascade,
  details jsonb,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックスの作成
create index project_activities_project_id_idx on project_activities(project_id);
create index project_activities_created_at_idx on project_activities(created_at);

-- プロジェクトテーブルのRLS設定
alter table projects enable row level security;

create policy "プロジェクトは作成者のみが参照可能" on projects
  for select using (auth.uid() = user_id);

create policy "プロジェクトは認証済みユーザーが作成可能" on projects
  for insert with check (auth.uid() = user_id);

create policy "プロジェクトは作成者のみが更新可能" on projects
  for update using (auth.uid() = user_id);

create policy "プロジェクトは作成者のみが削除可能" on projects
  for delete using (auth.uid() = user_id);

-- プロジェクトタスク中間テーブルのRLS設定
alter table project_tasks enable row level security;

create policy "select_project_tasks" on project_tasks
  for select using (
    exists (
      select 1 from projects
      where projects.id = project_tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "insert_project_tasks" on project_tasks
  for insert with check (
    exists (
      select 1 from projects
      where projects.id = project_tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "update_project_tasks" on project_tasks
  for update using (
    exists (
      select 1 from projects
      where projects.id = project_tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

create policy "delete_project_tasks" on project_tasks
  for delete using (
    exists (
      select 1 from projects
      where projects.id = project_tasks.project_id
      and projects.user_id = auth.uid()
    )
  );

-- プロジェクトアクティビティテーブルのRLS設定
alter table project_activities enable row level security;

create policy "select_activities" on project_activities
  for select using (
    auth.uid() in (
      select user_id from projects where id = project_activities.project_id
    )
  );

create policy "insert_activities" on project_activities
  for insert with check (
    auth.uid() in (
      select user_id from projects where id = project_id
    )
  );

-- 更新日時を自動更新するトリガー
create trigger handle_updated_at before update on projects
  for each row execute procedure moddatetime (updated_at);

create trigger handle_activities_updated_at before update on project_activities
  for each row execute procedure moddatetime (updated_at); 