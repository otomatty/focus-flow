-- ユーザークエストテーブル
create table if not exists ff_gamification.user_quests (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    quest_id uuid references ff_gamification.quests(id) not null,
    progress jsonb not null default '{}'::jsonb,
    status text check (status in ('in_progress', 'completed', 'failed', 'expired')),
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    completed_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- パーティークエスト進捗テーブル
create table if not exists ff_gamification.party_quest_progress (
    id uuid primary key default uuid_generate_v4(),
    party_id uuid references ff_social.parties(id) not null,
    progress jsonb not null default '{}'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(party_id)
);

-- 進行中のクエストの重複を防ぐためのユニークインデックス
create unique index if not exists idx_user_quests_active_unique 
    on ff_gamification.user_quests (user_id, quest_id)
    where status = 'in_progress';

-- その他のインデックス
create index if not exists idx_user_quests_user_id on ff_gamification.user_quests(user_id);
create index if not exists idx_user_quests_quest_id on ff_gamification.user_quests(quest_id);
create index if not exists idx_user_quests_status on ff_gamification.user_quests(status);
create index if not exists idx_user_quests_start_date on ff_gamification.user_quests(start_date);
create index if not exists idx_user_quests_end_date on ff_gamification.user_quests(end_date);
create index if not exists idx_party_quest_progress_party_id on ff_gamification.party_quest_progress(party_id);

-- テーブルコメント
comment on table ff_gamification.user_quests is 'ユーザーごとのクエスト進捗を管理するテーブル';
comment on table ff_gamification.party_quest_progress is 'パーティークエストの進捗を管理するテーブル';

-- カラムコメント
comment on column ff_gamification.user_quests.progress is 'クエストの進捗状況をJSON形式で保存';
comment on column ff_gamification.user_quests.status is 'クエストの状態（進行中、完了、失敗、期限切れ）';
comment on column ff_gamification.party_quest_progress.progress is 'パーティー全体のクエスト進捗をJSON形式で保存';

-- 更新日時を自動更新するトリガー
create or replace function ff_gamification.update_updated_at()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

create trigger update_user_quests_updated_at
    before update on ff_gamification.user_quests
    for each row
    execute function ff_gamification.update_updated_at();

create trigger update_party_quest_progress_updated_at
    before update on ff_gamification.party_quest_progress
    for each row
    execute function ff_gamification.update_updated_at();

-- RLSポリシー
alter table ff_gamification.user_quests enable row level security;
alter table ff_gamification.party_quest_progress enable row level security;

-- ユーザークエスト用のポリシー
create policy "ユーザーは自分のクエスト情報を参照可能"
    on ff_gamification.user_quests for select
    using (auth.uid() = user_id);

create policy "ユーザーは自分のクエスト情報を更新可能"
    on ff_gamification.user_quests for update
    using (auth.uid() = user_id);

-- パーティークエスト進捗用のポリシー
create policy "パーティーメンバーは進捗を参照可能"
    on ff_gamification.party_quest_progress for select
    using (exists (
        select 1 from ff_social.party_members
        where party_id = ff_gamification.party_quest_progress.party_id
        and user_id = auth.uid()
    ));

create policy "システムのみが進捗を更新可能"
    on ff_gamification.party_quest_progress
    using (false)
    with check (false);