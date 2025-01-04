-- ソーシャル機能用のスキーマ作成
create schema if not exists ff_social;

-- フォロー関係のステータス
create type ff_social.follow_status as enum ('pending', 'accepted', 'blocked');

-- フォロー関係テーブル
create table ff_social.follows (
  id uuid primary key default gen_random_uuid(),
  follower_id uuid references auth.users not null,
  following_id uuid references auth.users not null,
  status ff_social.follow_status not null default 'accepted',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(follower_id, following_id)
);

-- フォロー関係の統計
create table ff_social.follow_stats (
  user_id uuid references auth.users primary key,
  followers_count integer not null default 0,
  following_count integer not null default 0,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- ブロックリスト
create table ff_social.blocks (
  id uuid primary key default gen_random_uuid(),
  blocker_id uuid references auth.users not null,
  blocked_id uuid references auth.users not null,
  reason text,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  unique(blocker_id, blocked_id)
);

-- インデックス
create index idx_follows_follower_id on ff_social.follows(follower_id);
create index idx_follows_following_id on ff_social.follows(following_id);
create index idx_follows_status on ff_social.follows(status);
create index idx_blocks_blocker_id on ff_social.blocks(blocker_id);
create index idx_blocks_blocked_id on ff_social.blocks(blocked_id);

-- RLSポリシー
alter table ff_social.follows enable row level security;
alter table ff_social.follow_stats enable row level security;
alter table ff_social.blocks enable row level security;

-- フォロー関係のポリシー
create policy "Users can view follows"
  on ff_social.follows for select
  using (
    auth.uid() = follower_id
    or auth.uid() = following_id
    or status = 'accepted'
  );

create policy "Users can follow others"
  on ff_social.follows for insert
  with check (
    auth.uid() = follower_id
    and not exists (
      select 1 from ff_social.blocks
      where (blocker_id = following_id and blocked_id = auth.uid())
      or (blocker_id = auth.uid() and blocked_id = following_id)
    )
  );

create policy "Users can manage their own follows"
  on ff_social.follows for update
  using (auth.uid() = follower_id or auth.uid() = following_id);

create policy "Users can unfollow"
  on ff_social.follows for delete
  using (auth.uid() = follower_id);

-- フォロー統計のポリシー
create policy "Everyone can view follow stats"
  on ff_social.follow_stats for select
  using (true);

-- ブロックのポリシー
create policy "Users can view their blocks"
  on ff_social.blocks for select
  using (auth.uid() = blocker_id);

create policy "Users can block others"
  on ff_social.blocks for insert
  with check (auth.uid() = blocker_id);

create policy "Users can manage their blocks"
  on ff_social.blocks for update
  using (auth.uid() = blocker_id);

create policy "Users can unblock"
  on ff_social.blocks for delete
  using (auth.uid() = blocker_id);

-- フォロー数更新用の関数とトリガー
create or replace function ff_social.update_follow_stats()
returns trigger as $$
begin
  -- フォロワー数の更新
  if (tg_op = 'INSERT' and new.status = 'accepted') then
    insert into ff_social.follow_stats (user_id, followers_count, following_count)
    values (new.following_id, 1, 0)
    on conflict (user_id) do update
    set followers_count = ff_social.follow_stats.followers_count + 1,
        updated_at = now();

    insert into ff_social.follow_stats (user_id, followers_count, following_count)
    values (new.follower_id, 0, 1)
    on conflict (user_id) do update
    set following_count = ff_social.follow_stats.following_count + 1,
        updated_at = now();
  elsif (tg_op = 'DELETE' or (tg_op = 'UPDATE' and old.status = 'accepted' and new.status != 'accepted')) then
    update ff_social.follow_stats
    set followers_count = greatest(0, followers_count - 1),
        updated_at = now()
    where user_id = old.following_id;

    update ff_social.follow_stats
    set following_count = greatest(0, following_count - 1),
        updated_at = now()
    where user_id = old.follower_id;
  end if;
  
  return null;
end;
$$ language plpgsql;

create trigger update_follow_stats
  after insert or update or delete on ff_social.follows
  for each row
  execute function ff_social.update_follow_stats();

-- updated_at更新用のトリガー
create trigger update_follows_updated_at
  before update on ff_social.follows
  for each row
  execute function ff_schedules.update_updated_at();

create trigger update_blocks_updated_at
  before update on ff_social.blocks
  for each row
  execute function ff_schedules.update_updated_at();

create trigger update_follow_stats_updated_at
  before update on ff_social.follow_stats
  for each row
  execute function ff_schedules.update_updated_at(); 