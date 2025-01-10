-- -- 既存のトリガーを削除
-- DROP TRIGGER IF EXISTS initialize_user_statistics_on_profile_creation ON auth.users;
-- DROP TRIGGER IF EXISTS create_daily_statistics_partition_trigger ON ff_users.daily_statistics CASCADE;

-- -- 既存の関数を削除
-- DROP FUNCTION IF EXISTS ff_users.tr_initialize_user_statistics() CASCADE;
-- DROP FUNCTION IF EXISTS ff_users.initialize_user_statistics(UUID) CASCADE;
-- DROP FUNCTION IF EXISTS ff_users.update_focus_statistics(UUID, INTERVAL, DATE) CASCADE;
-- DROP FUNCTION IF EXISTS ff_users.update_task_statistics(UUID, DATE) CASCADE;
-- DROP FUNCTION IF EXISTS ff_users.create_daily_statistics_partition() CASCADE;

-- -- 既存のテーブルを削除
-- DROP TABLE IF EXISTS ff_users.monthly_statistics CASCADE;
-- DROP TABLE IF EXISTS ff_users.weekly_statistics CASCADE;
-- DROP TABLE IF EXISTS ff_users.daily_statistics CASCADE;
-- DROP TABLE IF EXISTS ff_users.user_statistics CASCADE;

-- ユーザー統計情報のメインテーブル
CREATE TABLE ff_users.user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    -- フォーカスセッション統計
    total_focus_sessions INTEGER NOT NULL DEFAULT 0,
    total_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    avg_session_length INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    daily_focus_sessions INTEGER NOT NULL DEFAULT 0,
    daily_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    weekly_focus_sessions INTEGER NOT NULL DEFAULT 0,
    weekly_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    monthly_focus_sessions INTEGER NOT NULL DEFAULT 0,
    monthly_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    -- タスク統計
    total_tasks INTEGER NOT NULL DEFAULT 0,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    daily_completed_tasks INTEGER NOT NULL DEFAULT 0,
    weekly_completed_tasks INTEGER NOT NULL DEFAULT 0,
    monthly_completed_tasks INTEGER NOT NULL DEFAULT 0,
    task_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    -- 習慣統計
    total_habits INTEGER NOT NULL DEFAULT 0,
    active_habits INTEGER NOT NULL DEFAULT 0,
    completed_habits INTEGER NOT NULL DEFAULT 0,
    daily_habit_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    weekly_habit_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    monthly_habit_completion_rate DECIMAL(5,2) NOT NULL DEFAULT 0,
    -- 最終記録日
    last_login_date DATE,
    last_focus_date DATE,
    last_task_date DATE,
    last_habit_date DATE,
    -- メタデータ
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE(user_id),
    CONSTRAINT positive_counts CHECK (
        total_focus_sessions >= 0 AND
        total_tasks >= 0 AND
        completed_tasks >= 0 AND
        total_habits >= 0 AND
        active_habits >= 0 AND
        completed_habits >= 0
    ),
    CONSTRAINT positive_times CHECK (
        total_focus_time >= '0'::INTERVAL AND
        avg_session_length >= '0'::INTERVAL AND
        daily_focus_time >= '0'::INTERVAL AND
        weekly_focus_time >= '0'::INTERVAL AND
        monthly_focus_time >= '0'::INTERVAL
    ),
    CONSTRAINT valid_rates CHECK (
        task_completion_rate BETWEEN 0 AND 100 AND
        daily_habit_completion_rate BETWEEN 0 AND 100 AND
        weekly_habit_completion_rate BETWEEN 0 AND 100 AND
        monthly_habit_completion_rate BETWEEN 0 AND 100
    )
);

-- 日次統計履歴テーブル
CREATE TABLE ff_users.daily_statistics (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    focus_sessions INTEGER NOT NULL DEFAULT 0,
    focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    completed_habits INTEGER NOT NULL DEFAULT 0,
    avg_session_length INTERVAL,
    task_completion_rate DECIMAL(5,2),
    habit_completion_rate DECIMAL(5,2),
    login_count INTEGER NOT NULL DEFAULT 0,
    experience_points INTEGER NOT NULL DEFAULT 0,
    badges_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, date)
) PARTITION BY RANGE (date);

