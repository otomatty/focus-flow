-- スキル詳細テーブル
create table if not exists skill_details (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references skill_categories(id) not null,
  name text not null,
  slug text not null unique,
  description text,
  difficulty_level text not null check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  learning_resources jsonb default '[]'::jsonb,
  prerequisites jsonb default '[]'::jsonb,
  related_skills jsonb default '[]'::jsonb,
  version_info jsonb default '{}'::jsonb,
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table skill_details is '具体的なスキルを管理するテーブル';
comment on column skill_details.category_id is '所属するサブカテゴリのID';
comment on column skill_details.difficulty_level is 'スキルの難易度';
comment on column skill_details.learning_resources is '学習リソース情報';
comment on column skill_details.prerequisites is '前提となるスキル';
comment on column skill_details.related_skills is '関連するスキル';
comment on column skill_details.version_info is 'バージョン情報（技術スキルの場合）';

-- RLSポリシーの設定
alter table skill_details enable row level security;

create policy "全てのユーザーがスキル詳細を参照できる"
  on skill_details for select
  to authenticated
  using (true);

-- インデックスの作成
create index skill_details_category_id_idx on skill_details(category_id);
create index skill_details_slug_idx on skill_details(slug);
create index skill_details_difficulty_level_idx on skill_details(difficulty_level);

-- トリガーの設定
create trigger update_skill_details_updated_at
  before update on skill_details
  for each row
  execute function update_updated_at_column();

-- サンプルデータの挿入（フロントエンド開発の例）
with frontend_category as (
  select id from skill_categories where slug = 'frontend'
)
insert into skill_details (
  category_id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
) 
select
  frontend_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from frontend_category,
(values
  (
    'React.js',
    'reactjs',
    'モダンなUIを構築するためのJavaScriptライブラリ',
    'intermediate',
    '[
      {"type": "official", "url": "https://reactjs.org/docs/getting-started.html"},
      {"type": "course", "name": "React Complete Guide"}
    ]'::jsonb,
    '["javascript-basic", "es6", "html5", "css3"]'::jsonb,
    '["redux", "react-router", "nextjs"]'::jsonb,
    '{"latest": "18.2.0", "lts": "18.2.0"}'::jsonb
  ),
  (
    'TypeScript',
    'typescript',
    'JavaScriptに静的型付けを追加した言語',
    'intermediate',
    '[
      {"type": "official", "url": "https://www.typescriptlang.org/docs/"},
      {"type": "guide", "name": "TypeScript Deep Dive"}
    ]'::jsonb,
    '["javascript-advanced"]'::jsonb,
    '["angular", "nestjs"]'::jsonb,
    '{"latest": "5.0.0", "lts": "4.9.0"}'::jsonb
  ),
  (
    'Next.js',
    'nextjs',
    'Reactベースのフルスタックフレームワーク',
    'advanced',
    '[
      {"type": "official", "url": "https://nextjs.org/docs"},
      {"type": "tutorial", "name": "Next.js Tutorial"}
    ]'::jsonb,
    '["reactjs", "typescript"]'::jsonb,
    '["remix", "gatsby"]'::jsonb,
    '{"latest": "14.0.0", "lts": "13.5.0"}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- サンプルデータの挿入（AIモデル開発の例）
with ai_category as (
  select id from skill_categories where slug = 'ai-model-development'
)
insert into skill_details (
  category_id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
) 
select
  ai_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
from ai_category,
(values
  (
    'PyTorch',
    'pytorch',
    'ディープラーニングフレームワーク',
    'advanced',
    '[
      {"type": "official", "url": "https://pytorch.org/docs/stable/index.html"},
      {"type": "course", "name": "Deep Learning with PyTorch"}
    ]'::jsonb,
    '["python-advanced", "linear-algebra", "calculus"]'::jsonb,
    '["tensorflow", "neural-networks", "cuda"]'::jsonb
  ),
  (
    'Transformers',
    'transformers',
    '自然言語処理モデルのライブラリ',
    'expert',
    '[
      {"type": "official", "url": "https://huggingface.co/docs/transformers/index"},
      {"type": "paper", "name": "Attention Is All You Need"}
    ]'::jsonb,
    '["pytorch", "nlp-basics", "python-advanced"]'::jsonb,
    '["bert", "gpt", "t5"]'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills)
on conflict (slug) do nothing; 