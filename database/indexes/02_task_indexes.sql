-- tasks のインデックス
create index if not exists idx_tasks_user_id on tasks (user_id);
create index if not exists idx_tasks_status on tasks (status);
create index if not exists idx_tasks_due_date on tasks (due_date) where status != 'completed';
create index if not exists idx_tasks_category on tasks (category);
create index if not exists idx_tasks_priority_status on tasks (priority, status);
create index if not exists idx_tasks_created_at on tasks (created_at);

-- task_reminders のインデックス
create index if not exists idx_task_reminders_task_id on task_reminders (task_id);
create index if not exists idx_task_reminders_reminder_time on task_reminders (reminder_time) where not is_sent;
create index if not exists idx_task_reminders_is_sent on task_reminders (is_sent); 