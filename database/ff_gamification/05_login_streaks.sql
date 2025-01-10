-- ログインストリーク管理テーブル
create table if not exists ff_gamification.login_streaks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid references auth.users(id) not null,
    current_streak integer not null default 1,
    longest_streak integer not null default 1,
    monthly_login_count integer not null default 1,
    last_login_date date not null default current_date,
    current_month integer not null default extract(month from current_date),
    current_year integer not null default extract(year from current_date),
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(user_id)
);

-- インデックスの作成
create index if not exists idx_login_streaks_user_id on ff_gamification.login_streaks(user_id);
create index if not exists idx_login_streaks_last_login on ff_gamification.login_streaks(last_login_date);

-- RLSの設定
alter table ff_gamification.login_streaks enable row level security;

-- 既存のポリシーを削除
drop policy if exists "Users can view their own login streaks" on ff_gamification.login_streaks;
drop policy if exists "Service role can manage all login streaks" on ff_gamification.login_streaks;

-- ポリシーを作成
create policy "Users can view their own login streaks"
    on ff_gamification.login_streaks for select
    using (auth.uid() = user_id);

create policy "Service role can manage all login streaks"
    on ff_gamification.login_streaks for all
    using (auth.role() = 'service_role');

-- ログインストリークを更新する関数
CREATE OR REPLACE FUNCTION ff_gamification.update_login_streak(target_user_id uuid)
RETURNS ff_gamification.login_streaks AS $$
DECLARE
    streak_record ff_gamification.login_streaks;
    current_month integer := extract(month from current_date);
    current_year integer := extract(year from current_date);
BEGIN
    -- 既存のストリーク情報を取得
    SELECT * INTO streak_record
    FROM ff_gamification.login_streaks
    WHERE user_id = target_user_id;

    -- 統計データを作成・更新（常に実行）
    PERFORM ff_users.create_or_update_statistics(target_user_id);

    -- 同じ日のログインの場合は更新しない
    IF streak_record IS NOT NULL AND streak_record.last_login_date = current_date THEN
        RETURN streak_record;
    END IF;

    -- ストリーク情報を取得または作成
    INSERT INTO ff_gamification.login_streaks (
        user_id,
        current_streak,
        longest_streak,
        monthly_login_count,
        last_login_date,
        current_month,
        current_year
    ) VALUES (
        target_user_id,
        1,
        1,
        1,
        current_date,
        current_month,
        current_year
    )
    ON CONFLICT (user_id) DO UPDATE SET
        current_streak = CASE
            WHEN ff_gamification.login_streaks.last_login_date = current_date - interval '1 day'
            THEN ff_gamification.login_streaks.current_streak + 1
            WHEN ff_gamification.login_streaks.last_login_date != current_date
            THEN 1
            ELSE ff_gamification.login_streaks.current_streak
        END,
        longest_streak = greatest(
            ff_gamification.login_streaks.longest_streak,
            CASE
                WHEN ff_gamification.login_streaks.last_login_date = current_date - interval '1 day'
                THEN ff_gamification.login_streaks.current_streak + 1
                WHEN ff_gamification.login_streaks.last_login_date != current_date
                THEN 1
                ELSE ff_gamification.login_streaks.current_streak
            END
        ),
        monthly_login_count = CASE
            WHEN ff_gamification.login_streaks.current_month = extract(month from current_date)
                AND ff_gamification.login_streaks.current_year = extract(year from current_date)
                AND ff_gamification.login_streaks.last_login_date != current_date
            THEN ff_gamification.login_streaks.monthly_login_count + 1
            WHEN ff_gamification.login_streaks.current_month != extract(month from current_date)
                OR ff_gamification.login_streaks.current_year != extract(year from current_date)
            THEN 1
            ELSE ff_gamification.login_streaks.monthly_login_count
        END,
        last_login_date = current_date,
        current_month = extract(month from current_date),
        current_year = extract(year from current_date),
        updated_at = now()
    WHERE ff_gamification.login_streaks.user_id = target_user_id
    RETURNING * INTO streak_record;

    RETURN streak_record;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 月末に月間ログインボーナスのバッジを付与する関数
