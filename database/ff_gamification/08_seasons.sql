create table if not exists ff_gamification.seasons (
    id uuid primary key default uuid_generate_v4(),
    season_number integer not null unique,
    name text not null,
    description text,
    start_date timestamp with time zone not null,
    end_date timestamp with time zone not null,
    transition_start_date timestamp with time zone,
    transition_end_date timestamp with time zone,
    default_duration interval not null default '90 days'::interval,
    status text not null default 'upcoming',
    rules jsonb default '{
        "point_multipliers": {
            "focus_session": 1,
            "task_completion": 1,
            "streak_bonus": 1.2
        }
    }'::jsonb,
    rewards jsonb default '{
        "badges": []
    }'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (status in ('upcoming', 'transition', 'active', 'completed')),
    check (start_date < end_date),
    check (transition_start_date is null or transition_start_date >= end_date),
    check (transition_end_date is null or (transition_start_date is not null and transition_end_date > transition_start_date))
);

create table if not exists ff_gamification.user_progress (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    season_id uuid references ff_gamification.seasons(id) not null,
    current_rank text not null default 'bronze',
    highest_rank text not null default 'bronze',
    current_points integer not null default 0,
    total_focus_time interval not null default '0'::interval,
    completed_tasks integer not null default 0,
    achievements jsonb default '[]'::jsonb,
    rewards_claimed boolean default false,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (user_id, season_id),
    check (current_rank in ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
    check (highest_rank in ('bronze', 'silver', 'gold', 'platinum', 'diamond'))
);

-- ユーザーシーズン履歴テーブル
create table if not exists ff_gamification.user_history (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    season_id uuid references ff_gamification.seasons(id) not null,
    final_rank text not null,
    total_points integer not null default 0,
    total_focus_time interval not null default '0'::interval,
    total_completed_tasks integer not null default 0,
    achievements_earned jsonb default '[]'::jsonb,
    rewards_received jsonb default '[]'::jsonb,
    statistics jsonb default '{
        "daily_averages": {
            "focus_time": "0",
            "completed_tasks": 0
        },
        "best_streak": 0,
        "rank_progression": []
    }'::jsonb,
    archived_at timestamp with time zone default now(),
    created_at timestamp with time zone default now(),
    unique (user_id, season_id),
    check (final_rank in ('bronze', 'silver', 'gold', 'platinum', 'diamond'))
);

-- シーズン監査ログテーブル
create table if not exists ff_gamification.audit_logs (
    id uuid primary key default uuid_generate_v4(),
    season_id uuid references ff_gamification.seasons(id) not null,
    user_id uuid references auth.users(id),      -- 関連するユーザー（該当する場合）
    action_type text not null,                   -- status_change, rank_update, reward_distribution など
    action_details jsonb not null,
    performed_by uuid references auth.users(id),  -- システムの場合はnull
    created_at timestamp with time zone default now()
);

-- シーズンランク設定テーブル
create table if not exists ff_gamification.rank_settings (
    id uuid primary key default uuid_generate_v4(),
    season_id uuid references ff_gamification.seasons(id) not null,
    rank_name text not null,
    required_points integer not null,
    focus_time_requirement interval,
    task_completion_requirement integer,
    daily_focus_requirement interval,
    weekly_focus_requirement interval,
    maintenance_requirements jsonb,
    demotion_threshold integer,
    promotion_threshold integer,
    rewards jsonb not null default '{
        "badges": [],
        "bonus_multiplier": 1.0,
        "special_features": []
    }'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique (season_id, rank_name),
    check (rank_name in ('bronze', 'silver', 'gold', 'platinum', 'diamond', 'master', 'grandmaster')),
    check (required_points >= 0),
    check (demotion_threshold <= required_points),
    check (promotion_threshold >= required_points)
);

-- テーブルコメント
comment on table ff_gamification.seasons is 'シーズンの基本情報を管理するテーブル';
comment on table ff_gamification.user_progress is 'ユーザーごとのシーズン進捗を管理するテーブル';
comment on table ff_gamification.user_history is 'ユーザーごとのシーズン履歴を保存するテーブル';
comment on table ff_gamification.audit_logs is 'シーズン関連の操作履歴を記録するテーブル';
comment on table ff_gamification.rank_settings is 'シーズンごとのランク設定を管理するテーブル';
comment on column ff_gamification.rank_settings.required_points is 'ランクに必要な最小ポイント';
comment on column ff_gamification.rank_settings.focus_time_requirement is '累計の必要集中時間';
comment on column ff_gamification.rank_settings.task_completion_requirement is '累計の必要タスク完了数';
comment on column ff_gamification.rank_settings.daily_focus_requirement is '1日あたりの必要集中時間';
comment on column ff_gamification.rank_settings.weekly_focus_requirement is '週あたりの必要集中時間';
comment on column ff_gamification.rank_settings.maintenance_requirements is 'ランク維持に必要な要件（JSON形式）';
comment on column ff_gamification.rank_settings.demotion_threshold is 'このポイント以下になると降格';
comment on column ff_gamification.rank_settings.promotion_threshold is 'このポイント以上で昇格可能';
comment on column ff_gamification.rank_settings.rewards is 'ランク報酬設定（JSON形式）';

