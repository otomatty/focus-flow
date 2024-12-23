-- schedules のRLSポリシー
alter table schedules enable row level security;

create policy "ユーザーは自分のスケジュールを参照可能"
    on schedules for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分のスケジュールを作成可能"
    on schedules for insert
    with check (auth.uid() = user_id);

create policy "ユーザーは自分のスケジュールを更新可能"
    on schedules for update
    using (auth.uid() = user_id);

create policy "ユーザーは自分のスケジュールを削除可能"
    on schedules for delete
    using (auth.uid() = user_id);

-- schedule_tasks のRLSポリシー
alter table schedule_tasks enable row level security;

create policy "ユーザーは自分のスケジュールのタスク紐付けを参照可能"
    on schedule_tasks for select
    using (
        exists (
            select 1 from schedules
            where schedules.id = schedule_tasks.schedule_id
            and schedules.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のスケジュールにタスクを紐付け可能"
    on schedule_tasks for insert
    with check (
        exists (
            select 1 from schedules
            where schedules.id = schedule_id
            and schedules.user_id = auth.uid()
        )
        and
        exists (
            select 1 from tasks
            where tasks.id = task_id
            and tasks.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のスケジュールのタスク紐付けを更新可能"
    on schedule_tasks for update
    using (
        exists (
            select 1 from schedules
            where schedules.id = schedule_id
            and schedules.user_id = auth.uid()
        )
    );

create policy "ユーザーは自分のスケジュールのタスク紐付けを削除可能"
    on schedule_tasks for delete
    using (
        exists (
            select 1 from schedules
            where schedules.id = schedule_id
            and schedules.user_id = auth.uid()
        )
    ); 