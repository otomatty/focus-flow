-- タスク経験値テーブル
create table if not exists task_experience (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid references tasks(id) on delete cascade,
    difficulty_level integer check (difficulty_level between 1 and 5),
    base_exp integer not null,
    bonus_exp integer default 0,
    skill_category text not null,
    created_at timestamp with time zone default now()
);

-- ユーザースキルテーブル
create table if not exists user_skills (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    skill_category text not null,
    current_level integer default 1,
    total_exp integer default 0,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id, skill_category)
);

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