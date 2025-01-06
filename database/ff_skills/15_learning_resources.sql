create table if not exists ff_skills.learning_resources (
  id uuid primary key default uuid_generate_v4(),
  skill_id uuid references ff_skills.skill_details(id) not null,
  type text not null check (type in ('course', 'book', 'video', 'workshop', 'certification', 'guide', 'community')),
  name text not null check (length(name) >= 3 and length(name) <= 200),
  provider text,
  url text check (url ~ '^https?://'),
  description text,
  duration text,
  level text not null check (level in ('beginner', 'intermediate', 'advanced', 'expert', 'all')),
  language text not null,
  cost jsonb not null check (jsonb_typeof(cost) = 'object'),
  prerequisites jsonb not null check (jsonb_typeof(prerequisites) = 'array'),
  objectives jsonb not null check (jsonb_typeof(objectives) = 'array'),
  format text not null check (format in ('online', 'offline', 'hybrid')),
  rating jsonb not null check (jsonb_typeof(rating) = 'object'),
  metadata jsonb not null check (jsonb_typeof(metadata) = 'object'),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists learning_resources_skill_id_idx on ff_skills.learning_resources(skill_id);
create index if not exists learning_resources_type_idx on ff_skills.learning_resources(type);
create index if not exists learning_resources_level_idx on ff_skills.learning_resources(level);
create index if not exists learning_resources_format_idx on ff_skills.learning_resources(format);
create index if not exists learning_resources_language_idx on ff_skills.learning_resources(language);
create index if not exists learning_resources_name_trgm_idx on ff_skills.learning_resources using gin (name gin_trgm_ops);

comment on table ff_skills.learning_resources is '学習リソース情報を管理するテーブル';
comment on column ff_skills.learning_resources.id is 'リソースの一意識別子';
comment on column ff_skills.learning_resources.skill_id is '関連するスキルのID';
comment on column ff_skills.learning_resources.type is 'リソースタイプ（course, workshop, guide等）';
comment on column ff_skills.learning_resources.name is 'リソース名';
comment on column ff_skills.learning_resources.provider is 'リソース提供者';
comment on column ff_skills.learning_resources.url is 'リソースのURL';
comment on column ff_skills.learning_resources.description is 'リソースの説明';
comment on column ff_skills.learning_resources.duration is '学習期間または所要時間';
comment on column ff_skills.learning_resources.level is '難易度レベル';
comment on column ff_skills.learning_resources.language is '提供言語';
comment on column ff_skills.learning_resources.cost is '料金情報（JSON形式）';
comment on column ff_skills.learning_resources.prerequisites is '前提条件（JSON形式）';
comment on column ff_skills.learning_resources.objectives is '学習目標（JSON形式）';
comment on column ff_skills.learning_resources.format is '提供形式（online, offline, hybrid）';
comment on column ff_skills.learning_resources.rating is '評価情報（JSON形式）';
comment on column ff_skills.learning_resources.metadata is 'その他のメタデータ（JSON形式）'; 