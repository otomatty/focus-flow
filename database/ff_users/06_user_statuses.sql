--ff_focus.focus_sessionsを作成後に作成する

-- 参照整合性チェック用の関数
create or replace function ff_users.check_focus_session_exists(p_session_id uuid)
returns boolean as $$
begin
    return exists (
        select 1
        from ff_focus.focus_sessions
        where id = p_session_id
    );
end;
$$ language plpgsql;

-- ユーザーアカウント状態テーブル
create table if not exists ff_users.account_statuses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    status text not null check (status in ('active', 'inactive', 'pending', 'suspended')) default 'pending',
    reason text,
    changed_by uuid references auth.users(id),
    changed_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ユーザー状態テーブル（プレゼンスとフォーカスを統合）
create table if not exists ff_users.user_statuses (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null unique,
    presence_status text not null check (presence_status in ('online', 'offline', 'idle')) default 'offline',
    focus_status text check (focus_status in ('focusing', 'breaking', 'meeting', 'available')) default 'available',
    focus_session_id uuid,
    focus_started_at timestamp with time zone,
    focus_expected_end_at timestamp with time zone,
    last_activity_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- 参照整合性チェック
    constraint check_focus_session_exists check (
        focus_session_id is null or 
        ff_users.check_focus_session_exists(focus_session_id)
    )
);

-- ステータス変更履歴テーブル
create table if not exists ff_users.status_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    status_type text not null check (status_type in ('account', 'presence', 'focus')),
    old_status text,
    new_status text,
    changed_by uuid references auth.users(id),
    changed_at timestamp with time zone default now(),
    created_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_users.account_statuses is 'ユーザーアカウントの状態を管理するテーブル';
comment on table ff_users.user_statuses is 'ユーザーのプレゼンスとフォーカス状態を管理するテーブル';
comment on table ff_users.status_history is 'ユーザーステータスの変更履歴を管理するテーブル';

-- カラムコメント：account_statuses
comment on column ff_users.account_statuses.status is 'アカウントの状態';
comment on column ff_users.account_statuses.reason is '状態変更の理由';
comment on column ff_users.account_statuses.changed_by is '状態を変更したユーザーのID';

-- カラムコメント：user_statuses
comment on column ff_users.user_statuses.presence_status is 'オンラインプレゼンス状態';
comment on column ff_users.user_statuses.focus_status is 'フォーカス状態';
comment on column ff_users.user_statuses.focus_session_id is '関連するフォーカスセッションのID';
comment on column ff_users.user_statuses.focus_started_at is 'フォーカス開始時刻';
comment on column ff_users.user_statuses.focus_expected_end_at is 'フォーカス予定終了時刻';
comment on column ff_users.user_statuses.last_activity_at is '最終アクティビティ日時';

-- インデックス
create index if not exists idx_account_statuses_user_id on ff_users.account_statuses(user_id);
create index if not exists idx_account_statuses_status on ff_users.account_statuses(status);
create index if not exists idx_user_statuses_user_id on ff_users.user_statuses(user_id);
create index if not exists idx_user_statuses_presence on ff_users.user_statuses(presence_status);
create index if not exists idx_user_statuses_focus on ff_users.user_statuses(focus_status);
create index if not exists idx_status_history_user_id on ff_users.status_history(user_id);
create index if not exists idx_status_history_changed_at on ff_users.status_history(changed_at);

-- ステータス変更履歴を記録するトリガー関数
create or replace function ff_users.log_status_change()
returns trigger as $$
begin
    if (tg_op = 'UPDATE') then
        -- アカウント状態の変更
        if tg_table_name = 'account_statuses' and old.status != new.status then
            insert into ff_users.status_history (
                user_id, status_type, old_status, new_status, changed_by
            ) values (
                new.user_id, 'account', old.status, new.status, auth.uid()
            );
        -- プレゼンス状態の変更
        elsif tg_table_name = 'user_statuses' and old.presence_status != new.presence_status then
            insert into ff_users.status_history (
                user_id, status_type, old_status, new_status, changed_by
            ) values (
                new.user_id, 'presence', old.presence_status, new.presence_status, auth.uid()
            );
        -- フォーカス状態の変更
        elsif tg_table_name = 'user_statuses' and old.focus_status != new.focus_status then
            insert into ff_users.status_history (
                user_id, status_type, old_status, new_status, changed_by
            ) values (
                new.user_id, 'focus', old.focus_status, new.focus_status, auth.uid()
            );
        end if;
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- トリガーの設定
create trigger log_account_status_change
    after update on ff_users.account_statuses
    for each row
    execute function ff_users.log_status_change();

create trigger log_user_status_change
    after update on ff_users.user_statuses
    for each row
    execute function ff_users.log_status_change();

-- 更新日時の自動更新トリガー
create trigger update_account_statuses_updated_at
    before update on ff_users.account_statuses
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_user_statuses_updated_at
    before update on ff_users.user_statuses
    for each row
    execute function ff_users.update_updated_at_column(); 