-- インデックス
create index if not exists idx_seasons_status on ff_gamification.seasons(status);
create index if not exists idx_user_progress_user_season on ff_gamification.user_progress(user_id, season_id);
create index if not exists idx_user_history_user_season on ff_gamification.user_history(user_id, season_id);
create index if not exists idx_audit_logs_season on ff_gamification.audit_logs(season_id);
create index if not exists idx_audit_logs_user on ff_gamification.audit_logs(user_id);
create index if not exists idx_audit_logs_created_at on ff_gamification.audit_logs(created_at);
create index if not exists idx_rank_settings_season on ff_gamification.rank_settings(season_id);

-- ユーザーがシーズンに初めてアクセスした時に進捗データを自動作成する関数
CREATE OR REPLACE FUNCTION ff_gamification.initialize_user_season_progress(
    p_user_id UUID,
    p_season_id UUID
)
RETURNS ff_gamification.user_progress AS $$
DECLARE
    v_progress ff_gamification.user_progress;
BEGIN
    -- 既存の進捗データをチェック
    SELECT * INTO v_progress
    FROM ff_gamification.user_progress
    WHERE user_id = p_user_id AND season_id = p_season_id;

    -- 存在しない場合は新規作成
    IF NOT FOUND THEN
        INSERT INTO ff_gamification.user_progress (
            user_id,
            season_id,
            current_rank,
            highest_rank,
            current_points,
            total_focus_time,
            completed_tasks,
            achievements,
            rewards_claimed
        ) VALUES (
            p_user_id,
            p_season_id,
            'bronze',
            'bronze',
            0,
            '0'::interval,
            0,
            '[]'::jsonb,
            false
        ) RETURNING * INTO v_progress;
    END IF;

    RETURN v_progress;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPCとして公開
GRANT EXECUTE ON FUNCTION ff_gamification.initialize_user_season_progress(UUID, UUID) TO authenticated;

-- 更新日時自動更新のトリガー関数
create or replace function ff_gamification.update_updated_at_column()
returns trigger as $$
begin
    new.updated_at = now();
    return new;
end;
$$ language plpgsql;

-- 更新日時自動更新のトリガー
create trigger update_seasons_updated_at
    before update on ff_gamification.seasons
    for each row
    execute function ff_gamification.update_updated_at_column();

create trigger update_user_progress_updated_at
    before update on ff_gamification.user_progress
    for each row
    execute function ff_gamification.update_updated_at_column();

-- シーズン終了時のユーザー履歴保存関数
create or replace function ff_gamification.archive_user_season_history(
    p_season_id uuid,
    p_user_id uuid
)
returns void as $$
declare
    v_progress record;
begin
    -- ユーザーの進捗データを取得
    select * into v_progress
    from ff_gamification.user_progress
    where season_id = p_season_id and user_id = p_user_id;
    
    if not found then
        return;
    end if;
    
    -- 履歴データを保存
    insert into ff_gamification.user_history (
        user_id,
        season_id,
        final_rank,
        total_points,
        total_focus_time,
        total_completed_tasks,
        achievements_earned,
        rewards_received,
        statistics
    )
    values (
        p_user_id,
        p_season_id,
        v_progress.highest_rank,
        v_progress.current_points,
        v_progress.total_focus_time,
        v_progress.completed_tasks,
        v_progress.achievements,
        case when v_progress.rewards_claimed then
            (select rewards from ff_gamification.seasons where id = p_season_id)
        else '[]'::jsonb end,
        jsonb_build_object(
            'daily_averages', jsonb_build_object(
                'focus_time', extract(epoch from v_progress.total_focus_time) / 
                    extract(days from (select end_date - start_date from ff_gamification.seasons where id = p_season_id)),
                'completed_tasks', v_progress.completed_tasks::float / 
                    extract(days from (select end_date - start_date from ff_gamification.seasons where id = p_season_id))
            ),
            'rank_progression', '[]'::jsonb
        )
    );
    
    -- 監査ログに記録
    perform ff_gamification.log_action(
        p_season_id,
        p_user_id,
        'history_archived',
        jsonb_build_object(
            'final_rank', v_progress.highest_rank,
            'total_points', v_progress.current_points
        ),
        null
    );
end;
$$ language plpgsql;

-- 監査ログ記録関数
create or replace function ff_gamification.log_action(
    p_season_id uuid,
    p_user_id uuid,
    p_action_type text,
    p_action_details jsonb,
    p_performed_by uuid default null
)
returns void as $$
begin
    insert into ff_seasons.audit_logs (
        season_id,
        user_id,
        action_type,
        action_details,
        performed_by
    )
    values (
        p_season_id,
        p_user_id,
        p_action_type,
        p_action_details,
        p_performed_by
    );
