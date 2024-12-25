-- tasks のインデックス
create index if not exists idx_tasks_user_id on tasks (user_id);
create index if not exists idx_tasks_status on tasks (status);
create index if not exists idx_tasks_due_date on tasks (due_date) where status != 'completed';
create index if not exists idx_tasks_category on tasks (category);
create index if not exists idx_tasks_priority_status on tasks (priority, status);
create index if not exists idx_tasks_created_at on tasks (created_at);
create index if not exists idx_tasks_parent_id on tasks (parent_task_id);
create index if not exists idx_tasks_completion_order on tasks (completion_order) where parent_task_id is not null;
create index if not exists idx_tasks_ai_generated on tasks (ai_generated);

-- task_reminders のインデックス
create index if not exists idx_task_reminders_task_id on task_reminders (task_id);
create index if not exists idx_task_reminders_reminder_time on task_reminders (reminder_time) where not is_sent;
create index if not exists idx_task_reminders_is_sent on task_reminders (is_sent);

-- task_breakdowns のインデックス
create index if not exists idx_task_breakdowns_parent_id on task_breakdowns (parent_task_id);
create index if not exists idx_task_breakdowns_order on task_breakdowns (order_index);
create index if not exists idx_task_breakdowns_status on task_breakdowns (status);

-- task_experience のインデックス
create index if not exists idx_task_experience_task_id on task_experience (task_id);
create index if not exists idx_task_experience_skill on task_experience (skill_category);

-- user_skills のインデックス
create index if not exists idx_user_skills_user_id on user_skills (user_id);
create index if not exists idx_user_skills_category on user_skills (skill_category);
create index if not exists idx_user_skills_level on user_skills (current_level); 