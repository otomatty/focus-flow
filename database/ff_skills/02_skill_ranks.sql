create table if not exists ff_skills.skill_ranks (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  required_exp integer not null check (required_exp >= 0),
  icon text,
  color text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  display_order integer not null check (display_order > 0),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_display_order unique(display_order)
);

comment on table ff_skills.skill_ranks is 'スキルのランクを管理するテーブル';
comment on column ff_skills.skill_ranks.name is 'ランクの名称';
comment on column ff_skills.skill_ranks.slug is 'ランクのスラッグ（URLフレンドリーな識別子）';
comment on column ff_skills.skill_ranks.required_exp is '必要経験値';
comment on column ff_skills.skill_ranks.display_order is '表示順序（1から始まる連番）';

-- RLSポリシーの設定
alter table ff_skills.skill_ranks enable row level security;

create policy "全てのユーザーがスキルランクを参照できる"
  on ff_skills.skill_ranks for select
  to authenticated
  using (true);

-- インデックスの作成
create index skill_ranks_display_order_idx on ff_skills.skill_ranks(display_order);
create index skill_ranks_required_exp_idx on ff_skills.skill_ranks(required_exp);
create index skill_ranks_slug_idx on ff_skills.skill_ranks(slug);

-- トリガーの設定
create trigger update_skill_ranks_updated_at
  before update on ff_skills.skill_ranks
  for each row
  execute function update_updated_at_column();

-- 初期データの挿入
insert into ff_skills.skill_ranks (name, slug, description, required_exp, icon, color, display_order) values
('Novice', 'novice', '基礎的な知識と経験を持つ段階', 0, 'Seedling', '#94A3B8', 1),
('Apprentice', 'apprentice', '基本的なスキルを習得し、実践的な経験を積み始めた段階', 1000, 'Sprout', '#22C55E', 2),
('Practitioner', 'practitioner', '実践的なスキルを持ち、自立して作業を遂行できる段階', 3000, 'Tree', '#0EA5E9', 3),
('Expert', 'expert', '高度な知識と経験を持ち、他者に指導できる段階', 6000, 'Star', '#EAB308', 4),
('Master', 'master', '卓越した技能を持ち、革新的な成果を生み出せる段階', 10000, 'Crown', '#EC4899', 5)
on conflict (slug) do nothing;

-- ランク昇進の要件を管理するテーブル
create table if not exists ff_skills.rank_promotion_requirements (
  id uuid primary key default uuid_generate_v4(),
  from_rank_id uuid references ff_skills.skill_ranks(id) not null,
  to_rank_id uuid references ff_skills.skill_ranks(id) not null,
  category_id uuid references ff_skills.skill_categories(id) not null,
  requirements jsonb not null check (jsonb_typeof(requirements) = 'object'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint unique_promotion_path unique(from_rank_id, to_rank_id, category_id),
  constraint prevent_self_promotion check (from_rank_id != to_rank_id)
);

comment on table ff_skills.rank_promotion_requirements is 'ランク昇進の要件を管理するテーブル';
comment on column ff_skills.rank_promotion_requirements.from_rank_id is '昇進元のランクID';
comment on column ff_skills.rank_promotion_requirements.to_rank_id is '昇進先のランクID';
comment on column ff_skills.rank_promotion_requirements.category_id is '対象のスキルカテゴリID';
comment on column ff_skills.rank_promotion_requirements.requirements is '昇進に必要な要件（JSONBフォーマット）';

-- RLSポリシーの設定
alter table ff_skills.rank_promotion_requirements enable row level security;

create policy "全てのユーザーがランク昇進要件を参照できる"
  on ff_skills.rank_promotion_requirements for select
  to authenticated
  using (true);

-- インデックスの作成
create index rank_promotion_requirements_from_rank_idx on ff_skills.rank_promotion_requirements(from_rank_id);
create index rank_promotion_requirements_to_rank_idx on ff_skills.rank_promotion_requirements(to_rank_id);
create index rank_promotion_requirements_category_idx on ff_skills.rank_promotion_requirements(category_id);
create index rank_promotion_requirements_requirements_idx on ff_skills.rank_promotion_requirements using gin(requirements);

-- トリガーの設定
create trigger update_rank_promotion_requirements_updated_at
  before update on ff_skills.rank_promotion_requirements
  for each row
  execute function update_updated_at_column(); 