end;
$$ language plpgsql;

-- シーズンステータス更新時のトリガー関数
create or replace function ff_gamification.on_season_status_change()
returns trigger as $$
begin
    if NEW.status != OLD.status then
        perform ff_gamification.log_action(
            NEW.id,
            null,
            'status_change',
            jsonb_build_object(
                'old_status', OLD.status,
                'new_status', NEW.status
            ),
            null
        );
    end if;
    return NEW;
end;
$$ language plpgsql;

-- シーズンステータス更新トリガー
create trigger season_status_change_trigger
    after update of status on ff_gamification.seasons
    for each row
    execute function ff_gamification.on_season_status_change();

-- ユーザー進捗更新時のトリガー関数
create or replace function ff_gamification.on_user_progress_change()
returns trigger as $$
begin
    if NEW.current_rank != OLD.current_rank then
        perform ff_gamification.log_action(
            NEW.season_id,
            NEW.user_id,
            'rank_change',
            jsonb_build_object(
                'old_rank', OLD.current_rank,
                'new_rank', NEW.current_rank,
                'points', NEW.current_points
            ),
            null
        );
    end if;
    return NEW;
end;
$$ language plpgsql;

-- ユーザー進捗更新トリガー
create trigger user_progress_change_trigger
    after update of current_rank on ff_gamification.user_progress
    for each row
    execute function ff_gamification.on_user_progress_change();

-- デフォルトのランク設定を挿入する関数
create or replace function ff_gamification.create_default_rank_settings(p_season_id uuid)
returns void as $$
begin
    -- Bronze
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'bronze', 0,
        '0'::interval, 0,
        '1 hour'::interval, '5 hours'::interval,
        0, 100,
        '{
            "badges": ["bronze_member"],
            "bonus_multiplier": 1.0,
            "special_features": []
        }'::jsonb
    );

    -- Silver
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'silver', 100,
        '20 hours'::interval, 50,
        '2 hours'::interval, '10 hours'::interval,
        80, 300,
        '{
            "badges": ["silver_member"],
            "bonus_multiplier": 1.2,
            "special_features": ["custom_themes"]
        }'::jsonb
    );

    -- Gold
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'gold', 300,
        '50 hours'::interval, 100,
        '3 hours'::interval, '15 hours'::interval,
        250, 600,
        '{
            "badges": ["gold_member"],
            "bonus_multiplier": 1.5,
            "special_features": ["custom_themes", "advanced_analytics"]
        }'::jsonb
    );

    -- Platinum
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'platinum', 600,
        '100 hours'::interval, 200,
        '4 hours'::interval, '20 hours'::interval,
        500, 1000,
        '{
            "badges": ["platinum_member"],
            "bonus_multiplier": 2.0,
            "special_features": ["custom_themes", "advanced_analytics", "priority_support"]
        }'::jsonb
    );

    -- Diamond
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'diamond', 1000,
        '200 hours'::interval, 400,
        '5 hours'::interval, '25 hours'::interval,
        800, null,
        '{
            "badges": ["diamond_member"],
            "bonus_multiplier": 3.0,
            "special_features": ["custom_themes", "advanced_analytics", "priority_support", "exclusive_features"]
        }'::jsonb
    );

    -- Master
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'master', 2000,
        '400 hours'::interval, 800,
        '6 hours'::interval, '30 hours'::interval,
        1800, 3500,
        '{
            "badges": ["master_focus", "master_achievement"],
            "bonus_multiplier": 4.0,
            "special_features": [
                "custom_themes",
                "advanced_analytics",
                "priority_support",
                "exclusive_features",
                "mentor_status",
                "custom_badges"
            ]
        }'::jsonb
    );

    -- Grandmaster
    insert into ff_gamification.rank_settings (
        season_id, rank_name, required_points,
        focus_time_requirement, task_completion_requirement,
        daily_focus_requirement, weekly_focus_requirement,
        demotion_threshold, promotion_threshold,
        rewards
    ) values (
        p_season_id, 'grandmaster', 3500,
        '800 hours'::interval, 1600,
        '8 hours'::interval, '40 hours'::interval,
        3000, null,
        '{
            "badges": [
                "grandmaster_focus",
                "grandmaster_achievement",
                "legendary_status"
            ],
            "bonus_multiplier": 5.0,
            "special_features": [
                "custom_themes",
                "advanced_analytics",
                "priority_support",
                "exclusive_features",
                "mentor_status",
                "custom_badges",
                "season_hall_of_fame",
                "custom_profile_effects"
            ]
        }'::jsonb
    );
end;
$$ language plpgsql;

-- シーズン作成時にデフォルトのランク設定を自動作成するトリガー
create or replace function ff_gamification.on_season_created()
returns trigger as $$
begin
    perform ff_gamification.create_default_rank_settings(NEW.id);
    return NEW;
end;
$$ language plpgsql;

create trigger season_created_trigger
    after insert on ff_gamification.seasons
    for each row
    execute function ff_gamification.on_season_created(); 