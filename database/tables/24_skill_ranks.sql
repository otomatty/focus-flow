create table if not exists skill_ranks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  required_exp integer not null,
  icon text,
  color text,
  display_order integer not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table skill_ranks is 'スキルのランクを管理するテーブル';

-- RLSポリシーの設定
alter table skill_ranks enable row level security;

create policy "全てのユーザーがスキルランクを参照できる"
  on skill_ranks for select
  to authenticated
  using (true);

-- インデックスの作成
create index skill_ranks_display_order_idx on skill_ranks(display_order);

-- トリガーの設定
create trigger update_skill_ranks_updated_at
  before update on skill_ranks
  for each row
  execute function update_updated_at_column();

-- 初期データの挿入
insert into skill_ranks (name, slug, description, required_exp, icon, color, display_order) values
('Novice', 'novice', '基礎的な知識と経験を持つ段階', 0, 'Seedling', '#94A3B8', 1),
('Apprentice', 'apprentice', '基本的なスキルを習得し、実践的な経験を積み始めた段階', 1000, 'Sprout', '#22C55E', 2),
('Practitioner', 'practitioner', '実践的なスキルを持ち、自立して作業を遂行できる段階', 3000, 'Tree', '#0EA5E9', 3),
('Expert', 'expert', '高度な知識と経験を持ち、他者に指導できる段階', 6000, 'Star', '#EAB308', 4),
('Master', 'master', '卓越した技能を持ち、革新的な成果を生み出せる段階', 10000, 'Crown', '#EC4899', 5)
on conflict (slug) do nothing;

-- ランク昇進の要件を管理するテーブル
create table if not exists rank_promotion_requirements (
  id uuid primary key default uuid_generate_v4(),
  from_rank_id uuid references skill_ranks(id) not null,
  to_rank_id uuid references skill_ranks(id) not null,
  category_id uuid references skill_categories(id) not null,
  requirements jsonb not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(from_rank_id, to_rank_id, category_id)
);

comment on table rank_promotion_requirements is 'ランク昇進の要件を管理するテーブル';

-- RLSポリシーの設定
alter table rank_promotion_requirements enable row level security;

create policy "全てのユーザーがランク昇進要件を参照できる"
  on rank_promotion_requirements for select
  to authenticated
  using (true);

-- インデックスの作成
create index rank_promotion_requirements_from_rank_idx on rank_promotion_requirements(from_rank_id);
create index rank_promotion_requirements_to_rank_idx on rank_promotion_requirements(to_rank_id);
create index rank_promotion_requirements_category_idx on rank_promotion_requirements(category_id);

-- トリガーの設定
create trigger update_rank_promotion_requirements_updated_at
  before update on rank_promotion_requirements
  for each row
  execute function update_updated_at_column(); 