-- 週次統計履歴テーブル
CREATE TABLE ff_users.weekly_statistics (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    week INTEGER NOT NULL,
    focus_sessions INTEGER NOT NULL DEFAULT 0,
    focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    completed_habits INTEGER NOT NULL DEFAULT 0,
    avg_session_length INTERVAL,
    task_completion_rate DECIMAL(5,2),
    habit_completion_rate DECIMAL(5,2),
    login_count INTEGER NOT NULL DEFAULT 0,
    experience_points INTEGER NOT NULL DEFAULT 0,
    badges_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, year, week),
    CONSTRAINT valid_week CHECK (week BETWEEN 1 AND 53)
) PARTITION BY RANGE (year, week);

-- 月次統計履歴テーブル
CREATE TABLE ff_users.monthly_statistics (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    year INTEGER NOT NULL,
    month INTEGER NOT NULL,
    focus_sessions INTEGER NOT NULL DEFAULT 0,
    focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    completed_habits INTEGER NOT NULL DEFAULT 0,
    avg_session_length INTERVAL,
    task_completion_rate DECIMAL(5,2),
    habit_completion_rate DECIMAL(5,2),
    login_count INTEGER NOT NULL DEFAULT 0,
    experience_points INTEGER NOT NULL DEFAULT 0,
    badges_earned INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (user_id, year, month),
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12)
);

-- パーティション作成関数
CREATE OR REPLACE FUNCTION ff_users.create_daily_statistics_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_date DATE;
    partition_name TEXT;
    start_date DATE;
    end_date DATE;
BEGIN
    partition_date := NEW.date;
    partition_name := 'daily_statistics_' || to_char(partition_date, 'YYYY_MM');
    start_date := date_trunc('month', partition_date)::DATE;
    end_date := (date_trunc('month', partition_date) + interval '1 month')::DATE;

    -- パーティションが存在しない場合は作成
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = partition_name
        AND n.nspname = 'ff_users'
    ) THEN
        EXECUTE format(
            'CREATE TABLE ff_users.%I PARTITION OF ff_users.daily_statistics
            FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            start_date,
            end_date
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- パーティション作成トリガー
CREATE TRIGGER create_daily_statistics_partition_trigger
    BEFORE INSERT ON ff_users.daily_statistics
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.create_daily_statistics_partition();

-- 現在の月のパーティションを作成
DO $$
DECLARE
    current_month DATE := date_trunc('month', current_date)::DATE;
    next_month DATE := (date_trunc('month', current_date) + interval '1 month')::DATE;
    partition_name TEXT := 'daily_statistics_' || to_char(current_date, 'YYYY_MM');
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = partition_name
        AND n.nspname = 'ff_users'
    ) THEN
        EXECUTE format(
            'CREATE TABLE ff_users.%I PARTITION OF ff_users.daily_statistics
            FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            current_month,
            next_month
        );
    END IF;
END $$;

-- ユーザー統計情報の初期化関数
CREATE OR REPLACE FUNCTION ff_users.initialize_user_statistics(target_user_id UUID)
RETURNS void AS $$
DECLARE
    current_year INTEGER := extract(year from current_date);
    current_month INTEGER := extract(month from current_date);
    current_week INTEGER := extract(isoyear from current_date);
    current_isoweek INTEGER := extract(week from current_date);
BEGIN
    -- ユーザー統計情報のメインレコードを作成
    INSERT INTO ff_users.user_statistics (user_id)
    VALUES (target_user_id)
    ON CONFLICT (user_id) DO NOTHING;

    -- 日次統計を作成
    INSERT INTO ff_users.daily_statistics (
        user_id,
        date,
        focus_sessions,
        focus_time,
        completed_tasks,
        completed_habits,
        login_count
    )
    VALUES (
        target_user_id,
        current_date,
        0,
        '0'::INTERVAL,
        0,
        0,
        0
    )
    ON CONFLICT (user_id, date) DO NOTHING;

    -- 週次統計を作成
    INSERT INTO ff_users.weekly_statistics (
        user_id,
        year,
        week,
        focus_sessions,
        focus_time,
        completed_tasks,
        completed_habits,
        login_count
    )
    VALUES (
        target_user_id,
        current_year,
        current_isoweek,
        0,
        '0'::INTERVAL,
        0,
        0,
        0
    )
    ON CONFLICT (user_id, year, week) DO NOTHING;

    -- 月次統計を作成
    INSERT INTO ff_users.monthly_statistics (
        user_id,
        year,
        month,
        focus_sessions,
        focus_time,
        completed_tasks,
        completed_habits,
        login_count
    )
    VALUES (
        target_user_id,
        current_year,
        current_month,
        0,
        '0'::INTERVAL,
        0,
        0,
        0
    )
    ON CONFLICT (user_id, year, month) DO NOTHING;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザー作成時に統計情報を初期化するトリガー
