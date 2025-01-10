-- パーティション自�作成トリガー関数
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
CREATE INDEX IF NOT EXISTS idx_user_statistics_user_id ON ff_users.user_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_user_statistics_last_dates ON ff_users.user_statistics(last_login_date, last_focus_date, last_task_date, last_habit_date);
CREATE INDEX IF NOT EXISTS idx_daily_statistics_user_id ON ff_users.daily_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_statistics_date ON ff_users.daily_statistics(date);
CREATE INDEX IF NOT EXISTS idx_weekly_statistics_user_id ON ff_users.weekly_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_statistics_year_week ON ff_users.weekly_statistics(year, week);
CREATE INDEX IF NOT EXISTS idx_monthly_statistics_user_id ON ff_users.monthly_statistics(user_id);
CREATE INDEX IF NOT EXISTS idx_monthly_statistics_year_month ON ff_users.monthly_statistics(year, month);

-- RLSポリシーの設定
ALTER TABLE ff_users.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.daily_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.weekly_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.monthly_statistics ENABLE ROW LEVEL SECURITY;

-- 既存のポリシーを削除
DROP POLICY IF EXISTS user_statistics_policy ON ff_users.user_statistics;
DROP POLICY IF EXISTS daily_statistics_policy ON ff_users.daily_statistics;
DROP POLICY IF EXISTS weekly_statistics_policy ON ff_users.weekly_statistics;
DROP POLICY IF EXISTS monthly_statistics_policy ON ff_users.monthly_statistics;
DROP POLICY IF EXISTS "Service role can manage all statistics" ON ff_users.user_statistics;
DROP POLICY IF EXISTS "Users can initialize their own statistics" ON ff_users.user_statistics;

-- ポリシーを作成
CREATE POLICY user_statistics_policy ON ff_users.user_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY daily_statistics_policy ON ff_users.daily_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY weekly_statistics_policy ON ff_users.weekly_statistics FOR ALL USING (auth.uid() = user_id);
CREATE POLICY monthly_statistics_policy ON ff_users.monthly_statistics FOR ALL USING (auth.uid() = user_id);

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
        last_focus_date
    ) VALUES (
        p_user_id,
        1,
        p_focus_time,
        1,
        p_focus_time,
        p_focus_time,
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
        last_task_date
    ) VALUES (
        p_user_id,
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

    -- 週次統計の更新
    INSERT INTO ff_users.weekly_statistics (
        user_id,
        year,
        week,
        completed_tasks
    ) VALUES (
        p_user_id,
        v_year,
        v_week,
        1
    )
    ON CONFLICT (user_id, year, week) DO UPDATE SET
        completed_tasks = ff_users.weekly_statistics.completed_tasks + 1;

    -- 月次統計の更新
    INSERT INTO ff_users.monthly_statistics (
        user_id,
        year,
        month,
        completed_tasks
    ) VALUES (
        p_user_id,
        v_year,
        v_month,
        1
    )
    ON CONFLICT (user_id, year, month) DO UPDATE SET
        completed_tasks = ff_users.monthly_statistics.completed_tasks + 1;
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
    PERFORM ff_users.initialize_user_statistics(NEW.id);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- プロフィール作成時に統計情報を初期化するトリガーを設定
DROP TRIGGER IF EXISTS initialize_user_statistics_on_profile_creation ON auth.users;

CREATE TRIGGER initialize_user_statistics_on_profile_creation
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.tr_initialize_user_statistics(); 