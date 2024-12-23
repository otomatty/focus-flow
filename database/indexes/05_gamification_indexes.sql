-- badges のインデックス
create index if not exists idx_badges_condition_type on badges (condition_type);

-- user_badges のインデックス
create index if not exists idx_user_badges_user_id on user_badges (user_id);
create index if not exists idx_user_badges_badge_id on user_badges (badge_id);
create index if not exists idx_user_badges_acquired_at on user_badges (acquired_at);

-- quests のインデックス
create index if not exists idx_quests_quest_type on quests (quest_type);
create index if not exists idx_quests_duration_type on quests (duration_type);

-- user_quests のインデックス
create index if not exists idx_user_quests_user_id on user_quests (user_id);
create index if not exists idx_user_quests_quest_id on user_quests (quest_id);
create index if not exists idx_user_quests_status on user_quests (status) where status = 'in_progress';
create index if not exists idx_user_quests_start_date on user_quests (start_date);
create index if not exists idx_user_quests_end_date on user_quests (end_date);
create index if not exists idx_user_quests_user_status on user_quests (user_id, status); 