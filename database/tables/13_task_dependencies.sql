-- 既存のオブジェクトを削除
drop trigger if exists update_dependencies_on_task_complete on tasks;
drop trigger if exists task_dependencies_updated_at on task_dependencies;
drop trigger if exists check_circular_dependency on task_dependencies;

drop function if exists update_dependency_status();
drop function if exists update_task_dependencies_updated_at();
drop function if exists check_circular_dependency();

drop table if exists task_dependencies;
drop type if exists dependency_status;
drop type if exists dependency_type;
drop type if exists dependency_link_type;

-- 依存関係の種類を定義
create type dependency_type as enum (
    'required',          -- 必須の依存関係
    'optional',          -- オプションの依存関係
    'conditional'        -- 条件付きの依存関係
);

-- 依存関係の状態を定義
create type dependency_status as enum (
    'pending',           -- 待機中
    'satisfied',         -- 満たされている
    'blocked',           -- ブロックされている
    'skipped'           -- スキップされた
);

-- 依存関係のタイプを定義
create type dependency_link_type as enum (
    'finish_to_start',   -- 前のタスクが終わってから開始
    'start_to_start',    -- 同時に開始
    'finish_to_finish',  -- 同時に終了
    'start_to_finish'    -- 前のタスクが開始してから終了
);

-- タスク依存関係テーブル
create table if not exists task_dependencies (
    dependent_task_id uuid references tasks(id) on delete cascade,
    prerequisite_task_id uuid references tasks(id) on delete cascade,
    dependency_type dependency_type not null,
    link_type dependency_link_type not null default 'finish_to_start',
    lag_time interval default '0'::interval,
    status dependency_status not null default 'pending',
    conditions jsonb default null,    -- 条件付き依存の場合の条件
    metadata jsonb default '{}',      -- その他のメタデータ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (dependent_task_id, prerequisite_task_id)
);

-- 自己依存を防ぐ制約
alter table task_dependencies
add constraint task_dependencies_no_self_dependency
check (dependent_task_id != prerequisite_task_id);

-- 依存関係の循環を防ぐ関数
create or replace function check_circular_dependency()
returns trigger as $$
begin
    if exists (
        with recursive dependency_chain as (
            -- 初期の依存関係
            select prerequisite_task_id as task_id, array[new.dependent_task_id] as path
            from task_dependencies
            where dependent_task_id = new.prerequisite_task_id
            union all
            -- 再帰的に依存関係を追跡
            select td.prerequisite_task_id, dc.path || td.dependent_task_id
            from task_dependencies td
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
    before insert or update on task_dependencies
    for each row
    execute function check_circular_dependency();

-- 依存関係更新時のタイムスタンプを自動更新するトリガー
create or replace function update_task_dependencies_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger task_dependencies_updated_at
    before update on task_dependencies
    for each row
    execute function update_task_dependencies_updated_at();

-- 前提タスクの完了時に依存関係のステータスを更新する関数
create or replace function update_dependency_status()
returns trigger as $$
begin
    if new.status = 'completed' and old.status != 'completed' then
        update task_dependencies
        set status = 'satisfied'
        where prerequisite_task_id = new.id
        and status = 'pending';
    elsif new.status != 'completed' and old.status = 'completed' then
        update task_dependencies
        set status = 'pending'
        where prerequisite_task_id = new.id
        and status = 'satisfied';
    end if;
    return new;
end;
$$ language plpgsql;

-- タスクの状態変更時に依存関係を更新するトリガー
create trigger update_dependencies_on_task_complete
    after update of status on tasks
    for each row
    execute function update_dependency_status(); 