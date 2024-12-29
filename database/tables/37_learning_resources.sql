create table if not exists learning_resources (
  id uuid primary key default uuid_generate_v4(),
  skill_id uuid references skill_details(id) not null,
  type text not null,
  name text not null,
  provider text,
  url text,
  description text,
  duration text,
  level text,
  language text,
  cost jsonb,
  prerequisites jsonb,
  objectives jsonb,
  format text,
  rating jsonb,
  metadata jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create index if not exists learning_resources_skill_id_idx on learning_resources(skill_id);
create index if not exists learning_resources_type_idx on learning_resources(type);
create index if not exists learning_resources_level_idx on learning_resources(level);
create index if not exists learning_resources_format_idx on learning_resources(format);

comment on table learning_resources is '学習リソース情報を管理するテーブル';
comment on column learning_resources.id is 'リソースの一意識別子';
comment on column learning_resources.skill_id is '関連するスキルのID';
comment on column learning_resources.type is 'リソースタイプ（course, workshop, guide等）';
comment on column learning_resources.name is 'リソース名';
comment on column learning_resources.provider is 'リソース提供者';
comment on column learning_resources.url is 'リソースのURL';
comment on column learning_resources.description is 'リソースの説明';
comment on column learning_resources.duration is '学習期間または所要時間';
comment on column learning_resources.level is '難易度レベル';
comment on column learning_resources.language is '提供言語';
comment on column learning_resources.cost is '料金情報（JSON形式）';
comment on column learning_resources.prerequisites is '前提条件（JSON形式）';
comment on column learning_resources.objectives is '学習目標（JSON形式）';
comment on column learning_resources.format is '提供形式（online, offline, hybrid）';
comment on column learning_resources.rating is '評価情報（JSON形式）';
comment on column learning_resources.metadata is 'その他のメタデータ（JSON形式）'; 