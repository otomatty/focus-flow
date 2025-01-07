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
    -- 連続記録
    current_login_streak INTEGER NOT NULL DEFAULT 0,
    longest_login_streak INTEGER NOT NULL DEFAULT 0,
    current_focus_streak INTEGER NOT NULL DEFAULT 0,
    longest_focus_streak INTEGER NOT NULL DEFAULT 0,
    current_task_streak INTEGER NOT NULL DEFAULT 0,
    longest_task_streak INTEGER NOT NULL DEFAULT 0,
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
    ),
    CONSTRAINT valid_streaks CHECK (
        current_login_streak >= 0 AND
        longest_login_streak >= 0 AND
        current_focus_streak >= 0 AND
        longest_focus_streak >= 0 AND
        current_task_streak >= 0 AND
        longest_task_streak >= 0
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, date)
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
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, year, week),
    CONSTRAINT valid_week CHECK (week BETWEEN 1 AND 53)
);

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
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, year, month),
    CONSTRAINT valid_month CHECK (month BETWEEN 1 AND 12)
);

-- パーティション自動作成トリガー関数
CREATE OR REPLACE FUNCTION ff_users.create_daily_statistics_partition()
RETURNS TRIGGER AS $$
DECLARE
    partition_date DATE;
    partition_name TEXT;
