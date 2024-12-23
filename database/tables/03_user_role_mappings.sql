-- ユーザーロールマッピングテーブル
create table if not exists user_role_mappings (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    role_id uuid references user_roles(id) not null,
    is_active boolean default true,
    assigned_at timestamp with time zone default now(),
    assigned_by uuid references auth.users(id),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- アクティブなマッピングの重複を防ぐ
    unique(user_id, role_id, is_active)
); 