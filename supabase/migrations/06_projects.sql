create type project_status as enum ('not_started', 'in_progress', 'completed', 'on_hold');
create type project_priority as enum ('high', 'medium', 'low');

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
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- RLSの設定
alter table projects enable row level security;

create policy "ユーザーは自分のプロジェクトのみ参照可能"
  on projects for select
  to authenticated
  using (auth.uid() = user_id);

create policy "ユーザーは自分のプロジェクトのみ作成可能"
  on projects for insert
  to authenticated
  with check (auth.uid() = user_id);

create policy "ユーザーは自分のプロジェクトのみ更新可能"
  on projects for update
  to authenticated
  using (auth.uid() = user_id);

create policy "ユーザーは自分のプロジェクトのみ削除可能"
  on projects for delete
  to authenticated
  using (auth.uid() = user_id);

-- 更新日時を自動更新するトリガー
create trigger handle_updated_at before update on projects
  for each row execute procedure moddatetime (updated_at); 