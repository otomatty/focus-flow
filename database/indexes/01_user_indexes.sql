-- user_profiles のインデックス
create index if not exists idx_user_profiles_user_id on user_profiles (user_id);
create index if not exists idx_user_profiles_level on user_profiles (level);
create index if not exists idx_user_profiles_last_activity on user_profiles (last_activity_at);

-- user_role_mappings のインデックス
create index if not exists idx_user_role_mappings_user_id on user_role_mappings (user_id) where is_active = true;
create index if not exists idx_user_role_mappings_role_id on user_role_mappings (role_id) where is_active = true;
create index if not exists idx_user_role_mappings_assigned_at on user_role_mappings (assigned_at);

-- user_settings のインデックス
create index if not exists idx_user_settings_user_id on user_settings (user_id); 