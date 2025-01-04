create table if not exists ff_gamification.user_levels (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  current_level integer not null default 1,
  current_exp integer not null default 0,
  total_exp integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_levels_user_id_key unique (user_id)
);

comment on table ff_gamification.user_levels is 'ユーザーのレベル情報を管理するテーブル';
comment on column ff_gamification.user_levels.id is 'レベル情報の一意識別子';
comment on column ff_gamification.user_levels.user_id is 'ユーザーID';
comment on column ff_gamification.user_levels.current_level is '現在のレベル';
comment on column ff_gamification.user_levels.current_exp is '現在のレベルでの経験値';
comment on column ff_gamification.user_levels.total_exp is '累計経験値';
comment on column ff_gamification.user_levels.created_at is 'レコード作成日時';
comment on column ff_gamification.user_levels.updated_at is 'レコード更新日時';

-- RLSポリシーの設定
alter table ff_gamification.user_levels enable row level security;

create policy "ユーザーは自分のレベル情報を参照できる"
  on ff_gamification.user_levels for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分のレベル情報を更新できる"
  on ff_gamification.user_levels for update
  using (auth.uid() = user_id);

-- インデックスの作成
create index user_levels_user_id_idx on ff_gamification.user_levels(user_id);
create index user_levels_current_level_idx on ff_gamification.user_levels(current_level);

-- トリガーの設定
create trigger update_user_levels_updated_at
  before update on ff_gamification.user_levels
  for each row
  execute function update_updated_at_column(); 