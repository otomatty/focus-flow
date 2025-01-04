-- 統計情報の更新関数
CREATE OR REPLACE FUNCTION ff_statistics.update_daily_statistics()
RETURNS void AS $$
BEGIN
    -- 日次統計の更新
    UPDATE ff_statistics.user_statistics us
    SET 
        daily_focus_time = subquery.daily_focus_time,
        daily_completed_tasks = subquery.daily_completed_tasks
    FROM (
        SELECT 
            user_id,
            sum(focus_time) as daily_focus_time,
            sum(completed_tasks) as daily_completed_tasks
        FROM ff_statistics.user_statistics_history
        WHERE statistics_date = current_date
        GROUP BY user_id
    ) subquery
    WHERE us.user_id = subquery.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 週次統計の更新関数
CREATE OR REPLACE FUNCTION ff_statistics.update_weekly_statistics()
RETURNS void AS $$
BEGIN
    -- 週次統計の更新
    UPDATE ff_statistics.user_statistics us
    SET 
        weekly_focus_time = subquery.weekly_focus_time,
        weekly_completed_tasks = subquery.weekly_completed_tasks
    FROM (
        SELECT 
            user_id,
            sum(focus_time) as weekly_focus_time,
            sum(completed_tasks) as weekly_completed_tasks
        FROM ff_statistics.user_statistics_history
        WHERE statistics_date >= date_trunc('week', current_date)
        GROUP BY user_id
    ) subquery
    WHERE us.user_id = subquery.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 月次統計の更新関数
CREATE OR REPLACE FUNCTION ff_statistics.update_monthly_statistics()
RETURNS void AS $$
BEGIN
    -- 月次統計の更新
    UPDATE ff_statistics.user_statistics us
    SET 
        monthly_focus_time = subquery.monthly_focus_time,
        monthly_completed_tasks = subquery.monthly_completed_tasks
    FROM (
        SELECT 
            user_id,
            sum(focus_time) as monthly_focus_time,
            sum(completed_tasks) as monthly_completed_tasks
        FROM ff_statistics.user_statistics_history
        WHERE statistics_date >= date_trunc('month', current_date)
        GROUP BY user_id
    ) subquery
    WHERE us.user_id = subquery.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ストリークの更新関数
CREATE OR REPLACE FUNCTION ff_statistics.update_focus_streaks()
RETURNS void AS $$
DECLARE
    min_daily_focus INTERVAL := INTERVAL '25 minutes'; -- 最小フォーカス時間（ポモドーロ1回分）
BEGIN
    WITH streak_calc AS (
        SELECT 
            user_id,
            statistics_date,
            focus_time >= min_daily_focus as is_focus_day,
            COUNT(*) FILTER (WHERE focus_time >= min_daily_focus) 
                OVER (PARTITION BY user_id ORDER BY statistics_date) as streak_group
        FROM ff_statistics.user_statistics_history
        WHERE statistics_date <= current_date
        ORDER BY user_id, statistics_date DESC
    ),
    current_streaks AS (
        SELECT 
            user_id,
            COUNT(*) as current_streak
        FROM streak_calc
        WHERE is_focus_day
        GROUP BY user_id, streak_group
        HAVING MAX(statistics_date) = current_date
    ),
    longest_streaks AS (
        SELECT 
            user_id,
            MAX(streak_length) as longest_streak
        FROM (
            SELECT 
                user_id,
                streak_group,
                COUNT(*) as streak_length
            FROM streak_calc
            WHERE is_focus_day
            GROUP BY user_id, streak_group
        ) s
        GROUP BY user_id
    )
    UPDATE ff_statistics.user_statistics us
    SET 
        current_focus_streak = COALESCE(cs.current_streak, 0),
        longest_focus_streak = GREATEST(COALESCE(ls.longest_streak, 0), COALESCE(cs.current_streak, 0))
    FROM longest_streaks ls
    LEFT JOIN current_streaks cs USING (user_id)
    WHERE us.user_id = ls.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- パーティション管理関数
CREATE OR REPLACE FUNCTION ff_statistics.manage_history_partitions()
RETURNS void AS $$
DECLARE
    partition_start DATE;
    partition_end DATE;
BEGIN
    -- 次の3ヶ月分のパーティションを作成
    partition_start := date_trunc('month', current_date + interval '3 months')::date;
    partition_end := (partition_start + interval '3 months')::date;
    
    PERFORM ff_statistics.create_statistics_history_partition(
        partition_start,
        partition_end
    );
    
    -- 古いパーティションのアーカイブ処理（必要に応じて実装）
END;
$$ LANGUAGE plpgsql;

-- 期間指定の統計情報取得関数
CREATE OR REPLACE FUNCTION ff_statistics.get_statistics_by_period(
    p_user_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    focus_time INTERVAL,
    completed_tasks INTEGER,
    avg_daily_focus_time INTERVAL,
    avg_daily_tasks NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        sum(focus_time) as focus_time,
        sum(completed_tasks) as completed_tasks,
        (sum(focus_time) / NULLIF(p_end_date - p_start_date, 0))::interval as avg_daily_focus_time,
        ROUND(sum(completed_tasks)::numeric / NULLIF(p_end_date - p_start_date, 0), 2) as avg_daily_tasks
    FROM ff_statistics.user_statistics_history
    WHERE user_id = p_user_id
    AND statistics_date BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーの課金ステータス変更時のアクセス権限調整関数
CREATE OR REPLACE FUNCTION ff_statistics.adjust_access_on_tier_change(
    p_user_id UUID,
    p_new_tier TEXT
)
RETURNS void AS $$
DECLARE
    v_new_access_period INTERVAL;
    v_new_history_months INTEGER;
BEGIN
    -- 新しいアクセス期間を取得
    SELECT 
        access_period,
        max_history_months
    INTO 
        v_new_access_period,
        v_new_history_months
    FROM ff_statistics.access_control
    WHERE user_tier = p_new_tier;

    -- アクセス期間外のデータをアーカイブまたは制限（必要に応じて実装）
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 統計情報の自動更新をスケジュールするための設定
CREATE OR REPLACE FUNCTION ff_statistics.schedule_statistics_updates()
RETURNS void AS $$
BEGIN
    -- 日次更新
    PERFORM ff_statistics.update_daily_statistics();
    PERFORM ff_statistics.update_focus_streaks();
    
    -- 週次更新（月曜日の場合）
    IF EXTRACT(DOW FROM current_date) = 1 THEN
        PERFORM ff_statistics.update_weekly_statistics();
    END IF;
    
    -- 月次更新（月初めの場合）
    IF EXTRACT(DAY FROM current_date) = 1 THEN
        PERFORM ff_statistics.update_monthly_statistics();
        PERFORM ff_statistics.manage_history_partitions();
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 