create or replace function ff_gamification.award_monthly_login_badges()
returns void as $$
declare
    user_record record;
    badge_name text;
    previous_month integer := extract(month from (current_date - interval '1 month'));
    previous_year integer := extract(year from (current_date - interval '1 month'));
    previous_month_days integer;
    badge_prefix text;
begin
    -- 前月の日数を取得
    previous_month_days := extract(days from (
        date_trunc('month', current_date - interval '1 month')
        + interval '1 month'
        - interval '1 day'
    )::date);

    -- バッジ名のプレフィックスを作成（例：2025年1月）
    badge_prefix := previous_year || '年' || previous_month || '月';

    -- 前月の月次統計を持つすべてのユーザーに対して処理
    for user_record in
        select user_id, login_count
        from ff_users.monthly_statistics
        where year = previous_year
          and month = previous_month
    loop
        -- 既存の月間ログインバッジを削除
        delete from ff_gamification.user_badges
        where user_id = user_record.user_id
          and badge_id in (
              select id
              from ff_gamification.badges
              where name like badge_prefix || '%'
          );

        -- ログイン回数に応じて最高レベルのバッジを付与
        if user_record.login_count = previous_month_days then
            badge_name := badge_prefix || ' コンプリート！';
        elsif user_record.login_count >= 21 then
            badge_name := badge_prefix || ' トリプルセブン';
        elsif user_record.login_count >= 14 then
            badge_name := badge_prefix || ' ダブルセブン';
        elsif user_record.login_count >= 7 then
            badge_name := badge_prefix || ' シングルセブン';
        elsif user_record.login_count >= 1 then
            badge_name := badge_prefix || ' 行動開始！';
        end if;

        -- バッジを付与
        if badge_name is not null then
            perform ff_gamification.award_badge(user_record.user_id, badge_name);
        end if;
    end loop;
end;
$$ language plpgsql security definer;

-- 月初めに月間ログインボーナスのバッジを付与するトリガー関数
create or replace function ff_gamification.tr_award_monthly_login_badges()
returns trigger as $$
begin
    -- 月が変わった時のみバッジを付与
    if extract(day from current_date) = 1 then
        perform ff_gamification.award_monthly_login_badges();
    end if;
    return new;
end;
$$ language plpgsql security definer;

-- 既存のトリガーを削除
drop trigger if exists award_monthly_login_badges_trigger on ff_users.monthly_statistics;

-- 月間ログインボーナスのバッジ付与トリガーを作成
create trigger award_monthly_login_badges_trigger
    after insert or update on ff_users.monthly_statistics
    for each statement
    execute function ff_gamification.tr_award_monthly_login_badges();

-- バッジを付与する関数
create or replace function ff_gamification.award_badge(
    target_user_id uuid,
    badge_name text
) returns ff_gamification.user_badges as $$
declare
    badge_record ff_gamification.badges;
    user_badge_record ff_gamification.user_badges;
begin
    -- バッジ情報を取得
    select * into badge_record
    from ff_gamification.badges
    where name = badge_name;

    -- バッジが存在しない場合はnullを返す
    if badge_record is null then
        return null;
    end if;

    -- バッジを付与
    insert into ff_gamification.user_badges (
        user_id,
        badge_id,
        acquired_at
    ) values (
        target_user_id,
        badge_record.id,
        now()
    )
    on conflict (user_id, badge_id) do nothing
    returning * into user_badge_record;

    return user_badge_record;
end;
$$ language plpgsql security definer;

-- ログインストリーク更新トリガー
create or replace function ff_gamification.tr_update_login_streak()
returns trigger as $$
begin
    perform ff_gamification.update_login_streak(new.id);
    return new;
end;
$$ language plpgsql security definer;

-- 既存のトリガーを削除
drop trigger if exists update_login_streak_on_sign_in on auth.users;

-- ユーザーのログイン時にトリガーを実行
create trigger update_login_streak_on_sign_in
    after update of last_sign_in_at on auth.users
    for each row
    execute function ff_gamification.tr_update_login_streak(); 