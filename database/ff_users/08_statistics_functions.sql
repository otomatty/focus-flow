-- パーティション管理関数
CREATE OR REPLACE FUNCTION ff_users.manage_statistics_partitions()
RETURNS void AS $$
DECLARE
    current_date DATE := CURRENT_DATE;
    next_month DATE := current_date + INTERVAL '1 month';
    next_partition_date DATE := DATE_TRUNC('month', next_month)::DATE;
    partition_name TEXT;
BEGIN
    -- 次月のパーティションを作成
    partition_name := 'daily_statistics_' || TO_CHAR(next_partition_date, 'YYYY_MM');
    
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
            next_partition_date,
            next_partition_date + INTERVAL '1 month'
        );
    END IF;
END;
$$ LANGUAGE plpgsql;

-- 期間指定の統計情報取得関数
CREATE OR REPLACE FUNCTION ff_users.get_statistics_by_period(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    date_period DATE,
    focus_sessions INTEGER,
    focus_time INTERVAL,
    completed_tasks INTEGER,
    completed_habits INTEGER,
    avg_session_length INTERVAL,
    task_completion_rate DECIMAL(5,2),
    habit_completion_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ds.date,
        ds.focus_sessions,
        ds.focus_time,
        ds.completed_tasks,
        ds.completed_habits,
        ds.avg_session_length,
        ds.task_completion_rate,
        ds.habit_completion_rate
    FROM ff_users.daily_statistics ds
    WHERE ds.user_id = p_user_id
    AND ds.date BETWEEN p_start_date AND p_end_date
    ORDER BY ds.date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 統計情報の自動更新スケジューラ
CREATE OR REPLACE FUNCTION ff_users.schedule_statistics_maintenance()
RETURNS void AS $$
BEGIN
    -- 日次統計のリセット（毎日0時に実行）
    PERFORM ff_users.reset_daily_statistics();
    
    -- 週次統計のリセット（月曜日に実行）
    IF EXTRACT(DOW FROM CURRENT_DATE) = 1 THEN
        PERFORM ff_users.reset_weekly_statistics();
    END IF;
    
    -- 月次統計のリセット（月初めに実行）
    IF EXTRACT(DAY FROM CURRENT_DATE) = 1 THEN
        PERFORM ff_users.reset_monthly_statistics();
        PERFORM ff_users.manage_statistics_partitions();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 集計期間の統計サマリー取得関数
CREATE OR REPLACE FUNCTION ff_users.get_statistics_summary(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    total_focus_sessions INTEGER,
    total_focus_time INTERVAL,
    avg_daily_focus_time INTERVAL,
    total_completed_tasks INTEGER,
    avg_daily_tasks NUMERIC,
    avg_session_length INTERVAL,
    task_completion_rate DECIMAL(5,2),
    habit_completion_rate DECIMAL(5,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        SUM(ds.focus_sessions)::INTEGER,
        SUM(ds.focus_time),
        (SUM(ds.focus_time) / NULLIF(p_end_date - p_start_date + 1, 0))::INTERVAL,
        SUM(ds.completed_tasks)::INTEGER,
        ROUND(AVG(ds.completed_tasks)::NUMERIC, 2),
        (SUM(ds.focus_time) / NULLIF(SUM(ds.focus_sessions), 0))::INTERVAL,
        ROUND(AVG(ds.task_completion_rate)::NUMERIC, 2),
        ROUND(AVG(ds.habit_completion_rate)::NUMERIC, 2)
    FROM ff_users.daily_statistics ds
    WHERE ds.user_id = p_user_id
    AND ds.date BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 