CREATE OR REPLACE FUNCTION ff_users.tr_initialize_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- ユーザー統計情報のメインレコードを作成
    INSERT INTO ff_users.user_statistics (user_id)
    VALUES (NEW.id)
    ON CONFLICT (user_id) DO NOTHING;

    -- 日次統計を作成
    INSERT INTO ff_users.daily_statistics (
        user_id,
        date,
        focus_sessions,
        focus_time,
        completed_tasks,
        completed_habits,
        login_count
    )
    VALUES (
        NEW.id,
        current_date,
        0,
        '0'::INTERVAL,
        0,
        0,
        0
    )
    ON CONFLICT (user_id, date) DO NOTHING;

    -- 週次統計を作成
    INSERT INTO ff_users.weekly_statistics (
        user_id,
        year,
        week,
        focus_sessions,
        focus_time,
        completed_tasks,
        completed_habits
    )
    VALUES (
        NEW.id,
        EXTRACT(YEAR FROM current_date),
        EXTRACT(WEEK FROM current_date),
        0,
        '0'::INTERVAL,
        0,
        0
    )
    ON CONFLICT (user_id, year, week) DO NOTHING;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ユーザー作成時のトリガーを設定
CREATE TRIGGER initialize_user_statistics_on_profile_creation
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.tr_initialize_user_statistics();

-- 週次統計パーティションを作成する関数
CREATE OR REPLACE FUNCTION ff_users.create_weekly_statistics_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_name TEXT;
    start_year INTEGER;
    start_week INTEGER;
    end_year INTEGER;
    end_week INTEGER;
BEGIN
    start_year := NEW.year;
    start_week := NEW.week;
    
    -- 年末の場合は次の年の1週目まで
    IF start_week = 52 THEN
        end_year := start_year + 1;
        end_week := 1;
    ELSE
        end_year := start_year;
        end_week := start_week + 1;
    END IF;

    partition_name := 'weekly_statistics_' || start_year || '_' || LPAD(start_week::text, 2, '0');

    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE c.relname = partition_name
        AND n.nspname = 'ff_users'
    ) THEN
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS ff_users.%I PARTITION OF ff_users.weekly_statistics
            FOR VALUES FROM (%L, %L) TO (%L, %L)',
            partition_name,
            start_year, start_week,
            end_year, end_week
        );
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- パーティション作成トリガー
DROP TRIGGER IF EXISTS create_weekly_statistics_partition_trigger ON ff_users.weekly_statistics;
CREATE TRIGGER create_weekly_statistics_partition_trigger
    BEFORE INSERT ON ff_users.weekly_statistics
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.create_weekly_statistics_partition();

-- 現在の週のパーティションを作成
DO $$
DECLARE
    current_year INTEGER := EXTRACT(YEAR FROM CURRENT_DATE);
    current_week INTEGER := EXTRACT(WEEK FROM CURRENT_DATE);
    next_year INTEGER;
    next_week INTEGER;
BEGIN
    IF current_week = 52 THEN
        next_year := current_year + 1;
        next_week := 1;
    ELSE
        next_year := current_year;
        next_week := current_week + 1;
    END IF;

    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS ff_users.weekly_statistics_%s_%s PARTITION OF ff_users.weekly_statistics
        FOR VALUES FROM (%L, %L) TO (%L, %L)',
        current_year,
        LPAD(current_week::text, 2, '0'),
        current_year, current_week,
        next_year, next_week
    );
END $$;

-- 古いデータを削除するクリーンアップ関数
CREATE OR REPLACE FUNCTION ff_users.cleanup_old_statistics()
RETURNS void AS $$
BEGIN
    -- 3ヶ月以上前の日次統計を削除
    DELETE FROM ff_users.daily_statistics
    WHERE date < current_date - INTERVAL '3 months';

    -- 1年以上前の週次統計を削除
    DELETE FROM ff_users.weekly_statistics
    WHERE (year < extract(year from current_date) - 1)
    OR (year = extract(year from current_date) - 1 
        AND week < extract(week from current_date));

    -- 3年以上前の月次統計を削除
    DELETE FROM ff_users.monthly_statistics
    WHERE (year < extract(year from current_date) - 3)
    OR (year = extract(year from current_date) - 3 
        AND month < extract(month from current_date));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- クリーンアップを実行するトリガー関数
