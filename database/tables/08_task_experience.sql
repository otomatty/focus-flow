-- タスク経験値テーブル
create table if not exists task_experience (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid references tasks(id) not null,
    experience_points integer default 0,
    skill_distribution jsonb default '{}'::jsonb,
    ai_analysis jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- インデックスの作成
create index task_experience_task_id_idx on task_experience(task_id);

-- 更新日時を自動更新するトリガー
create or replace function update_task_experience_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger task_experience_updated_at
    before update on task_experience
    for each row
    execute function update_task_experience_updated_at();

-- ユーザースキルテーブル
create table if not exists user_skills (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    category_id uuid references skill_categories(id) not null,
    rank_id uuid references skill_ranks(id) not null,
    total_exp integer default 0,
    achievements jsonb default '{}'::jsonb,
    stats jsonb default '{
        "completed_tasks": 0,
        "perfect_tasks": 0,
        "consecutive_days": 0,
        "max_consecutive_days": 0,
        "total_focus_time": 0,
        "collaboration_count": 0,
        "teaching_count": 0
    }'::jsonb,
    last_gained_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, category_id)
);

comment on table user_skills is 'ユーザーのスキルランクと経験値を管理するテーブル';
comment on column user_skills.category_id is 'スキルカテゴリID';
comment on column user_skills.rank_id is '現在のランク';
comment on column user_skills.total_exp is '累計経験値';
comment on column user_skills.achievements is '達成した実績情報';
comment on column user_skills.stats is 'スキルに関する統計情報';
comment on column user_skills.last_gained_at is '最後に経験値を獲得した日時';

-- RLSポリシーの設定
alter table user_skills enable row level security;

create policy "ユーザーは自分のスキル情報を参照できる"
  on user_skills for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分のスキル情報を更新できる"
  on user_skills for update
  using (auth.uid() = user_id);

-- インデックスの作成
create index user_skills_user_id_idx on user_skills(user_id);
create index user_skills_category_id_idx on user_skills(category_id);
create index user_skills_rank_id_idx on user_skills(rank_id);
create index user_skills_last_gained_at_idx on user_skills(last_gained_at);

-- ユーザースキル更新時のタイムスタンプを自動更新するトリガー
create or replace function update_user_skills_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger user_skills_updated_at
    before update on user_skills
    for each row
    execute function update_user_skills_updated_at(); 