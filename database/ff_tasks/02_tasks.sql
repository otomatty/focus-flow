-- タスクソースの定義
create type ff_tasks.task_source as enum (
    'focus_flow',    -- Focus Flow独自のタスク
    'github',        -- GitHubのIssueやPR
    'jira',          -- Jiraのタスク
    'trello',        -- Trelloのカード
    'asana',         -- Asanaのタスク
    'notion',        -- Notionのタスク
    'clickup',       -- ClickUpのタスク
    'linear'         -- Linearのタスク
);

-- タスク関連の型定義
create type ff_tasks.task_status as enum (
    'not_started',
    'in_progress',
    'in_review',
    'blocked',
    'completed',
    'cancelled'
);

create type ff_tasks.task_priority as enum (
    'high',
    'medium',
    'low'
);

-- タスクテーブル
create table if not exists ff_tasks.tasks (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    project_id uuid references ff_tasks.projects(id) on delete set null,  -- NULLを許容
    title text not null,
    description text,
    start_date timestamp with time zone,
    due_date timestamp with time zone,
    priority ff_tasks.task_priority not null default 'medium',
    category text,
    status ff_tasks.task_status not null default 'not_started',
    progress_percentage integer check (progress_percentage between 0 and 100),
    is_recurring boolean default false,
    recurring_pattern jsonb,
    ai_generated boolean default false,
    difficulty_level integer check (difficulty_level between 1 and 5),
    estimated_duration interval,
    actual_duration interval,
    style jsonb default '{"color": null, "icon": null}',
    source ff_tasks.task_source not null default 'focus_flow',
    external_id text,                    -- 外部ツールでのID
    external_url text,                   -- 外部ツールでのURL
    external_data jsonb,                 -- 外部ツールの追加データ
    last_synced_at timestamp with time zone,  -- 最後に同期した時刻
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- プロジェクトのタスク順序管理（プロジェクトに属する場合のみ）
create table if not exists ff_tasks.task_positions (
    project_id uuid not null references ff_tasks.projects(id) on delete cascade,
    task_id uuid not null references ff_tasks.tasks(id) on delete cascade,
    position integer not null,
    created_at timestamp with time zone default now(),
    primary key (project_id, task_id)
);

-- インデックス
create index if not exists tasks_user_id_idx on ff_tasks.tasks(user_id);
create index if not exists tasks_project_id_idx on ff_tasks.tasks(project_id);
create index if not exists tasks_status_idx on ff_tasks.tasks(status);
create index if not exists tasks_due_date_idx on ff_tasks.tasks(due_date);
create index if not exists tasks_source_external_id_idx on ff_tasks.tasks(source, external_id) 
    where source != 'focus_flow' and external_id is not null;
create unique index if not exists unique_external_task on ff_tasks.tasks(source, external_id)
    where source != 'focus_flow' and external_id is not null;
create index if not exists task_positions_project_id_position_idx on ff_tasks.task_positions(project_id, position);

-- RLSポリシー
alter table ff_tasks.tasks enable row level security;
alter table ff_tasks.task_positions enable row level security;

-- タスクのRLSポリシー
create policy "タスクは所有者が参照可能" on ff_tasks.tasks
    for select using (auth.uid() = user_id);

create policy "プロジェクトに属するタスクはプロジェクトメンバーも参照可能" on ff_tasks.tasks
    for select using (
        project_id is not null and exists (
            select 1 from ff_tasks.project_members
            where project_id = tasks.project_id
            and user_id = auth.uid()
        )
    );

create policy "タスクは所有者が作成可能" on ff_tasks.tasks
    for insert with check (auth.uid() = user_id);

create policy "タスクは所有者が更新可能" on ff_tasks.tasks
    for update using (auth.uid() = user_id);

create policy "タスクは所有者が削除可能" on ff_tasks.tasks
    for delete using (auth.uid() = user_id);

-- タスク位置のRLSポリシー
create policy "タスク位置はプロジェクトメンバーが参照可能" on ff_tasks.task_positions
    for select using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = task_positions.project_id
            and user_id = auth.uid()
        )
    );

create policy "タスク位置はプロジェクトメンバーが更新可能" on ff_tasks.task_positions
    for all using (
        exists (
            select 1 from ff_tasks.project_members
            where project_id = task_positions.project_id
            and user_id = auth.uid()
            and role in ('owner', 'admin', 'member')
        )
    );

-- 更新日時トリガー
create trigger handle_updated_at before update on ff_tasks.tasks
    for each row execute procedure moddatetime (updated_at); 