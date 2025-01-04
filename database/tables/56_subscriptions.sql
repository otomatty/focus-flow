-- サブスクリプション管理用のスキーマ作成
CREATE SCHEMA IF NOT EXISTS ff_subscriptions;

-- サブスクリプションプラン定義テーブル
CREATE TABLE ff_subscriptions.plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL,
    interval TEXT NOT NULL CHECK (interval IN ('monthly', 'yearly')),
    features JSONB NOT NULL DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ユーザーサブスクリプション管理テーブル
CREATE TABLE ff_subscriptions.user_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES ff_subscriptions.plans(id),
    status TEXT NOT NULL CHECK (status IN ('active', 'cancelled', 'expired', 'trial')),
    current_period_start TIMESTAMPTZ NOT NULL,
    current_period_end TIMESTAMPTZ NOT NULL,
    cancel_at_period_end BOOLEAN NOT NULL DEFAULT false,
    trial_end TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (user_id)
);

-- サブスクリプション履歴テーブル
CREATE TABLE ff_subscriptions.subscription_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES ff_subscriptions.plans(id),
    status TEXT NOT NULL,
    period_start TIMESTAMPTZ NOT NULL,
    period_end TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- タイムスタンプ自動更新のためのトリガー関数
CREATE OR REPLACE FUNCTION ff_subscriptions.update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- プランテーブルのタイムスタンプ自動更新トリガー
CREATE TRIGGER update_plans_timestamp
    BEFORE UPDATE ON ff_subscriptions.plans
    FOR EACH ROW
    EXECUTE FUNCTION ff_subscriptions.update_timestamp();

-- ユーザーサブスクリプションテーブルのタイムスタンプ自動更新トリガー
CREATE TRIGGER update_user_subscriptions_timestamp
    BEFORE UPDATE ON ff_subscriptions.user_subscriptions
    FOR EACH ROW
    EXECUTE FUNCTION ff_subscriptions.update_timestamp();

-- デフォルトのプラン設定を挿入
INSERT INTO ff_subscriptions.plans 
    (name, display_name, description, price, interval, features)
VALUES
    ('free', 'Free', '基本プラン', 0, 'monthly', '{"statistics_history_months": 3, "max_projects": 3}'),
    ('premium', 'Premium', 'プレミアムプラン', 980, 'monthly', '{"statistics_history_months": 12, "max_projects": 10}'),
    ('enterprise', 'Enterprise', 'エンタープライズプラン', 4980, 'monthly', '{"statistics_history_months": 120, "max_projects": -1}');

-- ユーザーの現在のサブスクリプションプランを取得する関数
CREATE OR REPLACE FUNCTION ff_subscriptions.get_user_plan(p_user_id UUID)
RETURNS TABLE (
    plan_name TEXT,
    plan_features JSONB,
    status TEXT,
    current_period_end TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        p.name as plan_name,
        p.features as plan_features,
        us.status,
        us.current_period_end
    FROM ff_subscriptions.user_subscriptions us
    JOIN ff_subscriptions.plans p ON p.id = us.plan_id
    WHERE us.user_id = p_user_id
    AND us.status IN ('active', 'trial')
    AND us.current_period_end > now()
    UNION ALL
    SELECT 
        'free' as plan_name,
        (SELECT features FROM ff_subscriptions.plans WHERE name = 'free') as plan_features,
        'active' as status,
        now() + interval '100 years' as current_period_end
    WHERE NOT EXISTS (
        SELECT 1 
        FROM ff_subscriptions.user_subscriptions us2
        WHERE us2.user_id = p_user_id
        AND us2.status IN ('active', 'trial')
        AND us2.current_period_end > now()
    )
    LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLSポリシーの設定
ALTER TABLE ff_subscriptions.user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ff_subscriptions.subscription_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY user_subscriptions_policy ON ff_subscriptions.user_subscriptions
    FOR ALL
    USING (auth.uid() = user_id);

CREATE POLICY subscription_history_policy ON ff_subscriptions.subscription_history
    FOR ALL
    USING (auth.uid() = user_id);

-- 新規ユーザー用のフリープラン設定トリガー関数
CREATE OR REPLACE FUNCTION ff_subscriptions.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
    v_free_plan_id UUID;
BEGIN
    -- フリープランのIDを取得
    SELECT id INTO v_free_plan_id
    FROM ff_subscriptions.plans
    WHERE name = 'free';

    -- フリープランを設定
    INSERT INTO ff_subscriptions.user_subscriptions
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
    EXECUTE FUNCTION ff_subscriptions.handle_new_user();

-- 既存ユーザーにフリープランを設定(【手動実行用】実行するときに注意)
DO $$
DECLARE
    v_free_plan_id UUID;
BEGIN
    -- フリープランのIDを取得
    SELECT id INTO v_free_plan_id
    FROM ff_subscriptions.plans
    WHERE name = 'free';

    -- サブスクリプションが設定されていない既存ユーザーにフリープランを設定
    INSERT INTO ff_subscriptions.user_subscriptions
        (user_id, plan_id, status, current_period_start, current_period_end)
    SELECT 
        u.id,
        v_free_plan_id,
        'active',
        now(),
        now() + interval '100 years'
    FROM auth.users u
    WHERE NOT EXISTS (
        SELECT 1
        FROM ff_subscriptions.user_subscriptions us
        WHERE us.user_id = u.id
    );
END;
$$; 