-- タスク経験値テーブル
create table if not exists ff_tasks.task_experience (
    id uuid primary key default uuid_generate_v4(),
    task_id uuid references ff_tasks.tasks(id) on delete cascade,
    experience_points integer not null default 0,
    skill_distribution jsonb not null default '{}'::jsonb,
    ai_analysis jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- 経験値は0以上
    constraint positive_experience_points check (experience_points >= 0),
    -- JSONBフィールドの構造を検証
    constraint valid_skill_distribution check (jsonb_typeof(skill_distribution) = 'object'),
    constraint valid_ai_analysis check (ai_analysis is null or jsonb_typeof(ai_analysis) = 'object')
);

comment on table ff_tasks.task_experience is 'タスクの経験値情報を管理するテーブル';
comment on column ff_tasks.task_experience.task_id is '対象タスクのID';
comment on column ff_tasks.task_experience.experience_points is 'タスク完了時に獲得できる経験値';
comment on column ff_tasks.task_experience.skill_distribution is 'スキルカテゴリごとの経験値配分';
comment on column ff_tasks.task_experience.ai_analysis is 'AI分析による経験値算出の詳細データ';

-- インデックス
create index task_experience_task_id_idx on ff_tasks.task_experience(task_id);
create index task_experience_experience_points_idx on ff_tasks.task_experience(experience_points);

-- RLSポリシー
alter table ff_tasks.task_experience enable row level security;

-- タスク経験値のRLSポリシー
create policy "タスク経験値はタスク所有者が参照可能" 
    on ff_tasks.task_experience
    for select using (
        exists (
            select 1 from ff_tasks.tasks
            where id = task_experience.task_id
            and user_id = auth.uid()
        )
    );

create policy "タスク経験値はプロジェクトメンバーも参照可能" 
    on ff_tasks.task_experience
    for select using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_experience.task_id
            and pm.user_id = auth.uid()
        )
    );

create policy "システム管理者はタスク経験値を参照可能"
    on ff_tasks.task_experience
    for select using (ff_users.is_system_admin(auth.uid()));

-- 更新日時トリガー
create trigger handle_updated_at before update on ff_tasks.task_experience
    for each row execute procedure moddatetime (updated_at); 