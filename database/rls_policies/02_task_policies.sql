-- tasks のRLSポリシー
alter table tasks enable row level security;

create policy "ユーザーは自分のタスクを参照可能"
    on tasks for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分のタスクを作成可能"
    on tasks for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分のタスクを更新可能"
    on tasks for update
    using (auth.uid() = user_id);

create policy "ユーザーは自分のタスクを削除可能"
    on tasks for delete
    using (auth.uid() = user_id);

-- task_reminders のRLSポリシー
alter table task_reminders enable row level security;

create policy "ユーザーは自分のタスクのリマインダーを参照可能"
    on task_reminders for select
    using (
        exists (
            select 1 from tasks
            where tasks.id = task_reminders.task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクのリマインダーを作成可能"
    on task_reminders for insert
    with check (
        exists (
            select 1 from tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクのリマインダーを更新可能"
    on task_reminders for update
    using (
        exists (
            select 1 from tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のタスクのリマインダーを削除可能"
    on task_reminders for delete
    using (
        exists (
            select 1 from tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    ); 