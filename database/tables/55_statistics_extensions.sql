-- エラーログを記録するテーブル
CREATE TABLE ff_statistics.error_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    function_name TEXT NOT NULL,
    error_message TEXT NOT NULL,
    error_detail TEXT,
    error_hint TEXT,
    error_context TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- エラーハンドリング用の関数
CREATE OR REPLACE FUNCTION ff_statistics.log_error(
    p_function_name TEXT,
    p_error_message TEXT,
    p_error_detail TEXT DEFAULT NULL,
    p_error_hint TEXT DEFAULT NULL,
    p_error_context TEXT DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO ff_statistics.error_logs (
        function_name,
        error_message,
        error_detail,
        error_hint,
        error_context
    ) VALUES (
        p_function_name,
        p_error_message,
        p_error_detail,
        p_error_hint,
        p_error_context
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 安全な統計情報更新関数
CREATE OR REPLACE FUNCTION ff_statistics.safe_update_statistics()
RETURNS void AS $$
BEGIN
    BEGIN
        PERFORM ff_statistics.update_daily_statistics();
    EXCEPTION WHEN OTHERS THEN
        PERFORM ff_statistics.log_error(
            'update_daily_statistics',
            SQLERRM,
            SQLSTATE,
            'Daily statistics update failed',
            current_timestamp::text
        );
        RAISE NOTICE 'Error in daily statistics update: %', SQLERRM;
    END;

    BEGIN
        PERFORM ff_statistics.update_focus_streaks();
    EXCEPTION WHEN OTHERS THEN
        PERFORM ff_statistics.log_error(
            'update_focus_streaks',
            SQLERRM,
            SQLSTATE,
            'Focus streaks update failed',
            current_timestamp::text
        );
        RAISE NOTICE 'Error in focus streaks update: %', SQLERRM;
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- アーカイブテーブル
CREATE TABLE ff_statistics.statistics_archive (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    archive_date DATE NOT NULL,
    archive_data JSONB NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- アーカイブ処理関数
CREATE OR REPLACE FUNCTION ff_statistics.archive_old_statistics(
    p_archive_before_date DATE
)
RETURNS void AS $$
DECLARE
    v_partition_name TEXT;
    v_archive_count INTEGER;
BEGIN
    -- アーカイブするデータを集計してJSONBとして保存
    INSERT INTO ff_statistics.statistics_archive (
        user_id,
        archive_date,
        archive_data
    )
    SELECT 
        user_id,
        statistics_date,
        jsonb_build_object(
            'focus_time', focus_time,
            'completed_tasks', completed_tasks,
            'archived_at', current_timestamp
        )
    FROM ff_statistics.user_statistics_history
    WHERE statistics_date < p_archive_before_date
    ON CONFLICT (user_id, archive_date) DO NOTHING;

    GET DIAGNOSTICS v_archive_count = ROW_COUNT;

    -- アーカイブ完了後、古いデータを削除
    IF v_archive_count > 0 THEN
        DELETE FROM ff_statistics.user_statistics_history
        WHERE statistics_date < p_archive_before_date;
        
        PERFORM ff_statistics.log_error(
            'archive_old_statistics',
            format('Successfully archived %s records before %s', v_archive_count, p_archive_before_date),
            NULL,
            'Archive operation completed successfully',
            current_timestamp::text
        );
    END IF;
EXCEPTION WHEN OTHERS THEN
    PERFORM ff_statistics.log_error(
        'archive_old_statistics',
        SQLERRM,
        SQLSTATE,
        'Failed to archive old statistics',
        current_timestamp::text
    );
    RAISE EXCEPTION 'Failed to archive old statistics: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トレンド分析関数
CREATE OR REPLACE FUNCTION ff_statistics.get_focus_trends(
    p_user_id UUID,
    p_period_start DATE,
    p_period_end DATE
)
RETURNS TABLE (
    period DATE,
    focus_time INTERVAL,
    completed_tasks INTEGER,
    trend_direction TEXT,
    avg_focus_time INTERVAL,
    avg_completed_tasks NUMERIC
) AS $$
BEGIN
    RETURN QUERY
    WITH daily_stats AS (
        SELECT 
            statistics_date,
            focus_time,
            completed_tasks,
            AVG(EXTRACT(EPOCH FROM focus_time)) OVER w AS avg_focus_seconds,
            AVG(completed_tasks) OVER w AS avg_tasks
        FROM ff_statistics.user_statistics_history
        WHERE user_id = p_user_id
        AND statistics_date BETWEEN p_period_start AND p_period_end
        WINDOW w AS (ORDER BY statistics_date ROWS BETWEEN 6 PRECEDING AND CURRENT ROW)
    )
    SELECT 
        ds.statistics_date,
        ds.focus_time,
        ds.completed_tasks,
        CASE 
            WHEN EXTRACT(EPOCH FROM ds.focus_time) > ds.avg_focus_seconds THEN 'up'
            WHEN EXTRACT(EPOCH FROM ds.focus_time) < ds.avg_focus_seconds THEN 'down'
            ELSE 'stable'
        END as trend_direction,
        (ds.avg_focus_seconds * interval '1 second')::interval as avg_focus_time,
        ROUND(ds.avg_tasks, 2) as avg_completed_tasks
    FROM daily_stats ds
    ORDER BY ds.statistics_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- パフォーマンス最適化のためのインデックス
CREATE INDEX IF NOT EXISTS idx_statistics_history_composite 
ON ff_statistics.user_statistics_history(user_id, statistics_date);

CREATE INDEX IF NOT EXISTS idx_statistics_archive_user_date 
ON ff_statistics.statistics_archive(user_id, archive_date);

-- 統計情報の自動最適化関数
CREATE OR REPLACE FUNCTION ff_statistics.optimize_statistics_tables()
RETURNS void AS $$
BEGIN
    -- 統計情報の更新
    ANALYZE ff_statistics.user_statistics;
    ANALYZE ff_statistics.user_statistics_history;
    ANALYZE ff_statistics.statistics_archive;
    
    -- エラーログの古いデータを削除（30日以上前のデータ）
    DELETE FROM ff_statistics.error_logs
    WHERE created_at < current_timestamp - interval '30 days';
EXCEPTION WHEN OTHERS THEN
    PERFORM ff_statistics.log_error(
        'optimize_statistics_tables',
        SQLERRM,
        SQLSTATE,
        'Failed to optimize statistics tables',
        current_timestamp::text
    );
    RAISE NOTICE 'Error in statistics tables optimization: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- スケジュールされたメンテナンス処理
CREATE OR REPLACE FUNCTION ff_statistics.schedule_maintenance()
RETURNS void AS $$
BEGIN
    -- 毎日の最適化
    PERFORM ff_statistics.optimize_statistics_tables();
    
    -- 月1回のアーカイブ処理（3ヶ月以上前のデータ）
    IF EXTRACT(DAY FROM current_date) = 1 THEN
        PERFORM ff_statistics.archive_old_statistics(
            current_date - interval '3 months'
        );
    END IF;
EXCEPTION WHEN OTHERS THEN
    PERFORM ff_statistics.log_error(
        'schedule_maintenance',
        SQLERRM,
        SQLSTATE,
        'Failed to execute scheduled maintenance',
        current_timestamp::text
    );
    RAISE NOTICE 'Error in scheduled maintenance: %', SQLERRM;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER; 