-- user_profiles のインデックス
comment on index ff_users.idx_user_profiles_user_id is 'ユーザーIDによる高速検索用';
comment on index ff_users.idx_user_profiles_level is 'ユーザーレベルによるフィルタリング用';
comment on index ff_users.idx_user_profiles_last_activity is '最終アクティビティによるソート用';
create index if not exists idx_user_profiles_user_id on ff_users.user_profiles (user_id);
create index if not exists idx_user_profiles_level on ff_users.user_profiles (level);
create index if not exists idx_user_profiles_last_activity on ff_users.user_profiles (last_activity_at);

-- user_roles のインデックス
comment on index ff_users.idx_user_roles_name is 'ロール名による高速検索用';
comment on index ff_users.idx_user_roles_role_type is 'ロールタイプによるフィルタリング用';
create index if not exists idx_user_roles_name on ff_users.user_roles (name);
create index if not exists idx_user_roles_role_type on ff_users.user_roles (role_type);

-- user_role_mappings のインデックス
comment on index ff_users.idx_user_role_mappings_user_id is 'アクティブなユーザーIDによる高速検索用';
comment on index ff_users.idx_user_role_mappings_role_id is 'アクティブなロールIDによる高速検索用';
comment on index ff_users.idx_user_role_mappings_assigned_at is 'ロール割り当て日時によるソート用';
create index if not exists idx_user_role_mappings_user_id on ff_users.user_role_mappings (user_id) where is_active = true;
create index if not exists idx_user_role_mappings_role_id on ff_users.user_role_mappings (role_id) where is_active = true;
create index if not exists idx_user_role_mappings_assigned_at on ff_users.user_role_mappings (assigned_at);

-- user_settings のインデックス
comment on index ff_users.idx_user_settings_user_id is 'ユーザーIDによる高速検索用';
create index if not exists idx_user_settings_user_id on ff_users.user_settings (user_id); 