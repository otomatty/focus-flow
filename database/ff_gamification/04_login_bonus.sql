-- ログインボーナスの履歴を管理するテーブル
create table if not exists ff_gamification.login_bonus_history (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    bonus_exp integer not null,
    login_streak integer not null default 1, -- 連続ログイン日数
    awarded_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ユーザーの最終アクティビティを記録するテーブル
create table if not exists ff_gamification.user_activities (
    user_id uuid references auth.users(id) primary key,
    last_activity_at timestamp with time zone default now(),
    last_bonus_date date default current_date,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- インデックスの作成
create index if not exists idx_login_bonus_history_user_id on ff_gamification.login_bonus_history(user_id);
create index if not exists idx_login_bonus_history_awarded_at on ff_gamification.login_bonus_history(awarded_at);

-- RLSの設定
alter table ff_gamification.login_bonus_history enable row level security;
alter table ff_gamification.user_activities enable row level security;

-- 既存のポリシーを削除
drop policy if exists "Users can view their own login bonus history" on ff_gamification.login_bonus_history;
drop policy if exists "Service role can manage all login bonus history" on ff_gamification.login_bonus_history;
drop policy if exists "Users can view their own activity" on ff_gamification.user_activities;
drop policy if exists "Service role can manage all activities" on ff_gamification.user_activities;

-- ポリシーの作成
create policy "Users can view their own login bonus history"
    on ff_gamification.login_bonus_history for select
    using (auth.uid() = user_id);

create policy "Service role can manage all login bonus history"
    on ff_gamification.login_bonus_history for all
    using (auth.role() = 'service_role');

create policy "Users can view their own activity"
    on ff_gamification.user_activities for select
    using (auth.uid() = user_id);

create policy "Service role can manage all activities"
    on ff_gamification.user_activities for all
    using (auth.role() = 'service_role');

-- アクティビティ更新時にログインボーナスをチェックする関数
create or replace function ff_gamification.check_and_award_login_bonus(target_user_id uuid)
returns ff_gamification.login_bonus_history as $$
declare
    user_activity ff_gamification.user_activities;
    current_date_value date := current_date;
    bonus_record ff_gamification.login_bonus_history;
begin
    -- ユーザーのアクティビティ記録を取得または作成
    insert into ff_gamification.user_activities (user_id)
    values (target_user_id)
    on conflict (user_id) do update
    set last_activity_at = now(),
        updated_at = now()
    returning * into user_activity;

    -- 最終ボーナス日が今日より前の場合のみボーナスを付与
    if user_activity.last_bonus_date < current_date_value then
        -- ボーナスを付与
        bonus_record := ff_gamification.award_login_bonus(target_user_id);
        
        -- 最終ボーナス日を更新
        update ff_gamification.user_activities
        set last_bonus_date = current_date_value
        where user_id = target_user_id;

        return bonus_record;
    end if;

    return null;
end;
$$ language plpgsql security definer;

-- ログインボーナスを付与する関数
create or replace function ff_gamification.award_login_bonus(target_user_id uuid)
returns ff_gamification.login_bonus_history as $$
declare
    bonus_record ff_gamification.login_bonus_history;
    last_login timestamp with time zone;
    last_streak integer;
    current_streak integer;
    base_bonus_exp integer := 50; -- 基本ログインボーナス
    bonus_multiplier float;
    final_bonus_exp integer;
begin
    -- 最後のログインボーナス付与時刻と連続ログイン日数を取得
    select awarded_at, login_streak into last_login, last_streak
    from ff_gamification.login_bonus_history
    where user_id = target_user_id
    order by awarded_at desc
    limit 1;

    -- 連続ログイン日数の計算
    if last_login is null then
        current_streak := 1; -- 初回ログイン
    elsif date_trunc('day', last_login) = date_trunc('day', now() - interval '1 day') then
        current_streak := last_streak + 1; -- 連続ログイン
    else
        current_streak := 1; -- 連続ログインが途切れた
    end if;

    -- 連続ログインボーナスの計算（7日目で最大）
    bonus_multiplier := case
        when current_streak >= 7 then 2.5
        else 1.0 + ((current_streak - 1) * 0.2)
    end;

    final_bonus_exp := (base_bonus_exp * bonus_multiplier)::integer;

    -- ログインボーナスの記録を作成
    insert into ff_gamification.login_bonus_history (
        user_id,
        bonus_exp,
        login_streak,
        awarded_at
    ) values (
        target_user_id,
        final_bonus_exp,
        current_streak,
        now()
    ) returning * into bonus_record;

    -- 経験値を付与
    update ff_gamification.user_levels
    set current_exp = current_exp + final_bonus_exp,
        total_exp = total_exp + final_bonus_exp,
        updated_at = now()
    where user_id = target_user_id;

    -- システムログに記録
    insert into ff_logs.system_logs (
        event_type,
        event_source,
        event_data,
        severity
    ) values (
        'LOGIN_BONUS_AWARDED',
        'award_login_bonus',
        jsonb_build_object(
            'user_id', target_user_id,
            'bonus_exp', final_bonus_exp,
            'login_streak', current_streak,
            'bonus_multiplier', bonus_multiplier
        ),
        'INFO'
    );

    return bonus_record;
exception when others then
    -- エラーをログに記録
    insert into ff_logs.system_logs (
        event_type,
        event_source,
        event_data,
        severity
    ) values (
        'ERROR_AWARDING_LOGIN_BONUS',
        'award_login_bonus',
        jsonb_build_object(
            'user_id', target_user_id,
            'error_code', SQLSTATE,
            'error_message', SQLERRM
        ),
        'ERROR'
    );
    raise;
end;
$$ language plpgsql security definer;

-- ログインボーナスを付与するトリガー関数
create or replace function ff_gamification.tr_award_login_bonus()
returns trigger as $$
begin
    perform ff_gamification.award_login_bonus(new.id);
    return new;
end;
$$ language plpgsql security definer;

-- 既存のトリガーを削除
drop trigger if exists award_login_bonus_on_sign_in on auth.users;

-- ユーザーのアクティビティ更新時にトリガーを実行
create or replace function ff_gamification.tr_check_login_bonus()
returns trigger as $$
begin
    perform ff_gamification.check_and_award_login_bonus(new.id);
    return new;
end;
$$ language plpgsql security definer;

-- アクティビティ更新時のトリガーを作成
create trigger check_login_bonus_on_activity
    after insert or update of last_activity_at on ff_gamification.user_activities
    for each row
    execute function ff_gamification.tr_check_login_bonus(); 