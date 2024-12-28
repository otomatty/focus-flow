-- タスクグループメンバーシップテーブル
create table if not exists task_group_memberships (
    task_id uuid references tasks(id) on delete cascade,
    group_id uuid references task_groups(id) on delete cascade,
    position integer,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    primary key (task_id, group_id)
);

-- メンバーシップ更新時のタイムスタンプを自動更新するトリガー
create or replace function update_task_group_memberships_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger task_group_memberships_updated_at
    before update on task_group_memberships
    for each row
    execute function update_task_group_memberships_updated_at();

-- グループ内でのタスクの位置を管理するための関数
create or replace function update_membership_positions()
returns trigger as $$
begin
    if tg_op = 'INSERT' or old.group_id != new.group_id then
        select coalesce(max(position), 0) + 1 into new.position
        from task_group_memberships
        where group_id = new.group_id;
    end if;
    return new;
end;
$$ language plpgsql;

create trigger maintain_membership_positions
    before insert or update of group_id on task_group_memberships
    for each row
    execute function update_membership_positions(); 