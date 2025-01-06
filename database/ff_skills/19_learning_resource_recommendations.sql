create table if not exists ff_skills.learning_resource_recommendations (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  resource_id uuid references ff_skills.learning_resources(id) not null,
  recommendation_type text not null check (recommendation_type in (
    'skill_based',
    'learning_path',
    'similar_users',
    'next_step',
    'trending',
    'personalized'
  )),
  recommendation_score numeric not null check (recommendation_score between 0 and 1),
  recommendation_data jsonb not null default '{
    "reason": [],
    "relevance_factors": {},
    "skill_alignment": null,
    "difficulty_match": null,
    "time_commitment_match": null
  }'::jsonb check (jsonb_typeof(recommendation_data) = 'object'),
  is_dismissed boolean not null default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, resource_id, recommendation_type)
);

create index if not exists learning_resource_recommendations_user_id_idx on ff_skills.learning_resource_recommendations(user_id);
create index if not exists learning_resource_recommendations_resource_id_idx on ff_skills.learning_resource_recommendations(resource_id);
create index if not exists learning_resource_recommendations_type_idx on ff_skills.learning_resource_recommendations(recommendation_type);
create index if not exists learning_resource_recommendations_score_idx on ff_skills.learning_resource_recommendations(recommendation_score);
create index if not exists learning_resource_recommendations_dismissed_idx on ff_skills.learning_resource_recommendations(is_dismissed);

comment on table ff_skills.learning_resource_recommendations is '学習リソースの推奨情報を管理するテーブル';
comment on column ff_skills.learning_resource_recommendations.id is '推奨情報の一意識別子';
comment on column ff_skills.learning_resource_recommendations.user_id is '推奨対象のユーザーID';
comment on column ff_skills.learning_resource_recommendations.resource_id is '推奨する学習リソースID';
comment on column ff_skills.learning_resource_recommendations.recommendation_type is '推奨タイプ';
comment on column ff_skills.learning_resource_recommendations.recommendation_score is '推奨スコア（0-1）';
comment on column ff_skills.learning_resource_recommendations.recommendation_data is '推奨の詳細データ（JSON形式）';
comment on column ff_skills.learning_resource_recommendations.is_dismissed is 'ユーザーが推奨を非表示にしたかどうか'; 