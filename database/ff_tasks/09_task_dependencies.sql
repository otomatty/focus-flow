-- 依存関係の種類を定義
create type ff_tasks.dependency_type as enum (
    'required',          -- 必須の依存関係
    'optional',          -- オプションの依存関係
    'conditional'        -- 条件付きの依存関係
);

-- 依存関係の状態を定義
create type ff_tasks.dependency_status as enum (
    'pending',           -- 待機中
    'satisfied',         -- 満たされている
    'blocked',           -- ブロックされている
    'skipped'           -- スキップされた
);

-- 依存関係のタイプを定義
create type ff_tasks.dependency_link_type as enum (
    'finish_to_start',   -- 前のタスクが終わってから開始
    'start_to_start',    -- 同時に開始
    'finish_to_finish',  -- 同時に終了
    'start_to_finish'    -- 前のタスクが開始してから終了
);

-- タスク依存関係テーブル
create table if not exists ff_tasks.task_dependencies (
    dependent_task_id uuid references ff_tasks.tasks(id) on delete cascade,
    prerequisite_task_id uuid references ff_tasks.tasks(id) on delete cascade,
    dependency_type ff_tasks.dependency_type not null,
    link_type ff_tasks.dependency_link_type not null default 'finish_to_start',
    lag_time interval default '0'::interval,
    status ff_tasks.dependency_status not null default 'pending',
    conditions jsonb default null,    -- 条件付き依存の場合の条件
    metadata jsonb default '{}',      -- その他のメタデータ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (dependent_task_id, prerequisite_task_id),
    -- メタデータの構造を検証
    constraint valid_metadata check (
        jsonb_typeof(metadata) = 'object' and
        (metadata ? 'description' or not metadata ? 'description') and
        (metadata ? 'notes' or not metadata ? 'notes')
    ),
    -- 条件の構造を検証
    constraint valid_conditions check (
        conditions is null or (
            jsonb_typeof(conditions) = 'object' and
            (conditions ? 'expression' or not conditions ? 'expression') and
            (conditions ? 'parameters' or not conditions ? 'parameters')
        )
    )
);

-- 既存の制約を削除（存在する場合）
alter table if exists ff_tasks.task_dependencies
drop constraint if exists task_dependencies_no_self_dependency;

-- 自己依存を防ぐ制約を追加
alter table ff_tasks.task_dependencies
add constraint task_dependencies_no_self_dependency
check (dependent_task_id != prerequisite_task_id);

-- 既存のインデックスを削除
drop index if exists ff_tasks.task_dependencies_dependent_idx;
drop index if exists ff_tasks.task_dependencies_prerequisite_idx;
drop index if exists ff_tasks.task_dependencies_status_idx;
drop index if exists ff_tasks.task_dependencies_type_idx;
drop index if exists ff_tasks.task_dependencies_metadata_idx;
drop index if exists ff_tasks.task_dependencies_conditions_idx;

-- インデックスを作成
create index task_dependencies_dependent_idx on ff_tasks.task_dependencies(dependent_task_id);
create index task_dependencies_prerequisite_idx on ff_tasks.task_dependencies(prerequisite_task_id);
create index task_dependencies_status_idx on ff_tasks.task_dependencies(status);
create index task_dependencies_type_idx on ff_tasks.task_dependencies(dependency_type);
create index task_dependencies_metadata_idx on ff_tasks.task_dependencies using gin(metadata);
create index task_dependencies_conditions_idx on ff_tasks.task_dependencies using gin(conditions);

-- 依存関係の循環を防ぐ関数
create or replace function ff_tasks.check_circular_dependency()
returns trigger as $$
begin
    if exists (
        with recursive dependency_chain as (
            -- 初期の依存関係
            select prerequisite_task_id as task_id, array[new.dependent_task_id] as path
            from ff_tasks.task_dependencies
            where dependent_task_id = new.prerequisite_task_id
            union all
            -- 再帰的に依存関係を追跡
            select td.prerequisite_task_id, dc.path || td.dependent_task_id
            from ff_tasks.task_dependencies td
            inner join dependency_chain dc on td.dependent_task_id = dc.task_id
            where not td.prerequisite_task_id = any(dc.path)
        )
        select 1
        from dependency_chain
        where task_id = new.dependent_task_id
        limit 1
    ) then
        raise exception 'Circular dependency detected';
    end if;
    return new;
end;
$$ language plpgsql;

-- 循環依存チェックのトリガー
create trigger check_circular_dependency
    before insert or update on ff_tasks.task_dependencies
    for each row
    execute function ff_tasks.check_circular_dependency();

-- タイムスタンプ更新トリガー
create trigger handle_updated_at
    before update on ff_tasks.task_dependencies
    for each row
    execute procedure moddatetime (updated_at);

-- 前提タスクの完了時に依存関係のステータスを更新する関数
create or replace function ff_tasks.update_dependency_status()
returns trigger as $$
begin
    if new.status = 'completed' and old.status != 'completed' then
        update ff_tasks.task_dependencies
        set status = 'satisfied'
        where prerequisite_task_id = new.id
        and status = 'pending';
    elsif new.status != 'completed' and old.status = 'completed' then
        update ff_tasks.task_dependencies
        set status = 'pending'
        where prerequisite_task_id = new.id
        and status = 'satisfied';
    end if;
    return new;
end;
$$ language plpgsql;

-- タスクの状態変更時に依存関係を更新するトリガー
create trigger update_dependencies_on_task_complete
    after update of status on ff_tasks.tasks
    for each row
    execute function ff_tasks.update_dependency_status();

-- RLSポリシーの設定
alter table ff_tasks.task_dependencies enable row level security;

-- 依存関係のRLSポリシー
create policy "プロジェクトメンバーは依存関係を参照可能"
    on ff_tasks.task_dependencies
    for select
    using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_dependencies.dependent_task_id
            and pm.user_id = auth.uid()
        )
    );

create policy "プロジェクトメンバーは依存関係を作成可能"
    on ff_tasks.task_dependencies
    for insert
    with check (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_dependencies.dependent_task_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクトメンバーは依存関係を更新可能"
    on ff_tasks.task_dependencies
    for update
    using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_dependencies.dependent_task_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクト管理者は依存関係を削除可能"
    on ff_tasks.task_dependencies
    for delete
    using (
        exists (
            select 1 from ff_tasks.tasks t
            join ff_tasks.project_members pm on t.project_id = pm.project_id
            where t.id = task_dependencies.dependent_task_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN')
        )
    );

create policy "システム管理者は依存関係を管理可能"
    on ff_tasks.task_dependencies
    for all
    using (ff_users.is_system_admin(auth.uid()));

-- テーブルコメント
comment on table ff_tasks.task_dependencies is 'タスク間の依存関係を管理するテーブル';

-- カラムコメント
comment on column ff_tasks.task_dependencies.dependent_task_id is '依存するタスクのID';
comment on column ff_tasks.task_dependencies.prerequisite_task_id is '前提条件となるタスクのID';
comment on column ff_tasks.task_dependencies.dependency_type is '依存関係の種類';
comment on column ff_tasks.task_dependencies.link_type is '依存関係のタイプ';
comment on column ff_tasks.task_dependencies.lag_time is '依存関係の遅延時間';
comment on column ff_tasks.task_dependencies.status is '依存関係の状態';
comment on column ff_tasks.task_dependencies.conditions is '条件付き依存の場合の条件';
comment on column ff_tasks.task_dependencies.metadata is '依存関係に関する追加情報'; 