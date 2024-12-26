-- moddatetime拡張機能のインストール
create extension if not exists moddatetime schema extensions;

-- アクティビティの種類を定義
create type activity_type as enum (
  'project_update',  -- プロジェクトの更新
  'task_create',     -- タスクの作成
  'task_update',     -- タスクの更新
  'task_delete',     -- タスクの削除
  'member_update'    -- メンバー関連の更新
);

-- アクティビティテーブルの作成
create table if not exists project_activities (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid not null references projects(id) on delete cascade,
  type activity_type not null,
  action text not null,           -- 具体的な操作の説明（例: "ステータスを「進行中」に変更"）
  user_id uuid not null references auth.users(id) on delete cascade,
  details jsonb,                  -- 変更前後の値などの詳細情報
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- インデックスの作成
create index project_activities_project_id_idx on project_activities(project_id);
create index project_activities_created_at_idx on project_activities(created_at);

-- RLSの設定
alter table project_activities enable row level security;

create policy "select_activities"
  on project_activities for select
  using (
    auth.uid() in (
      select user_id from projects where id = project_activities.project_id
    )
  );

create policy "insert_activities"
  on project_activities for insert
  with check (
    auth.uid() in (
      select user_id from projects where id = project_id
    )
  );

-- 更新日時を自動更新するトリガー
create trigger handle_updated_at before update on project_activities
  for each row execute procedure moddatetime (updated_at); 