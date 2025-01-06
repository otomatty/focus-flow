DROP TABLE IF EXISTS ff_logs.debug_logs CASCADE;

-- デバッグログテーブルの作成
CREATE TABLE IF NOT EXISTS ff_logs.debug_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT DEFAULT 'system_action',
    function_name TEXT,
    step_name TEXT,
    log_data JSONB,
    details JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- インデックスの作成
CREATE INDEX IF NOT EXISTS debug_logs_user_id_idx ON ff_logs.debug_logs(user_id);
CREATE INDEX IF NOT EXISTS debug_logs_created_at_idx ON ff_logs.debug_logs(created_at);
CREATE INDEX IF NOT EXISTS debug_logs_function_name_idx ON ff_logs.debug_logs(function_name);
CREATE INDEX IF NOT EXISTS debug_logs_step_name_idx ON ff_logs.debug_logs(step_name);

-- 更新日時を自動更新するトリガー関数
DROP FUNCTION IF EXISTS ff_logs.debug_logs_update_updated_at() CASCADE;
CREATE OR REPLACE FUNCTION ff_logs.debug_logs_update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 更新日時トリガーの設定
DROP TRIGGER IF EXISTS debug_logs_update_updated_at_trigger ON ff_logs.debug_logs;
CREATE TRIGGER debug_logs_update_updated_at_trigger
    BEFORE UPDATE ON ff_logs.debug_logs
    FOR EACH ROW
    EXECUTE FUNCTION ff_logs.debug_logs_update_updated_at();

-- デバッグログ挿入関数
DROP FUNCTION IF EXISTS ff_logs.create_debug_log(UUID, TEXT, TEXT, TEXT, JSONB, JSONB);
CREATE OR REPLACE FUNCTION ff_logs.create_debug_log(
    p_user_id UUID,
    p_action TEXT DEFAULT 'system_action',
    p_function_name TEXT DEFAULT NULL,
    p_step_name TEXT DEFAULT NULL,
    p_log_data JSONB DEFAULT NULL,
    p_details JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
BEGIN
    INSERT INTO ff_logs.debug_logs (user_id, action, function_name, step_name, log_data, details)
    VALUES (p_user_id, COALESCE(p_action, 'system_action'), p_function_name, p_step_name, p_log_data, p_details)
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 権限の設定
GRANT USAGE ON SCHEMA ff_logs TO service_role, authenticated, anon;
GRANT ALL ON ff_logs.debug_logs TO service_role;
GRANT SELECT, INSERT ON ff_logs.debug_logs TO authenticated;
GRANT SELECT ON ff_logs.debug_logs TO anon;

-- RLSの設定
ALTER TABLE ff_logs.debug_logs ENABLE ROW LEVEL SECURITY;

-- ポリシーの作成
CREATE POLICY "Users can view their own logs" ON ff_logs.debug_logs
    FOR SELECT
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "Users can create their own logs" ON ff_logs.debug_logs
    FOR INSERT
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Service role has full access" ON ff_logs.debug_logs
    FOR ALL
    TO service_role
    USING (true)
    WITH CHECK (true);

-- 関数の実行権限
GRANT EXECUTE ON FUNCTION ff_logs.create_debug_log(UUID, TEXT, TEXT, TEXT, JSONB, JSONB) TO service_role, authenticated; 