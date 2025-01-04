-- ff_tasksスキーマへの権限設定
grant usage on schema ff_tasks to authenticated;
grant usage on schema ff_tasks to anon;
grant all on schema ff_tasks to service_role;

-- tasks のRLSポリシー
alter table ff_tasks.tasks enable row level security;

create policy "ユーザーは自分のタスクを参照可能"
    on ff_tasks.tasks for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分のタスクを作成可能"
    on ff_tasks.tasks for insert
    with check (
        auth.uid() = user_id
        and (
            project_id is null
            or exists (
                select 1 from ff_tasks.projects
                where projects.id = project_id
                and projects.user_id = auth.uid()
            )
        )
    );

create policy "ユーザーは自分のタスクを更新可能"
    on ff_tasks.tasks for update
    using (auth.uid() = user_id);

create policy "ユーザーは自分のタスクを削除可能"
    on ff_tasks.tasks for delete
    using (auth.uid() = user_id);

-- task_groups のRLSポリシー
alter table ff_tasks.task_groups enable row level security;

create policy "プロジェクト所有者のみグループにアクセス可能"
    on ff_tasks.task_groups for all
    using (
        exists (
            select 1 from ff_tasks.projects
            where projects.id = task_groups.project_id
            and projects.user_id = auth.uid()
        )
    );

-- task_group_memberships のRLSポリシー
alter table ff_tasks.task_group_memberships enable row level security;

create policy "タスク所有者のみメンバーシップにアクセス可能"
    on ff_tasks.task_group_memberships for all
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_group_memberships.task_id
            and tasks.user_id = auth.uid()
        )
    );

-- task_relationships のRLSポリシー
alter table ff_tasks.task_relationships enable row level security;

create policy "タスク所有者のみ関連性にアクセス可能"
    on ff_tasks.task_relationships for all
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_relationships.source_task_id
            and tasks.user_id = auth.uid()
        )
    );

-- task_dependencies のRLSポリシー
alter table ff_tasks.task_dependencies enable row level security;

create policy "タスク所有者のみ依存関係にアクセス可能"
    on ff_tasks.task_dependencies for all
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_dependencies.dependent_task_id
            and tasks.user_id = auth.uid()
        )
    );

-- task_reminders のRLSポリシー
alter table ff_tasks.task_reminders enable row level security;

create policy "ユーザーは自分のタスクのリマインダーを参照可能"
    on ff_tasks.task_reminders for select
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_reminders.task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクのリマインダーを作成可能"
    on ff_tasks.task_reminders for insert
    with check (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクのリマインダーを更新可能"
    on ff_tasks.task_reminders for update
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクのリマインダーを削除可能"
    on ff_tasks.task_reminders for delete
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

-- task_breakdowns のRLSポリシー
alter table ff_tasks.task_breakdowns enable row level security;

create policy "ユーザーは自分のタスクの分解を参照可能"
    on ff_tasks.task_breakdowns for select
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_breakdowns.parent_task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクの分解を作成可能"
    on ff_tasks.task_breakdowns for insert
    with check (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = parent_task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクの分解を更新可能"
    on ff_tasks.task_breakdowns for update
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = parent_task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクの分解を削除可能"
    on ff_tasks.task_breakdowns for delete
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = parent_task_id
            and tasks.user_id = auth.uid()
        )
    );

-- task_experience のRLSポリシー
alter table ff_tasks.task_experience enable row level security;

create policy "ユーザーは自分のタスクの経験値を参照可能"
    on ff_tasks.task_experience for select
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_experience.task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクの経験値を作成可能"
    on ff_tasks.task_experience for insert
    with check (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクの経験値を更新可能"
    on ff_tasks.task_experience for update
    using (
        exists (
            select 1 from ff_tasks.tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    ); 