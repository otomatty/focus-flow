create table if not exists ff_gamification.user_prestige (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  prestige_level integer not null default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint user_prestige_user_id_key unique (user_id)
);

comment on table ff_gamification.user_prestige is 'ユーザーのプレステージ情報を管理するテーブル';
comment on column ff_gamification.user_prestige.id is 'プレステージ情報の一意識別子';
comment on column ff_gamification.user_prestige.user_id is 'ユーザーID';
comment on column ff_gamification.user_prestige.prestige_level is 'プレステージレベル';
comment on column ff_gamification.user_prestige.created_at is 'レコード作成日時';
comment on column ff_gamification.user_prestige.updated_at is 'レコード更新日時';

-- RLSポリシーの設定
alter table ff_gamification.user_prestige enable row level security;

create policy "ユーザーは自分のプレステージ情報を参照できる"
  on ff_gamification.user_prestige for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分のプレステージ情報を更新できる"
  on ff_gamification.user_prestige for update
  using (auth.uid() = user_id);

-- インデックスの作成
create index user_prestige_user_id_idx on ff_gamification.user_prestige(user_id);
create index user_prestige_level_idx on ff_gamification.user_prestige(prestige_level);

-- トリガーの設定
create trigger update_user_prestige_updated_at
  before update on ff_gamification.user_prestige
  for each row
  execute function update_updated_at_column();

-- プレステージアップ時にバッジを付与する関数
create or replace function ff_gamification.grant_prestige_badges()
returns trigger as $$
declare
  badge record;
begin
  -- 現在のプレステージレベルに対応するバッジのみを付与
  for badge in
    select b.id as badge_id
    from ff_gamification.badges b
    where b.condition_type = 'prestige_reached'
    and (b.condition_value->>'prestige')::integer = NEW.prestige_level
  loop
    -- バッジをユーザーに付与（重複は無視）
    insert into ff_gamification.user_badges (user_id, badge_id)
    values (NEW.user_id, badge.badge_id)
    on conflict (user_id, badge_id) do nothing;
  end loop;

  -- プレステージマスターバッジの付与（プレステージ10達成時）
  if NEW.prestige_level = 10 then
    insert into ff_gamification.user_badges (user_id, badge_id)
    select NEW.user_id, b.id
    from ff_gamification.badges b
    where b.name = 'prestige_master'
    on conflict (user_id, badge_id) do nothing;
  end if;

  return NEW;
end;
$$ language plpgsql security definer;

-- プレステージアップ時のトリガーを設定
create trigger grant_prestige_badges_trigger
  after insert or update of prestige_level
  on ff_gamification.user_prestige
  for each row
  execute function ff_gamification.grant_prestige_badges(); 