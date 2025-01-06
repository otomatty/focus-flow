-- スキル詳細テーブル
create table if not exists ff_skills.skill_details (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references ff_skills.skill_categories(id) not null,
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  difficulty_level text not null check (difficulty_level in ('beginner', 'intermediate', 'advanced', 'expert')),
  learning_resources jsonb default '[]'::jsonb check (jsonb_typeof(learning_resources) = 'array'),
  prerequisites jsonb default '[]'::jsonb check (jsonb_typeof(prerequisites) = 'array'),
  related_skills jsonb default '[]'::jsonb check (jsonb_typeof(related_skills) = 'array'),
  version_info jsonb default '{}'::jsonb check (jsonb_typeof(version_info) = 'object'),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint valid_learning_resources check (
    jsonb_array_length(learning_resources) <= 10 and
    (learning_resources @> '[]'::jsonb or learning_resources <@ '[{"type": "official"}, {"type": "course"}, {"type": "book"}, {"type": "tutorial"}, {"type": "guide"}, {"type": "certification"}, {"type": "workshop"}, {"type": "paper"}]'::jsonb)
  ),
  constraint valid_prerequisites check (jsonb_array_length(prerequisites) <= 5),
  constraint valid_related_skills check (jsonb_array_length(related_skills) <= 5)
);

comment on table ff_skills.skill_details is '具体的なスキルを管理するテーブル';
comment on column ff_skills.skill_details.category_id is '所属するサブカテゴリのID';
comment on column ff_skills.skill_details.name is 'スキルの名称';
comment on column ff_skills.skill_details.slug is 'スキルのスラッグ（URLフレンドリーな識別子）';
comment on column ff_skills.skill_details.description is 'スキルの説明';
comment on column ff_skills.skill_details.difficulty_level is 'スキルの難易度（beginner, intermediate, advanced, expert）';
comment on column ff_skills.skill_details.learning_resources is '学習リソース情報（配列形式、最大10件）';
comment on column ff_skills.skill_details.prerequisites is '前提となるスキル（配列形式、最大5件）';
comment on column ff_skills.skill_details.related_skills is '関連するスキル（配列形式、最大5件）';
comment on column ff_skills.skill_details.version_info is 'バージョン情報（技術スキルの場合）';
comment on column ff_skills.skill_details.is_active is 'アクティブ状態（非アクティブの場合は表示されない）';

-- RLSポリシーの設定
alter table ff_skills.skill_details enable row level security;

create policy "全てのユーザーがスキル詳細を参照できる"
  on ff_skills.skill_details for select
  to authenticated
  using (true);

-- インデックスの作成
create index skill_details_category_id_idx on ff_skills.skill_details(category_id);
create index skill_details_slug_idx on ff_skills.skill_details(slug);
create index skill_details_difficulty_level_idx on ff_skills.skill_details(difficulty_level);
create index skill_details_is_active_idx on ff_skills.skill_details(is_active);
create index skill_details_name_trgm_idx on ff_skills.skill_details using gin (name gin_trgm_ops);
create index skill_details_description_trgm_idx on ff_skills.skill_details using gin (description gin_trgm_ops);
create index skill_details_learning_resources_idx on ff_skills.skill_details using gin (learning_resources);
create index skill_details_prerequisites_idx on ff_skills.skill_details using gin (prerequisites);
create index skill_details_related_skills_idx on ff_skills.skill_details using gin (related_skills);

-- 複合インデックス
create index skill_details_active_category_idx on ff_skills.skill_details(is_active, category_id);
create index skill_details_active_difficulty_idx on ff_skills.skill_details(is_active, difficulty_level);

-- トリガーの設定
create trigger update_skill_details_updated_at
  before update on ff_skills.skill_details
  for each row
  execute function ff_skills.update_updated_at_column();

-- サンプルデータの挿入（フロントエンド開発の例）
with frontend_category as (
  select id from ff_skills.skill_categories where slug = 'frontend'
)
insert into ff_skills.skill_details (
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
  select id from ff_skills.skill_categories where slug = 'ai-model-development'
)
insert into ff_skills.skill_details (
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