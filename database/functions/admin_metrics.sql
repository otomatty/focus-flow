-- システム管理者用のメトリクス関数


-- データベースサイズを取得
CREATE OR REPLACE FUNCTION public.get_db_size()
RETURNS TABLE (size_mb numeric)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    pg_database_size(current_database()) / (1024 * 1024)::numeric AS size_mb;
END;
$$;

-- ストレージサイズを取得
CREATE OR REPLACE FUNCTION public.get_storage_size()
RETURNS TABLE (size_gb numeric)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    SUM(size) / (1024 * 1024 * 1024)::numeric AS size_gb
  FROM storage.objects;
END;
$$;

-- リアルタイム接続数を取得
CREATE OR REPLACE FUNCTION public.get_realtime_connections()
RETURNS TABLE (connections bigint)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(*)::bigint
  FROM realtime.channels
  WHERE inserted_at > NOW() - INTERVAL '5 minutes';
END;
$$;

-- 月別ユーザーアクティビティを取得
CREATE OR REPLACE FUNCTION public.get_user_activity_by_month(months_limit integer)
RETURNS TABLE (
  month timestamp with time zone,
  active_users bigint,
  new_users bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', NOW()) - ((months_limit - 1) || ' months')::interval,
      date_trunc('month', NOW()),
      '1 month'::interval
    ) AS month
  )
  SELECT
    months.month,
    COUNT(DISTINCT CASE WHEN up.last_activity_at >= months.month AND up.last_activity_at < months.month + '1 month'::interval THEN up.id END) AS active_users,
    COUNT(DISTINCT CASE WHEN up.created_at >= months.month AND up.created_at < months.month + '1 month'::interval THEN up.id END) AS new_users
  FROM months
  LEFT JOIN user_profiles up ON TRUE
  GROUP BY months.month
  ORDER BY months.month;
END;
$$;

-- 月別タスク完了率を取得
CREATE OR REPLACE FUNCTION public.get_task_completion_by_month(months_limit integer)
RETURNS TABLE (
  month timestamp with time zone,
  completion_rate numeric,
  overdue_rate numeric
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH months AS (
    SELECT generate_series(
      date_trunc('month', NOW()) - ((months_limit - 1) || ' months')::interval,
      date_trunc('month', NOW()),
      '1 month'::interval
    ) AS month
  )
  SELECT
    months.month,
    ROUND(
      (COUNT(CASE WHEN t.status = 'completed' AND t.completed_at >= months.month AND t.completed_at < months.month + '1 month'::interval THEN 1 END)::numeric /
      NULLIF(COUNT(CASE WHEN t.created_at >= months.month AND t.created_at < months.month + '1 month'::interval THEN 1 END), 0) * 100),
      2
    ) AS completion_rate,
    ROUND(
      (COUNT(CASE WHEN t.status = 'pending' AND t.due_date < NOW() AND t.created_at >= months.month AND t.created_at < months.month + '1 month'::interval THEN 1 END)::numeric /
      NULLIF(COUNT(CASE WHEN t.created_at >= months.month AND t.created_at < months.month + '1 month'::interval THEN 1 END), 0) * 100),
      2
    ) AS overdue_rate
  FROM months
  LEFT JOIN tasks t ON TRUE
  GROUP BY months.month
  ORDER BY months.month;
END;
$$;

-- 時間別APIリクエスト数を取得
CREATE OR REPLACE FUNCTION public.get_api_requests_by_hour(hours_limit integer)
RETURNS TABLE (
  hour integer,
  request_count bigint,
  error_count bigint
)
SECURITY DEFINER
SET search_path = public
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  WITH hours AS (
    SELECT generate_series(
      date_trunc('hour', NOW()) - ((hours_limit - 1) || ' hours')::interval,
      date_trunc('hour', NOW()),
      '1 hour'::interval
    ) AS hour
  )
  SELECT
    EXTRACT(HOUR FROM hours.hour)::integer,
    COUNT(CASE WHEN l.status_code < 400 THEN 1 END)::bigint AS request_count,
    COUNT(CASE WHEN l.status_code >= 400 THEN 1 END)::bigint AS error_count
  FROM hours
  LEFT JOIN logs l ON
    l.created_at >= hours.hour AND
    l.created_at < hours.hour + '1 hour'::interval
  GROUP BY hours.hour
  ORDER BY hours.hour;
END;
$$; 