CREATE OR REPLACE FUNCTION ff_users.tr_cleanup_old_statistics()
RETURNS TRIGGER AS $$
BEGIN
    -- 毎日0時にクリーンアップを実行
    IF extract(hour from current_timestamp) = 0 THEN
        PERFORM ff_users.cleanup_old_statistics();
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- クリーンアップトリガーを作成
DROP TRIGGER IF EXISTS cleanup_old_statistics_trigger ON ff_users.daily_statistics;
CREATE TRIGGER cleanup_old_statistics_trigger
    AFTER INSERT ON ff_users.daily_statistics
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.tr_cleanup_old_statistics();

-- ログイン時の統計データ作成・更新関数
CREATE OR REPLACE FUNCTION ff_users.create_or_update_statistics(target_user_id UUID)
RETURNS void AS $$
DECLARE
    current_year INTEGER := extract(year from current_date);
    current_month INTEGER := extract(month from current_date);
    current_isoweek INTEGER := extract(week from current_date);
    daily_stats_exists BOOLEAN;
    weekly_stats_exists BOOLEAN;
    monthly_stats_exists BOOLEAN;
BEGIN
    -- 日次統計が既に存在するか確認
    SELECT EXISTS (
        SELECT 1
        FROM ff_users.daily_statistics
        WHERE user_id = target_user_id
        AND date = current_date
    ) INTO daily_stats_exists;

    -- 週次統計が既に存在するか確認
    SELECT EXISTS (
        SELECT 1
        FROM ff_users.weekly_statistics
        WHERE user_id = target_user_id
        AND year = current_year
        AND week = current_isoweek
    ) INTO weekly_stats_exists;

    -- 月次統計が既に存在するか確認
    SELECT EXISTS (
        SELECT 1
        FROM ff_users.monthly_statistics
        WHERE user_id = target_user_id
        AND year = current_year
        AND month = current_month
    ) INTO monthly_stats_exists;

    -- 日次統計の作成または更新
    IF NOT daily_stats_exists THEN
        -- その日の最初のログインの場合、新規作成
        INSERT INTO ff_users.daily_statistics (
            user_id,
            date,
            focus_sessions,
            focus_time,
            completed_tasks,
            completed_habits,
            login_count
        )
        VALUES (
            target_user_id,
            current_date,
            0,
            '0'::INTERVAL,
            0,
            0,
            1
        );
    ELSE
        -- 同じ日の2回目以降のログインの場合、ログイン回数のみ更新
        UPDATE ff_users.daily_statistics
        SET login_count = login_count + 1
        WHERE user_id = target_user_id
        AND date = current_date;
    END IF;

    -- 週次統計の作成または更新
    IF NOT weekly_stats_exists THEN
        -- その週の最初のログインの場合、新規作成
        INSERT INTO ff_users.weekly_statistics (
            user_id,
            year,
            week,
            focus_sessions,
            focus_time,
            completed_tasks,
            completed_habits,
            login_count
        )
        VALUES (
            target_user_id,
            current_year,
            current_isoweek,
            0,
            '0'::INTERVAL,
            0,
            0,
            1
        );
    ELSE
        -- 既存の週次統計があれば更新
        UPDATE ff_users.weekly_statistics
        SET login_count = login_count + 1
        WHERE user_id = target_user_id
        AND year = current_year
        AND week = current_isoweek;
    END IF;

    -- 月次統計の作成または更新
    IF NOT monthly_stats_exists THEN
        -- その月の最初のログインの場合、新規作成
        INSERT INTO ff_users.monthly_statistics (
            user_id,
            year,
            month,
            focus_sessions,
            focus_time,
            completed_tasks,
            completed_habits,
            login_count
        )
        VALUES (
            target_user_id,
            current_year,
            current_month,
            0,
            '0'::INTERVAL,
            0,
            0,
            1
        );
    ELSE
        -- 既存の月次統計があれば更新
        UPDATE ff_users.monthly_statistics
        SET login_count = login_count + 1
        WHERE user_id = target_user_id
        AND year = current_year
        AND month = current_month;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 既存ユーザーの統計情報を初期化するヘルパー関数
CREATE OR REPLACE FUNCTION ff_users.ensure_user_statistics(target_user_id UUID)
RETURNS void AS $$
BEGIN
    -- ユーザー統計情報が存在しない場合のみ初期化
    IF NOT EXISTS (
        SELECT 1 FROM ff_users.user_statistics WHERE user_id = target_user_id
    ) THEN
        -- ユーザー統計情報のメインレコードを作成
        INSERT INTO ff_users.user_statistics (user_id)
        VALUES (target_user_id)
        ON CONFLICT (user_id) DO NOTHING;
    END IF;
END;
$$ LANGUAGE plpgsql;

