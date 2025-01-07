-- タスク分解履歴テーブル
create table if not exists ff_tasks.task_breakdown_history (
    id uuid primary key default uuid_generate_v4(),
    original_task_id uuid not null,                    -- 元のタスクID
    original_task_data jsonb not null,                 -- 元のタスクの状態（スナップショット）
    analysis_result jsonb not null,                    -- AI分析結果
    generated_task_ids uuid[] not null,                -- 生成された新しいタスクのID配列
    created_by uuid references auth.users(id) not null, -- 分解を実行したユーザー
    created_at timestamp with time zone default now(),
    -- 配列が空でないことを確認
    constraint generated_tasks_not_empty check (array_length(generated_task_ids, 1) > 0),
    -- JSONBフィールドの構造を検証
    constraint valid_original_task_data check (jsonb_typeof(original_task_data) = 'object'),
    constraint valid_analysis_result check (jsonb_typeof(analysis_result) = 'object')
);

comment on table ff_tasks.task_breakdown_history is 'タスク分解の履歴を保存するテーブル';
comment on column ff_tasks.task_breakdown_history.original_task_id is '分解される前の元のタスクのID';
comment on column ff_tasks.task_breakdown_history.original_task_data is '元のタスクの完全な状態のスナップショット';
comment on column ff_tasks.task_breakdown_history.analysis_result is 'AIによる分析結果の詳細データ';
comment on column ff_tasks.task_breakdown_history.generated_task_ids is '分解によって生成された新しいタスクのID配列';
comment on column ff_tasks.task_breakdown_history.created_by is 'タスク分解を実行したユーザーのID';

-- タスク分解結果テーブル
create table if not exists ff_tasks.task_breakdown_results (
    id uuid primary key default uuid_generate_v4(),
    breakdown_history_id uuid references ff_tasks.task_breakdown_history(id) on delete cascade,
    task_id uuid not null,                            -- 生成されたタスクID
    breakdown_metadata jsonb not null,                 -- 分解時のメタデータ
    skill_category_id uuid,                           -- TODO: ff_skills.skill_categoriesへの参照を後で追加
    estimated_experience_points integer default 0,
    estimated_duration interval,
    dependencies jsonb,                                -- 依存関係情報
    created_at timestamp with time zone default now(),
    -- 経験値は0以上
    constraint positive_experience_points check (estimated_experience_points >= 0),
    -- メタデータの構造を検証
    constraint valid_breakdown_metadata check (jsonb_typeof(breakdown_metadata) = 'object'),
    constraint valid_dependencies check (
        dependencies is null or jsonb_typeof(dependencies) = 'object'
    )
);

comment on table ff_tasks.task_breakdown_results is 'タスク分解によって生成された個々のタスクの詳細情報';
comment on column ff_tasks.task_breakdown_results.breakdown_history_id is '関連する分解履歴のID';
comment on column ff_tasks.task_breakdown_results.task_id is '生成された新しいタスクのID';
comment on column ff_tasks.task_breakdown_results.breakdown_metadata is 'タスク分解時の詳細なメタデータ';
comment on column ff_tasks.task_breakdown_results.skill_category_id is 'タスクに関連するスキルカテゴリのID';
comment on column ff_tasks.task_breakdown_results.estimated_experience_points is '予測される獲得経験値';
comment on column ff_tasks.task_breakdown_results.estimated_duration is '予測される所要時間';
comment on column ff_tasks.task_breakdown_results.dependencies is 'タスク間の依存関係情報';

-- インデックス
create index task_breakdown_history_original_task_id_idx 
    on ff_tasks.task_breakdown_history(original_task_id);
create index task_breakdown_history_created_by_idx 
    on ff_tasks.task_breakdown_history(created_by);
create index task_breakdown_history_created_at_idx 
    on ff_tasks.task_breakdown_history(created_at desc);
create index task_breakdown_results_breakdown_history_id_idx 
    on ff_tasks.task_breakdown_results(breakdown_history_id);
create index task_breakdown_results_task_id_idx 
    on ff_tasks.task_breakdown_results(task_id);
create index task_breakdown_results_skill_category_id_idx 
    on ff_tasks.task_breakdown_results(skill_category_id);
create index task_breakdown_results_created_at_idx 
    on ff_tasks.task_breakdown_results(created_at desc);

-- RLSポリシー
alter table ff_tasks.task_breakdown_history enable row level security;
alter table ff_tasks.task_breakdown_results enable row level security;

-- 履歴のRLSポリシー
create policy "タスク分解履歴は作成者が参照可能" 
    on ff_tasks.task_breakdown_history
    for select using (auth.uid() = created_by);

create policy "タスク分解履歴は作成者が削除可能"
    on ff_tasks.task_breakdown_history
    for delete using (auth.uid() = created_by);

-- 結果のRLSポリシー
create policy "タスク分解結果は関連する履歴の作成者が参照可能" 
    on ff_tasks.task_breakdown_results
    for select using (
        exists (
            select 1 from ff_tasks.task_breakdown_history
            where id = task_breakdown_results.breakdown_history_id
            and created_by = auth.uid()
        )
    ); 