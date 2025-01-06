create table if not exists ff_skills.learning_resource_reviews (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  resource_id uuid references ff_skills.learning_resources(id) not null,
  rating integer not null check (rating between 1 and 5),
  review_text text,
  review_data jsonb not null default '{
    "pros": [],
    "cons": [],
    "difficulty_rating": null,
    "time_investment": null,
    "effectiveness_rating": null,
    "would_recommend": null
  }'::jsonb check (jsonb_typeof(review_data) = 'object'),
  helpful_count integer not null default 0 check (helpful_count >= 0),
  is_verified_purchase boolean not null default false,
  completion_status text check (completion_status in ('completed', 'partially_completed', 'dropped')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, resource_id)
);

create index if not exists learning_resource_reviews_user_id_idx on ff_skills.learning_resource_reviews(user_id);
create index if not exists learning_resource_reviews_resource_id_idx on ff_skills.learning_resource_reviews(resource_id);
create index if not exists learning_resource_reviews_rating_idx on ff_skills.learning_resource_reviews(rating);
create index if not exists learning_resource_reviews_helpful_count_idx on ff_skills.learning_resource_reviews(helpful_count);
create index if not exists learning_resource_reviews_completion_status_idx on ff_skills.learning_resource_reviews(completion_status);

comment on table ff_skills.learning_resource_reviews is '学習リソースのレビューとフィードバックを管理するテーブル';
comment on column ff_skills.learning_resource_reviews.id is 'レビューの一意識別子';
comment on column ff_skills.learning_resource_reviews.user_id is 'レビュー投稿者のユーザーID';
comment on column ff_skills.learning_resource_reviews.resource_id is 'レビュー対象の学習リソースID';
comment on column ff_skills.learning_resource_reviews.rating is '評価（1-5）';
comment on column ff_skills.learning_resource_reviews.review_text is 'レビュー本文';
comment on column ff_skills.learning_resource_reviews.review_data is 'レビューの詳細データ（JSON形式）';
comment on column ff_skills.learning_resource_reviews.helpful_count is '「参考になった」の数';
comment on column ff_skills.learning_resource_reviews.is_verified_purchase is '購入済みユーザーかどうか';
comment on column ff_skills.learning_resource_reviews.completion_status is '学習の完了状態'; 