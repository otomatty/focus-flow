-- schedules のインデックス
create index if not exists idx_schedules_user_id on schedules (user_id);
create index if not exists idx_schedules_day_of_week on schedules (day_of_week);
create index if not exists idx_schedules_activity_type on schedules (activity_type);
create index if not exists idx_schedules_day_and_time on schedules (day_of_week, start_time, end_time);

-- schedule_tasks のインデックス
create index if not exists idx_schedule_tasks_schedule_id on schedule_tasks (schedule_id);
create index if not exists idx_schedule_tasks_task_id on schedule_tasks (task_id); 