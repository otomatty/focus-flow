-- タスク関連性の種類を定義
create type task_relationship_type as enum (
    'related',           -- 関連
    'references',        -- 参照
    'derived_from',      -- 派生
    'blocks',           -- ブロック
    'duplicates'        -- 重複
);

-- タスク関連性テーブル
create table if not exists task_relationships (
    source_task_id uuid references tasks(id) on delete cascade,
    target_task_id uuid references tasks(id) on delete cascade,
    relationship_type task_relationship_type not null,
    metadata jsonb default '{}',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (source_task_id, target_task_id, relationship_type)
);

-- 自己参照を防ぐ制約
alter table task_relationships
add constraint task_relationships_no_self_reference
check (source_task_id != target_task_id);

-- 関連性更新時のタイムスタンプを自動更新するトリガー
create or replace function update_task_relationships_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger task_relationships_updated_at
    before update on task_relationships
    for each row
    execute function update_task_relationships_updated_at(); 