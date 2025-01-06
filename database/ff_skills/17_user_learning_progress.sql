create table if not exists ff_skills.user_learning_progress (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  resource_id uuid references ff_skills.learning_resources(id) not null,
  status text not null check (status in ('not_started', 'in_progress', 'completed', 'on_hold')),
  progress_data jsonb not null default '{
    "completion_percentage": 0,
    "last_accessed": null,
    "time_spent_minutes": 0,
    "completed_sections": [],
    "notes": [],
    "bookmarks": []
  }'::jsonb check (jsonb_typeof(progress_data) = 'object'),
  started_at timestamp with time zone,
  completed_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, resource_id)
);

create index if not exists user_learning_progress_user_id_idx on ff_skills.user_learning_progress(user_id);
create index if not exists user_learning_progress_resource_id_idx on ff_skills.user_learning_progress(resource_id);
create index if not exists user_learning_progress_status_idx on ff_skills.user_learning_progress(status);
create index if not exists user_learning_progress_started_at_idx on ff_skills.user_learning_progress(started_at);
create index if not exists user_learning_progress_completed_at_idx on ff_skills.user_learning_progress(completed_at);

comment on table ff_skills.user_learning_progress is 'ユーザーの学習リソースごとの進捗状況を管理するテーブル';
comment on column ff_skills.user_learning_progress.id is '進捗記録の一意識別子';
comment on column ff_skills.user_learning_progress.user_id is 'ユーザーID';
comment on column ff_skills.user_learning_progress.resource_id is '学習リソースID';
comment on column ff_skills.user_learning_progress.status is '学習状況（未開始、進行中、完了、一時停止）';
comment on column ff_skills.user_learning_progress.progress_data is '進捗の詳細データ（JSON形式）';
comment on column ff_skills.user_learning_progress.started_at is '学習開始日時';
comment on column ff_skills.user_learning_progress.completed_at is '学習完了日時'; 