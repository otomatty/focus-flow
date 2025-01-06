-- タスク関連性の種類を定義
create type ff_tasks.task_relationship_type as enum (
    'related',           -- 関連
    'references',        -- 参照
    'derived_from',      -- 派生
    'blocks',           -- ブロック
    'duplicates'        -- 重複
);

-- タスク関連性テーブル
create table if not exists ff_tasks.task_relationships (
    source_task_id uuid references ff_tasks.tasks(id) on delete cascade,
    target_task_id uuid references ff_tasks.tasks(id) on delete cascade,
    relationship_type ff_tasks.task_relationship_type not null,
    metadata jsonb default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (source_task_id, target_task_id, relationship_type),
    -- メタデータの構造を検証
    constraint valid_metadata check (
        jsonb_typeof(metadata) = 'object' and
        (metadata ? 'description' or not metadata ? 'description') and
        (metadata ? 'notes' or not metadata ? 'notes')
    )
);

-- 自己参照を防ぐ制約
alter table ff_tasks.task_relationships
add constraint task_relationships_no_self_reference
check (source_task_id != target_task_id);

-- インデックス
create index task_relationships_source_idx on ff_tasks.task_relationships(source_task_id);
create index task_relationships_target_idx on ff_tasks.task_relationships(target_task_id);
create index task_relationships_type_idx on ff_tasks.task_relationships(relationship_type);
create index task_relationships_metadata_idx on ff_tasks.task_relationships using gin(metadata);

-- タイムスタンプ更新トリガー
create trigger handle_updated_at
    before update on ff_tasks.task_relationships
    for each row
    execute procedure moddatetime (updated_at);

-- RLSポリシーの設定
alter table ff_tasks.task_relationships enable row level security;

-- 関連性のRLSポリシー
create policy "プロジェクトメンバーは関連性を参照可能"
    on ff_tasks.task_relationships
    for select
    using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_relationships.source_task_id
            and pm.user_id = auth.uid()
        )
    );

create policy "プロジェクトメンバーは関連性を作成可能"
    on ff_tasks.task_relationships
    for insert
    with check (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_relationships.source_task_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクトメンバーは関連性を更新可能"
    on ff_tasks.task_relationships
    for update
    using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_relationships.source_task_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクト管理者は関連性を削除可能"
    on ff_tasks.task_relationships
    for delete
    using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_relationships.source_task_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN')
        )
    );

create policy "システム管理者は関連性を管理可能"
    on ff_tasks.task_relationships
    for all
    using (ff_users.is_system_admin(auth.uid()));

-- テーブルコメント
comment on table ff_tasks.task_relationships is 'タスク間の関連性を管理するテーブル';

-- カラムコメント
comment on column ff_tasks.task_relationships.source_task_id is '関連元のタスクID';
comment on column ff_tasks.task_relationships.target_task_id is '関連先のタスクID';
comment on column ff_tasks.task_relationships.relationship_type is '関連性の種類';
comment on column ff_tasks.task_relationships.metadata is '関連性に関する追加情報'; 