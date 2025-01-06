
-- サブスクリプションプラン定義テーブル
CREATE TABLE ff_users.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    price_jpy INTEGER NOT NULL,
    interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly', 'lifetime')),
    features JSONB NOT NULL DEFAULT '{}'::jsonb,
    limits JSONB NOT NULL DEFAULT '{}'::jsonb,
    trial_days INTEGER,
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_price CHECK (price_jpy >= 0),
    CONSTRAINT valid_trial_days CHECK (trial_days IS NULL OR trial_days > 0)
);

-- ユーザーサブスクリプション管理テーブル
CREATE TABLE ff_users.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES ff_users.plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial', 'past_due')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    payment_method_id TEXT,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

-- サブスクリプション履歴テーブル
CREATE TABLE ff_users.subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES ff_users.plans(id),
    status TEXT NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    change_type TEXT NOT NULL CHECK (change_type IN ('new', 'upgrade', 'downgrade', 'cancel', 'expire')),
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 機能制限テーブル
CREATE TABLE ff_users.feature_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    feature_key TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    default_limit INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- タイムスタンプ自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION ff_users.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 各テーブルのタイムスタンプ自動更新トリガー
CREATE TRIGGER update_plans_timestamp
    BEFORE UPDATE ON ff_users.plans
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.update_timestamp();

CREATE TRIGGER update_user_subscriptions_timestamp
    BEFORE UPDATE ON ff_users.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.update_timestamp();

CREATE TRIGGER update_feature_limits_timestamp
    BEFORE UPDATE ON ff_users.feature_limits
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.update_timestamp();

-- 機能制限の初期データ
INSERT INTO ff_users.feature_limits 
    (feature_key, display_name, description, default_limit)
VALUES
    ('statistics_history_months', '統計情報の保持期間', '統計情報を保持する月数', 3),
    ('max_projects', 'プロジェクト数の上限', '作成可能なプロジェクトの最大数', 3),
    ('max_tasks_per_project', 'プロジェクトごとのタスク数', 'プロジェクトごとに作成可能なタスクの最大数', 100),
    ('max_focus_sessions_per_day', '1日のフォーカスセッション数', '1日に実行可能なフォーカスセッションの最大数', 10),
    ('max_team_members', 'チームメンバー数', 'プロジェクトに招待できるメンバーの最大数', 3);

-- デフォルトのプラン設定
INSERT INTO ff_users.plans 
    (name, display_name, description, price_jpy, interval, features, limits, trial_days)
VALUES
    (
        'free', 
        'Free', 
        '基本プラン', 
        0, 
        'monthly',
        '{"can_export_statistics": false, "can_use_api": false}'::jsonb,
        '{
            "statistics_history_months": 3,
            "max_projects": 3,
            "max_tasks_per_project": 100,
            "max_focus_sessions_per_day": 10,
            "max_team_members": 3
        }'::jsonb,
        NULL
    ),
    (
        'premium', 
        'Premium', 
        'プレミアムプラン', 
        980, 
        'monthly',
        '{"can_export_statistics": true, "can_use_api": false}'::jsonb,
        '{
            "statistics_history_months": 12,
            "max_projects": 10,
            "max_tasks_per_project": 500,
            "max_focus_sessions_per_day": -1,
            "max_team_members": 10
        }'::jsonb,
        14
    ),
    (
        'enterprise', 
        'Enterprise', 
        'エンタープライズプラン', 
        4980, 
        'monthly',
        '{"can_export_statistics": true, "can_use_api": true}'::jsonb,
        '{
            "statistics_history_months": -1,
            "max_projects": -1,
            "max_tasks_per_project": -1,
            "max_focus_sessions_per_day": -1,
            "max_team_members": -1
        }'::jsonb,
        30
    );

-- ユーザーの機能制限を確認する関数
CREATE OR REPLACE FUNCTION ff_users.check_feature_limit(
    p_user_id UUID,
    p_feature_key TEXT,
    p_current_count INTEGER DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_limit INTEGER;
    v_default_limit INTEGER;
BEGIN
    -- デフォルトの制限値を取得
    SELECT default_limit INTO v_default_limit
    FROM ff_users.feature_limits
    WHERE feature_key = p_feature_key;

    -- ユーザーの現在のプランでの制限値を取得
    SELECT (p.limits->>p_feature_key)::INTEGER INTO v_limit
    FROM ff_users.user_subscriptions us
    JOIN ff_users.plans p ON p.id = us.plan_id
    WHERE us.user_id = p_user_id
    AND us.status IN ('active', 'trial')
    AND us.current_period_end > now();

    -- 制限値が見つからない場合はデフォルト値を使用
    v_limit := COALESCE(v_limit, v_default_limit, 0);

    -- -1は無制限を表す
    IF v_limit = -1 THEN
        RETURN true;
    END IF;

    -- 現在の使用数が指定されている場合、制限値と比較
    IF p_current_count IS NOT NULL THEN
        RETURN p_current_count < v_limit;
    END IF;

    RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ユーザーの現在のプラン情報を取得する関数
CREATE OR REPLACE FUNCTION ff_users.get_user_plan(p_user_id UUID)
RETURNS TABLE (
    plan_name TEXT,
    plan_features JSONB,
    plan_limits JSONB,
    status TEXT,
    trial_end TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name as plan_name,
        p.features as plan_features,
        p.limits as plan_limits,
        us.status,
        us.trial_end,
        us.current_period_end
    FROM ff_users.user_subscriptions us
    JOIN ff_users.plans p ON p.id = us.plan_id
    WHERE us.user_id = p_user_id
    AND us.status IN ('active', 'trial')
    AND us.current_period_end > now()
    UNION ALL
    SELECT 
        'free' as plan_name,
        (SELECT features FROM ff_users.plans WHERE name = 'free') as plan_features,
        (SELECT limits FROM ff_users.plans WHERE name = 'free') as plan_limits,
        'active' as status,
        NULL as trial_end,
        now() + interval '100 years' as current_period_end
    WHERE NOT EXISTS (
        SELECT 1 
        FROM ff_users.user_subscriptions us2
        WHERE us2.user_id = p_user_id
        AND us2.status IN ('active', 'trial')
        AND us2.current_period_end > now()
    )
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLSポリシーの設定
ALTER TABLE ff_users.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_users.subscription_history ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のサブスクリプション情報のみ参照可能
CREATE POLICY user_subscriptions_policy ON ff_users.user_subscriptions
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY subscription_history_policy ON ff_users.subscription_history
    FOR ALL
    USING (auth.uid() = user_id);

-- プラン情報は全ユーザーが参照可能
CREATE POLICY plans_read_policy ON ff_users.plans
    FOR SELECT
    USING (true);

-- 新規ユーザー用のフリープラン設定トリガー関数
CREATE OR REPLACE FUNCTION ff_users.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_free_plan_id UUID;
BEGIN
    -- フリープランのIDを取得
    SELECT id INTO v_free_plan_id
    FROM ff_users.plans
    WHERE name = 'free';

    -- フリープランを設定
    INSERT INTO ff_users.user_subscriptions
        (user_id, plan_id, status, current_period_start, current_period_end)
    VALUES
        (NEW.id, v_free_plan_id, 'active', now(), now() + interval '100 years');

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 新規ユーザー登録時のトリガーを作成
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW
    EXECUTE FUNCTION ff_users.handle_new_user(); 