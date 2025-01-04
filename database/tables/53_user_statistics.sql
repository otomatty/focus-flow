-- ff_statistics スキーマの作成
CREATE SCHEMA IF NOT EXISTS ff_statistics;

-- 基本的な統計情報を管理するテーブル
CREATE TABLE ff_statistics.user_statistics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    total_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    total_completed_tasks INTEGER NOT NULL DEFAULT 0,
    daily_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    weekly_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    monthly_focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    daily_completed_tasks INTEGER NOT NULL DEFAULT 0,
    weekly_completed_tasks INTEGER NOT NULL DEFAULT 0,
    monthly_completed_tasks INTEGER NOT NULL DEFAULT 0,
    longest_focus_streak INTEGER NOT NULL DEFAULT 0,
    current_focus_streak INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT positive_focus_time CHECK (
        total_focus_time >= '0'::INTERVAL AND
        daily_focus_time >= '0'::INTERVAL AND
        weekly_focus_time >= '0'::INTERVAL AND
        monthly_focus_time >= '0'::INTERVAL
    ),
    CONSTRAINT positive_tasks CHECK (
        total_completed_tasks >= 0 AND
        daily_completed_tasks >= 0 AND
        weekly_completed_tasks >= 0 AND
        monthly_completed_tasks >= 0
    ),
    CONSTRAINT positive_streaks CHECK (
        longest_focus_streak >= 0 AND
        current_focus_streak >= 0
    )
);

-- 統計情報の履歴を管理するテーブル（パーティション化）
CREATE TABLE ff_statistics.user_statistics_history (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    statistics_date DATE NOT NULL,
    focus_time INTERVAL NOT NULL DEFAULT '0'::INTERVAL,
    completed_tasks INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    PRIMARY KEY (id, statistics_date)
) PARTITION BY RANGE (statistics_date);

-- 3ヶ月ごとのパーティションを作成する関数
CREATE OR REPLACE FUNCTION ff_statistics.create_statistics_history_partition(
    start_date DATE,
    end_date DATE
) RETURNS void AS $$
DECLARE
    partition_name TEXT;
BEGIN
    partition_name := 'user_statistics_history_' || 
                     to_char(start_date, 'YYYY_MM') || '_' ||
                     to_char(end_date, 'YYYY_MM');
    
    EXECUTE format(
        'CREATE TABLE IF NOT EXISTS ff_statistics.%I ' ||
        'PARTITION OF ff_statistics.user_statistics_history ' ||
        'FOR VALUES FROM (%L) TO (%L)',
        partition_name,
        start_date,
        end_date
    );
END;
$$ LANGUAGE plpgsql;

-- 統計情報の更新頻度を管理するテーブル
CREATE TABLE ff_statistics.update_frequency (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    statistic_name TEXT NOT NULL UNIQUE,
    update_frequency INTERVAL NOT NULL,
    batch_window INTERVAL NOT NULL,
    last_update TIMESTAMPTZ,
    next_update TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT positive_intervals CHECK (
        update_frequency > '0'::INTERVAL AND
        batch_window > '0'::INTERVAL
    )
);

-- 統計情報へのアクセス制御を管理するテーブル
CREATE TABLE ff_statistics.access_control (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_tier TEXT NOT NULL UNIQUE,
    access_period INTERVAL NOT NULL,
    max_history_months INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT positive_access_period CHECK (access_period > '0'::INTERVAL),
    CONSTRAINT positive_history_months CHECK (max_history_months > 0)
);

-- タイムスタンプ自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION ff_statistics.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- user_statistics テーブルのタイムスタンプ自動更新トリガー
CREATE TRIGGER update_user_statistics_timestamp
    BEFORE UPDATE ON ff_statistics.user_statistics
    FOR EACH ROW
    EXECUTE FUNCTION ff_statistics.update_timestamp();

-- update_frequency テーブルのタイムスタンプ自動更新トリガー
CREATE TRIGGER update_frequency_timestamp
    BEFORE UPDATE ON ff_statistics.update_frequency
    FOR EACH ROW
    EXECUTE FUNCTION ff_statistics.update_timestamp();

-- access_control テーブルのタイムスタンプ自動更新トリガー
CREATE TRIGGER update_access_control_timestamp
    BEFORE UPDATE ON ff_statistics.access_control
    FOR EACH ROW
    EXECUTE FUNCTION ff_statistics.update_timestamp();

-- デフォルトの更新頻度設定を挿入
INSERT INTO ff_statistics.update_frequency 
    (statistic_name, update_frequency, batch_window)
VALUES
    ('daily_stats', INTERVAL '1 day', INTERVAL '1 hour'),
    ('weekly_stats', INTERVAL '1 week', INTERVAL '2 hours'),
    ('monthly_stats', INTERVAL '1 month', INTERVAL '4 hours');

-- デフォルトのアクセス制御設定を挿入
INSERT INTO ff_statistics.access_control
    (user_tier, access_period, max_history_months)
VALUES
    ('free', INTERVAL '3 months', 3),
    ('premium', INTERVAL '1 year', 12),
    ('enterprise', INTERVAL '100 years', 120);

-- ユーザー統計を取得する関数
CREATE OR REPLACE FUNCTION ff_statistics.get_user_statistics(
    p_user_id UUID,
    p_user_tier TEXT
)
RETURNS TABLE (
    total_focus_time INTERVAL,
    total_completed_tasks INTEGER,
    daily_focus_time INTERVAL,
    weekly_focus_time INTERVAL,
    monthly_focus_time INTERVAL,
    daily_completed_tasks INTEGER,
    weekly_completed_tasks INTEGER,
    monthly_completed_tasks INTEGER,
    longest_focus_streak INTEGER,
    current_focus_streak INTEGER
) AS $$
DECLARE
    v_access_period INTERVAL;
BEGIN
    -- ユーザーのアクセス期間を取得
    SELECT access_period INTO v_access_period
    FROM ff_statistics.access_control
    WHERE user_tier = p_user_tier;

    -- アクセス期間に基づいて統計情報を返す
    RETURN QUERY
    SELECT 
        us.total_focus_time,
        us.total_completed_tasks,
        us.daily_focus_time,
        us.weekly_focus_time,
        us.monthly_focus_time,
        us.daily_completed_tasks,
        us.weekly_completed_tasks,
        us.monthly_completed_tasks,
        us.longest_focus_streak,
        us.current_focus_streak
    FROM ff_statistics.user_statistics us
    WHERE us.user_id = p_user_id
    AND us.updated_at >= (now() - v_access_period);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- インデックスの作成
CREATE INDEX idx_user_statistics_user_id ON ff_statistics.user_statistics(user_id);
CREATE INDEX idx_user_statistics_history_user_id ON ff_statistics.user_statistics_history(user_id);
CREATE INDEX idx_user_statistics_history_date ON ff_statistics.user_statistics_history(statistics_date);

-- RLSポリシーの設定
ALTER TABLE ff_statistics.user_statistics ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_statistics.user_statistics_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_statistics_policy ON ff_statistics.user_statistics
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY user_statistics_history_policy ON ff_statistics.user_statistics_history
    FOR ALL
    USING (auth.uid() = user_id);

-- 初期パーティションの作成（現在から1年分）
SELECT ff_statistics.create_statistics_history_partition(
    date_trunc('month', current_date)::date,
    (date_trunc('month', current_date) + interval '3 months')::date
); 