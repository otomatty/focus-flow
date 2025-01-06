create table if not exists ff_gamification.level_settings (
  level integer primary key,
  required_exp integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table ff_gamification.level_settings is 'レベルごとの設定情報を管理するテーブル';
comment on column ff_gamification.level_settings.level is 'レベル';
comment on column ff_gamification.level_settings.required_exp is 'レベルアップに必要な経験値';
comment on column ff_gamification.level_settings.created_at is 'レコード作成日時';
comment on column ff_gamification.level_settings.updated_at is 'レコード更新日時';

-- RLSポリシーの設定
alter table ff_gamification.level_settings enable row level security;

create policy "全てのユーザーがレベル設定を参照できる"
  on ff_gamification.level_settings for select
  to authenticated
  using (true);

-- インデックスの作成
create index level_settings_required_exp_idx on ff_gamification.level_settings(required_exp);

-- トリガーの設定
create trigger update_level_settings_updated_at
  before update on ff_gamification.level_settings
  for each row
  execute function update_updated_at_column();

-- 初期データの挿入
with recursive level_data as (
  -- 基本となる経験値の増加率を定義（10レベルごとに1.1倍）
  select 1.1 as exp_multiplier
),
level_exp as (
  -- 初期値（レベル1）
  select 
    1 as level,
    0 as required_exp,
    50::numeric as base_exp_for_next_tier, -- 1-10レベルの基本経験値増分
    1::numeric as tier_multiplier -- 現在の階層の経験値倍率
  
  union all
  
  -- レベル2-100を生成
  select
    level + 1,
    case
      -- 10レベルごとに必要経験値の基準を更新
      when level % 10 = 0 then
        required_exp + (base_exp_for_next_tier * tier_multiplier)::integer
      else
        required_exp + (base_exp_for_next_tier * tier_multiplier * (1 + (level % 10) * 0.1))::integer
    end,
    case
      -- 10レベルごとに基本経験値を更新
      when level % 10 = 0 then base_exp_for_next_tier * 1.5
      else base_exp_for_next_tier
    end,
    case
      -- 10レベルごとに倍率を更新
      when level % 10 = 0 then tier_multiplier * exp_multiplier
      else tier_multiplier
    end
  from level_exp cross join level_data
  where level < 100
)
insert into ff_gamification.level_settings (level, required_exp)
select 
  level,
  required_exp
from level_exp
order by level
on conflict (level) do nothing; 