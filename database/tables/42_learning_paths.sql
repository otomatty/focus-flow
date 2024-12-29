create table if not exists learning_paths (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  creator_id uuid references auth.users(id) not null,
  is_official boolean not null default false,
  target_level text not null check (target_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  estimated_duration text,
  path_data jsonb not null default '{
    "prerequisites": [],
    "learning_objectives": [],
    "skills_covered": [],
    "career_paths": [],
    "certification_preparation": null
  }'::jsonb,
  is_public boolean not null default true,
  likes_count integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists learning_path_resources (
  id uuid primary key default uuid_generate_v4(),
  path_id uuid references learning_paths(id) not null,
  resource_id uuid references learning_resources(id) not null,
  order_index integer not null,
  is_required boolean not null default true,
  resource_data jsonb not null default '{
    "notes": null,
    "estimated_duration": null,
    "dependencies": []
  }'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(path_id, resource_id)
);

create table if not exists user_learning_paths (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  path_id uuid references learning_paths(id) not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed', 'on_hold')),
  progress_data jsonb not null default '{
    "completion_percentage": 0,
    "completed_resources": [],
    "current_resource": null,
    "notes": [],
    "time_spent_minutes": 0
  }'::jsonb,
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, path_id)
);

create index if not exists learning_paths_creator_id_idx on learning_paths(creator_id);
create index if not exists learning_paths_target_level_idx on learning_paths(target_level);
create index if not exists learning_paths_is_public_idx on learning_paths(is_public);

create index if not exists learning_path_resources_path_id_idx on learning_path_resources(path_id);
create index if not exists learning_path_resources_resource_id_idx on learning_path_resources(resource_id);
create index if not exists learning_path_resources_order_idx on learning_path_resources(order_index);

create index if not exists user_learning_paths_user_id_idx on user_learning_paths(user_id);
create index if not exists user_learning_paths_path_id_idx on user_learning_paths(path_id);
create index if not exists user_learning_paths_status_idx on user_learning_paths(status);

comment on table learning_paths is '学習パス（カリキュラム）を管理するテーブル';
comment on column learning_paths.id is '学習パスの一意識別子';
comment on column learning_paths.name is '学習パス名';
comment on column learning_paths.description is '学習パスの説明';
comment on column learning_paths.creator_id is '作成者のユーザーID';
comment on column learning_paths.is_official is '公式の学習パスかどうか';
comment on column learning_paths.target_level is '対象レベル';
comment on column learning_paths.estimated_duration is '想定学習期間';
comment on column learning_paths.path_data is '学習パスの詳細データ（JSON形式）';
comment on column learning_paths.is_public is '公開設定';
comment on column learning_paths.likes_count is 'いいね数';

comment on table learning_path_resources is '学習パスに含まれるリソースを管理するテーブル';
comment on column learning_path_resources.id is '学習パスリソースの一意識別子';
comment on column learning_path_resources.path_id is '学習パスID';
comment on column learning_path_resources.resource_id is '学習リソースID';
comment on column learning_path_resources.order_index is '順序';
comment on column learning_path_resources.is_required is '必須かどうか';
comment on column learning_path_resources.resource_data is 'リソースの詳細データ（JSON形式）';

comment on table user_learning_paths is 'ユーザーの学習パス進捗を管理するテーブル';
comment on column user_learning_paths.id is 'ユーザー学習パスの一意識別子';
comment on column user_learning_paths.user_id is 'ユーザーID';
comment on column user_learning_paths.path_id is '学習パスID';
comment on column user_learning_paths.status is '進捗状況';
comment on column user_learning_paths.progress_data is '進捗の詳細データ（JSON形式）';
comment on column user_learning_paths.started_at is '開始日時';
comment on column user_learning_paths.completed_at is '完了日時'; 