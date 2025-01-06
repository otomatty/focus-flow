-- APIキーを管理するテーブル
CREATE TABLE ff_users.api_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider TEXT NOT NULL CHECK (provider IN ('openai', 'anthropic', 'google')),
    encrypted_api_key TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, provider)
);

-- RLSポリシーの設定
ALTER TABLE ff_users.api_keys ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のAPIキーのみ参照可能
CREATE POLICY "Users can view their own api keys" ON ff_users.api_keys
    FOR SELECT TO authenticated
    USING (auth.uid() = user_id);

-- ユーザーは自分のAPIキーのみ作成可能
CREATE POLICY "Users can insert their own api keys" ON ff_users.api_keys
    FOR INSERT TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のAPIキーのみ更新可能
CREATE POLICY "Users can update their own api keys" ON ff_users.api_keys
    FOR UPDATE TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のAPIキーのみ削除可能
CREATE POLICY "Users can delete their own api keys" ON ff_users.api_keys
    FOR DELETE TO authenticated
    USING (auth.uid() = user_id);

-- 更新時のタイムスタンプを自動更新
CREATE TRIGGER set_timestamp
    BEFORE UPDATE ON ff_users.api_keys
    FOR EACH ROW
    EXECUTE FUNCTION common.set_updated_at(); 