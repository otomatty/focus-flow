-- タスクグループメンバーシップテーブル
create table if not exists ff_tasks.task_group_memberships (
    task_id uuid references ff_tasks.tasks(id) on delete cascade,
    group_id uuid references ff_tasks.task_groups(id) on delete cascade,
    position integer,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (task_id, group_id)
);

-- インデックス
create index task_group_memberships_task_idx on ff_tasks.task_group_memberships(task_id);
create index task_group_memberships_group_idx on ff_tasks.task_group_memberships(group_id);
create index task_group_memberships_position_idx on ff_tasks.task_group_memberships(group_id, position);

-- タイムスタンプ更新トリガー
create trigger handle_updated_at
    before update on ff_tasks.task_group_memberships
    for each row
    execute procedure moddatetime (updated_at);

-- グループ内でのタスクの位置を管理するための関数
create or replace function ff_tasks.update_membership_positions()
returns trigger as $$
begin
    if tg_op = 'INSERT' or old.group_id != new.group_id then
        -- 新しいグループ内での最後の位置を取得
        select coalesce(max(position), 0) + 1 into new.position
        from ff_tasks.task_group_memberships
        where group_id = new.group_id;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger maintain_membership_positions
    before insert or update of group_id on ff_tasks.task_group_memberships
    for each row
    execute function ff_tasks.update_membership_positions();

-- RLSポリシーの設定
alter table ff_tasks.task_group_memberships enable row level security;

-- メンバーシップのRLSポリシー
create policy "プロジェクトメンバーはメンバーシップを参照可能"
    on ff_tasks.task_group_memberships
    for select
    using (
        exists (
            select 1 from ff_tasks.task_groups g
            join ff_tasks.project_members pm on g.project_id = pm.project_id
            where g.id = task_group_memberships.group_id
            and pm.user_id = auth.uid()
        )
    );

create policy "プロジェクトメンバーはメンバーシップを作成可能"
    on ff_tasks.task_group_memberships
    for insert
    with check (
        exists (
            select 1 from ff_tasks.task_groups g
            join ff_tasks.project_members pm on g.project_id = pm.project_id
            where g.id = task_group_memberships.group_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクトメンバーはメンバーシップを更新可能"
    on ff_tasks.task_group_memberships
    for update
    using (
        exists (
            select 1 from ff_tasks.task_groups g
            join ff_tasks.project_members pm on g.project_id = pm.project_id
            where g.id = task_group_memberships.group_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN', 'MEMBER')
        )
    );

create policy "プロジェクト管理者はメンバーシップを削除可能"
    on ff_tasks.task_group_memberships
    for delete
    using (
        exists (
            select 1 from ff_tasks.task_groups g
            join ff_tasks.project_members pm on g.project_id = pm.project_id
            where g.id = task_group_memberships.group_id
            and pm.user_id = auth.uid()
            and pm.role in ('OWNER', 'ADMIN')
        )
    );

create policy "システム管理者はメンバーシップを管理可能"
    on ff_tasks.task_group_memberships
    for all
    using (ff_users.is_system_admin(auth.uid()));

-- テーブルコメント
comment on table ff_tasks.task_group_memberships is 'タスクとグループの関連付けを管理するテーブル';

-- カラムコメント
comment on column ff_tasks.task_group_memberships.task_id is '関連付けられたタスクのID';
comment on column ff_tasks.task_group_memberships.group_id is '関連付けられたグループのID';
comment on column ff_tasks.task_group_memberships.position is 'グループ内でのタスクの表示順序';
comment on column ff_tasks.task_group_memberships.created_at is '作成日時';
comment on column ff_tasks.task_group_memberships.updated_at is '更新日時'; 