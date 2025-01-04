-- ユーザーアカウント状態テーブル
create table if not exists ff_users.account_statuses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  status text not null check (status in ('active', 'inactive', 'pending', 'suspended')) default 'pending',
  reason text,
  changed_by uuid references auth.users(id),
  changed_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id, status)
);

-- オンラインプレゼンス状態テーブル
create table if not exists ff_users.presence_statuses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  status text not null check (status in ('online', 'offline', 'idle', 'away')) default 'offline',
  last_activity_at timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- フォーカス状態テーブル
create table if not exists ff_users.focus_statuses (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  status text not null check (status in ('focusing', 'breaking', 'meeting', 'available')) default 'available',
  session_id uuid,
  session_start_time timestamp with time zone,
  foreign key (session_id, session_start_time) references ff_focus.focus_sessions(id, start_time),
  started_at timestamp with time zone default now(),
  expected_end_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(user_id)
);

-- ステータス変更履歴テーブル
create table if not exists ff_users.status_history (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  status_type text not null check (status_type in ('account', 'presence', 'focus')),
  old_status text,
  new_status text,
  changed_by uuid references auth.users(id),
  changed_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.account_statuses is 'ユーザーアカウントの状態を管理するテーブル';
comment on table ff_users.presence_statuses is 'ユーザーのオンラインプレゼンス状態を管理するテーブル';
comment on table ff_users.focus_statuses is 'ユーザーのフォーカス状態を管理するテーブル';
comment on table ff_users.status_history is 'ユーザーステータスの変更履歴を管理するテーブル';

-- 更新日時を自動更新するトリガー関数
create or replace function ff_users.update_status_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- プレゼンス状態の更新日時トリガー
create trigger update_presence_status_updated_at
  before update on ff_users.presence_statuses
  for each row
  execute function ff_users.update_status_updated_at();

-- フォーカス状態の更新日時トリガー
create trigger update_focus_status_updated_at
  before update on ff_users.focus_statuses
  for each row
  execute function ff_users.update_status_updated_at();

-- アカウント状態の更新日時トリガー
create trigger update_account_status_updated_at
  before update on ff_users.account_statuses
  for each row
  execute function ff_users.update_status_updated_at();

-- ステータス変更履歴を記録するトリガー関数
create or replace function ff_users.log_status_change()
returns trigger as $$
begin
  if (tg_op = 'UPDATE' and old.status != new.status) then
    insert into ff_users.status_history (
      user_id,
      status_type,
      old_status,
      new_status,
      changed_by
    ) values (
      new.user_id,
      tg_argv[0],
      old.status,
      new.status,
      auth.uid()
    );
  end if;
  return new;
end;
$$ language plpgsql security definer;

-- アカウント状態の変更履歴トリガー
create trigger log_account_status_change
  after update on ff_users.account_statuses
  for each row
  execute function ff_users.log_status_change('account');

-- プレゼンス状態の変更履歴トリガー
create trigger log_presence_status_change
  after update on ff_users.presence_statuses
  for each row
  execute function ff_users.log_status_change('presence');

-- フォーカス状態の変更履歴トリガー
create trigger log_focus_status_change
  after update on ff_users.focus_statuses
  for each row
  execute function ff_users.log_status_change('focus');

-- インデックス
create index if not exists idx_account_statuses_user_id on ff_users.account_statuses(user_id);
create index if not exists idx_account_statuses_status on ff_users.account_statuses(status);
create index if not exists idx_presence_statuses_user_id on ff_users.presence_statuses(user_id);
create index if not exists idx_presence_statuses_status on ff_users.presence_statuses(status);
create index if not exists idx_focus_statuses_user_id on ff_users.focus_statuses(user_id);
create index if not exists idx_focus_statuses_status on ff_users.focus_statuses(status);
create index if not exists idx_status_history_user_id on ff_users.status_history(user_id);
create index if not exists idx_status_history_status_type on ff_users.status_history(status_type);
create index if not exists idx_status_history_changed_at on ff_users.status_history(changed_at); 