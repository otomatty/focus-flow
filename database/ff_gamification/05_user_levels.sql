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

create or replace function ff_gamification.calculate_level_info(p_total_exp integer)
returns table (
  current_level integer,
  current_exp integer,
  next_level_exp integer,
  progress numeric
) language plpgsql as $$
declare
  v_next_level_exp integer;
begin
  -- 現在のレベルを取得
  select level, required_exp
  into current_level, v_next_level_exp
  from ff_gamification.level_settings
  where required_exp <= p_total_exp
  order by level desc
  limit 1;

  -- 次のレベルの必要経験値を取得
  select required_exp
  into next_level_exp
  from ff_gamification.level_settings
  where level = current_level + 1;

  -- 現在の経験値を計算
  current_exp := p_total_exp - v_next_level_exp;
  
  -- 進捗率を計算（0-1の範囲）
  progress := current_exp::numeric / (next_level_exp - v_next_level_exp)::numeric;

  return next;
end;
$$;

-- レベルアップ時にバッジを付与する関数
create or replace function ff_gamification.grant_level_badges()
returns trigger as $$
declare
  level_rewards jsonb;
  badge record;
begin
  -- レベル設定から報酬情報を取得
  select rewards into level_rewards
  from ff_gamification.level_settings
  where level = NEW.current_level;

  -- バッジ報酬がある場合は付与
  if jsonb_array_length(level_rewards->'badges') > 0 then
    for badge in
      select b.id as badge_id
      from ff_gamification.badges b
      where b.name = (level_rewards->'badges'->0->>'badge_name')
    loop
      -- バッジをユーザーに付与（重複は無視）
      insert into ff_gamification.user_badges (user_id, badge_id)
      values (NEW.user_id, badge.badge_id)
      on conflict (user_id, badge_id) do nothing;
    end loop;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- レベルアップ時のトリガーを設定
create trigger grant_level_badges_trigger
  after insert or update of current_level
  on ff_gamification.user_levels
  for each row
  execute function ff_gamification.grant_level_badges();