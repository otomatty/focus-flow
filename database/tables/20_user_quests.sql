-- ユーザークエストテーブル
create table if not exists user_quests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    quest_id uuid references quests(id) not null,
    progress jsonb not null default '{}'::jsonb,
    status text check (status in ('in_progress', 'completed', 'failed')),
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- 進行中のクエストの重複を防ぐためのユニークインデックス
create unique index if not exists idx_user_quests_active_unique 
    on user_quests (user_id, quest_id)
    where status = 'in_progress';