BEGIN
    partition_date := DATE_TRUNC('month', NEW.date)::DATE;
    partition_name := 'daily_statistics_' || TO_CHAR(partition_date, 'YYYY_MM');

    IF NOT EXISTS (
        SELECT 1
        FROM pg_class c
        JOIN pg_namespace n ON n.oid = c.relnamespace
        WHERE n.nspname = 'ff_users'
        AND c.relname = partition_name
    ) THEN
        EXECUTE format(
            'CREATE TABLE IF NOT EXISTS ff_users.%I ' ||
            'PARTITION OF ff_users.daily_statistics ' ||
            'FOR VALUES FROM (%L) TO (%L)',
            partition_name,
            partition_date,
            partition_date + INTERVAL '1 month'
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- パーティション自動作成トリガー
CREATE TRIGGER create_daily_statistics_partition_trigger
    BEFORE INSERT ON ff_users.daily_statistics
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.create_daily_statistics_partition();

-- インデックスの作成
CREATE INDEX idx_user_statistics_user_id ON ff_users.user_statistics(user_id);
CREATE INDEX idx_user_statistics_last_dates ON ff_users.user_statistics(last_login_date, last_focus_date, last_task_date, last_habit_date);
CREATE INDEX idx_daily_statistics_user_id ON ff_users.daily_statistics(user_id);
CREATE INDEX idx_daily_statistics_date ON ff_users.daily_statistics(date);
CREATE INDEX idx_weekly_statistics_user_id ON ff_users.weekly_statistics(user_id);
CREATE INDEX idx_weekly_statistics_year_week ON ff_users.weekly_statistics(year, week);
CREATE INDEX idx_monthly_statistics_user_id ON ff_users.monthly_statistics(user_id);
CREATE INDEX idx_monthly_statistics_year_month ON ff_users.monthly_statistics(year, month);

-- RLSポリシーの設定
ALTER TABLE ff_users.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.daily_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.weekly_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.monthly_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_statistics_policy ON ff_users.user_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY daily_statistics_policy ON ff_users.daily_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY weekly_statistics_policy ON ff_users.weekly_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY monthly_statistics_policy ON ff_users.monthly_statistics FOR ALL USING (auth.uid() = user_id);

-- フォーカスセッション完了時の統計更新関数
CREATE OR REPLACE FUNCTION ff_users.update_focus_statistics(
    p_user_id UUID,
    p_focus_time INTERVAL,
    p_session_date DATE DEFAULT CURRENT_DATE
)
RETURNS void AS $$
DECLARE
    v_current_date DATE := COALESCE(p_session_date, CURRENT_DATE);
    v_last_focus_date DATE;
    v_year INTEGER := EXTRACT(YEAR FROM v_current_date);
    v_month INTEGER := EXTRACT(MONTH FROM v_current_date);
    v_week INTEGER := EXTRACT(WEEK FROM v_current_date);
BEGIN
    -- 最後のフォーカス日を取得
    SELECT last_focus_date INTO v_last_focus_date
    FROM ff_users.user_statistics
    WHERE user_id = p_user_id;

    -- メイン統計の更新
    INSERT INTO ff_users.user_statistics (
        user_id,
        total_focus_sessions,
        total_focus_time,
        daily_focus_sessions,
        daily_focus_time,
        avg_session_length,
        current_focus_streak,
        longest_focus_streak,
        last_focus_date
    ) VALUES (
        p_user_id,
        1,
        p_focus_time,
        1,
        p_focus_time,
        p_focus_time,
        1,
        1,
        v_current_date
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_focus_sessions = ff_users.user_statistics.total_focus_sessions + 1,
        total_focus_time = ff_users.user_statistics.total_focus_time + p_focus_time,
        daily_focus_sessions = CASE 
            WHEN ff_users.user_statistics.last_focus_date = v_current_date 
            THEN ff_users.user_statistics.daily_focus_sessions + 1
            ELSE 1
        END,
        daily_focus_time = CASE 
            WHEN ff_users.user_statistics.last_focus_date = v_current_date 
            THEN ff_users.user_statistics.daily_focus_time + p_focus_time
            ELSE p_focus_time
        END,
        avg_session_length = (ff_users.user_statistics.total_focus_time + p_focus_time) / 
                            (ff_users.user_statistics.total_focus_sessions + 1),
        current_focus_streak = CASE
            WHEN ff_users.user_statistics.last_focus_date = v_current_date - INTERVAL '1 day'
            THEN ff_users.user_statistics.current_focus_streak + 1
            WHEN ff_users.user_statistics.last_focus_date != v_current_date
            THEN 1
            ELSE ff_users.user_statistics.current_focus_streak
        END,
        longest_focus_streak = GREATEST(
            ff_users.user_statistics.longest_focus_streak,
            CASE
                WHEN ff_users.user_statistics.last_focus_date = v_current_date - INTERVAL '1 day'
                THEN ff_users.user_statistics.current_focus_streak + 1
                WHEN ff_users.user_statistics.last_focus_date != v_current_date
                THEN 1
                ELSE ff_users.user_statistics.current_focus_streak
            END
        ),
        last_focus_date = v_current_date;

    -- 日次統計の更新
    INSERT INTO ff_users.daily_statistics (
        user_id,
        date,
        focus_sessions,
        focus_time,
        avg_session_length
    ) VALUES (
        p_user_id,
        v_current_date,
        1,
        p_focus_time,
        p_focus_time
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
        focus_sessions = ff_users.daily_statistics.focus_sessions + 1,
        focus_time = ff_users.daily_statistics.focus_time + p_focus_time,
        avg_session_length = (ff_users.daily_statistics.focus_time + p_focus_time) / 
                            (ff_users.daily_statistics.focus_sessions + 1);

    -- 週次統計の更新
    INSERT INTO ff_users.weekly_statistics (
        user_id,
        year,
        week,
        focus_sessions,
        focus_time,
        avg_session_length
    ) VALUES (
        p_user_id,
        v_year,
        v_week,
        1,
        p_focus_time,
        p_focus_time
    )
    ON CONFLICT (user_id, year, week) DO UPDATE SET
        focus_sessions = ff_users.weekly_statistics.focus_sessions + 1,
        focus_time = ff_users.weekly_statistics.focus_time + p_focus_time,
        avg_session_length = (ff_users.weekly_statistics.focus_time + p_focus_time) / 
                            (ff_users.weekly_statistics.focus_sessions + 1);

    -- 月次統計の更新
    INSERT INTO ff_users.monthly_statistics (
        user_id,
        year,
        month,
        focus_sessions,
        focus_time,
        avg_session_length
    ) VALUES (
        p_user_id,
        v_year,
        v_month,
        1,
        p_focus_time,
        p_focus_time
    )
    ON CONFLICT (user_id, year, month) DO UPDATE SET
        focus_sessions = ff_users.monthly_statistics.focus_sessions + 1,
        focus_time = ff_users.monthly_statistics.focus_time + p_focus_time,
        avg_session_length = (ff_users.monthly_statistics.focus_time + p_focus_time) / 
                            (ff_users.monthly_statistics.focus_sessions + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- タスク完了時の統計更新関数
CREATE OR REPLACE FUNCTION ff_users.update_task_statistics(
    p_user_id UUID,
    p_completed_date DATE DEFAULT CURRENT_DATE
)
RETURNS void AS $$
DECLARE
    v_current_date DATE := COALESCE(p_completed_date, CURRENT_DATE);
    v_last_task_date DATE;
    v_year INTEGER := EXTRACT(YEAR FROM v_current_date);
    v_month INTEGER := EXTRACT(MONTH FROM v_current_date);
    v_week INTEGER := EXTRACT(WEEK FROM v_current_date);
BEGIN
    -- 最後のタスク完了日を取得
    SELECT last_task_date INTO v_last_task_date
    FROM ff_users.user_statistics
    WHERE user_id = p_user_id;

    -- メイン統計の更新
    INSERT INTO ff_users.user_statistics (
        user_id,
        total_tasks,
        completed_tasks,
        daily_completed_tasks,
        current_task_streak,
        longest_task_streak,
        last_task_date
    ) VALUES (
        p_user_id,
        1,
        1,
        1,
        1,
        1,
        v_current_date
    )
    ON CONFLICT (user_id) DO UPDATE SET
        total_tasks = ff_users.user_statistics.total_tasks + 1,
        completed_tasks = ff_users.user_statistics.completed_tasks + 1,
        daily_completed_tasks = CASE 
            WHEN ff_users.user_statistics.last_task_date = v_current_date 
            THEN ff_users.user_statistics.daily_completed_tasks + 1
            ELSE 1
        END,
        task_completion_rate = (ff_users.user_statistics.completed_tasks + 1)::DECIMAL / 
                              (ff_users.user_statistics.total_tasks + 1) * 100,
        current_task_streak = CASE
            WHEN ff_users.user_statistics.last_task_date = v_current_date - INTERVAL '1 day'
            THEN ff_users.user_statistics.current_task_streak + 1
            WHEN ff_users.user_statistics.last_task_date != v_current_date
            THEN 1
            ELSE ff_users.user_statistics.current_task_streak
        END,
        longest_task_streak = GREATEST(
            ff_users.user_statistics.longest_task_streak,
            CASE
                WHEN ff_users.user_statistics.last_task_date = v_current_date - INTERVAL '1 day'
                THEN ff_users.user_statistics.current_task_streak + 1
                WHEN ff_users.user_statistics.last_task_date != v_current_date
                THEN 1
                ELSE ff_users.user_statistics.current_task_streak
            END
        ),
        last_task_date = v_current_date;

    -- 日次統計の更新
    INSERT INTO ff_users.daily_statistics (
        user_id,
        date,
        completed_tasks,
        task_completion_rate
    ) VALUES (
        p_user_id,
        v_current_date,
        1,
        100.0
    )
    ON CONFLICT (user_id, date) DO UPDATE SET
        completed_tasks = ff_users.daily_statistics.completed_tasks + 1;

    -- 週次・月次統計も同様に更新
    -- ... 省略（同様のパターン）
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ログイン時の統計更新関数
CREATE OR REPLACE FUNCTION ff_users.update_login_statistics(
    p_user_id UUID,
    p_login_date DATE DEFAULT CURRENT_DATE
)
RETURNS void AS $$
DECLARE
    v_current_date DATE := COALESCE(p_login_date, CURRENT_DATE);
    v_last_login_date DATE;
BEGIN
    -- 最後のログイン日を取得
    SELECT last_login_date INTO v_last_login_date
    FROM ff_users.user_statistics
    WHERE user_id = p_user_id;

    -- メイン統計の更新
    INSERT INTO ff_users.user_statistics (
        user_id,
        current_login_streak,
        longest_login_streak,
        last_login_date
    ) VALUES (
        p_user_id,
        1,
        1,
        v_current_date
    )
    ON CONFLICT (user_id) DO UPDATE SET
        current_login_streak = CASE
            WHEN ff_users.user_statistics.last_login_date = v_current_date - INTERVAL '1 day'
            THEN ff_users.user_statistics.current_login_streak + 1
            WHEN ff_users.user_statistics.last_login_date != v_current_date
            THEN 1
            ELSE ff_users.user_statistics.current_login_streak
        END,
        longest_login_streak = GREATEST(
            ff_users.user_statistics.longest_login_streak,
            CASE
                WHEN ff_users.user_statistics.last_login_date = v_current_date - INTERVAL '1 day'
                THEN ff_users.user_statistics.current_login_streak + 1
                WHEN ff_users.user_statistics.last_login_date != v_current_date
                THEN 1
                ELSE ff_users.user_statistics.current_login_streak
            END
        ),
        last_login_date = v_current_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 日次統計リセット関数
CREATE OR REPLACE FUNCTION ff_users.reset_daily_statistics()
RETURNS void AS $$
BEGIN
    UPDATE ff_users.user_statistics SET
        daily_focus_sessions = 0,
        daily_focus_time = '0'::INTERVAL,
        daily_completed_tasks = 0,
        daily_habit_completion_rate = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 週次統計リセット関数
CREATE OR REPLACE FUNCTION ff_users.reset_weekly_statistics()
RETURNS void AS $$
BEGIN
    UPDATE ff_users.user_statistics SET
        weekly_focus_sessions = 0,
        weekly_focus_time = '0'::INTERVAL,
        weekly_completed_tasks = 0,
        weekly_habit_completion_rate = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 月次統計リセット関数
CREATE OR REPLACE FUNCTION ff_users.reset_monthly_statistics()
RETURNS void AS $$
BEGIN
    UPDATE ff_users.user_statistics SET
        monthly_focus_sessions = 0,
        monthly_focus_time = '0'::INTERVAL,
        monthly_completed_tasks = 0,
        monthly_habit_completion_rate = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザー統計情報の初期化関数
CREATE OR REPLACE FUNCTION ff_users.initialize_user_statistics(new_user_id UUID)
RETURNS ff_users.user_statistics AS $$
DECLARE
    new_stats ff_users.user_statistics;
BEGIN
    -- トランザクションの開始
    BEGIN
        -- 既存の統計情報をチェック
        IF EXISTS (
            SELECT 1
            FROM ff_users.user_statistics
            WHERE user_id = new_user_id
        ) THEN
            SELECT * INTO new_stats
            FROM ff_users.user_statistics
            WHERE user_id = new_user_id;
            RETURN new_stats;
        END IF;

        -- 新規統計情報を作成
        INSERT INTO ff_users.user_statistics (
            user_id,
            total_focus_sessions,
            total_focus_time,
            avg_session_length,
            total_tasks,
            completed_tasks,
            task_completion_rate,
            current_login_streak,
            longest_login_streak,
            current_focus_streak,
            longest_focus_streak,
            current_task_streak,
            longest_task_streak,
            created_at,
            updated_at
        ) VALUES (
            new_user_id,
            0,
            '0'::INTERVAL,
            '0'::INTERVAL,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            0,
            now(),
            now()
        ) RETURNING * INTO new_stats;

        -- システムログに記録
        INSERT INTO ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            severity
        ) VALUES (
            'USER_STATISTICS_INITIALIZED',
            'initialize_user_statistics',
            jsonb_build_object(
                'user_id', new_user_id
            ),
            'INFO'
        );

        RETURN new_stats;

    EXCEPTION WHEN OTHERS THEN
        -- エラーをログに記録
        INSERT INTO ff_logs.system_logs (
            event_type,
            event_source,
            event_data,
            severity
        ) VALUES (
            'ERROR_INITIALIZING_USER_STATISTICS',
            'initialize_user_statistics',
            jsonb_build_object(
                'user_id', new_user_id,
                'error_code', SQLSTATE,
                'error_message', SQLERRM
            ),
            'ERROR'
        );
        RAISE;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION ff_users.tr_initialize_user_statistics()
RETURNS TRIGGER AS $$
BEGIN
    PERFORM ff_users.initialize_user_statistics(NEW.user_id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- プロフィール作成時に統計情報を初期化するトリガーを設定
DROP TRIGGER IF EXISTS initialize_user_statistics_on_profile_creation ON ff_users.user_profiles;

CREATE TRIGGER initialize_user_statistics_on_profile_creation
    AFTER INSERT ON ff_users.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.tr_initialize_user_statistics();

-- 既存のRLSポリシーの後に追加
CREATE POLICY "Service role can manage all statistics"
    ON ff_users.user_statistics
    FOR ALL
    USING (auth.role() = 'service_role');

CREATE POLICY "Users can initialize their own statistics"
    ON ff_users.user_statistics
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id OR
        auth.role() = 'service_role'
    );

-- ユーザーストリーク情報を取得するビュー
CREATE OR REPLACE VIEW ff_users.user_streaks_view
    WITH (security_barrier = true)
    AS
SELECT
    user_id,
    COALESCE(current_login_streak, 0) as current_login_streak,
    COALESCE(longest_login_streak, 0) as longest_login_streak,
    COALESCE(current_focus_streak, 0) as current_focus_streak,
    COALESCE(longest_focus_streak, 0) as longest_focus_streak,
    COALESCE(current_task_streak, 0) as current_task_streak,
    COALESCE(longest_task_streak, 0) as longest_task_streak
FROM ff_users.user_statistics;

-- ビューのアクセス権限設定
GRANT SELECT ON ff_users.user_streaks_view TO authenticated;

-- RLSポリシーの設定
CREATE POLICY "Users can view their own streaks"
    ON ff_users.user_statistics
    FOR SELECT
    USING (auth.uid() = user_id);

-- ユーザーストリーク情報を取得する関数
CREATE OR REPLACE FUNCTION ff_users.get_user_streaks(p_user_id UUID)
RETURNS TABLE (
    current_login_streak INTEGER,
    longest_login_streak INTEGER,
    current_focus_streak INTEGER,
    longest_focus_streak INTEGER,
    current_task_streak INTEGER,
    longest_task_streak INTEGER
) SECURITY DEFINER SET search_path = ff_users
AS $$
BEGIN
    -- 統計情報が存在しない場合は自動的に初期化
    PERFORM ff_users.initialize_user_statistics(p_user_id);
    
    RETURN QUERY
    SELECT
        v.current_login_streak,
        v.longest_login_streak,
        v.current_focus_streak,
        v.longest_focus_streak,
        v.current_task_streak,
        v.longest_task_streak
    FROM user_streaks_view v
    WHERE v.user_id = p_user_id;

    -- データが見つからない場合はデフォルト値を返す
    IF NOT FOUND THEN
        RETURN QUERY SELECT 0,0,0,0,0,0;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- RPCとして関数を公開
GRANT EXECUTE ON FUNCTION ff_users.get_user_streaks(UUID) TO authenticated; 