-- エージェントとユーザーの関係性を管理するためのテーブル
CREATE TABLE IF NOT EXISTS user_agent_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id VARCHAR(255) REFERENCES agents(id) ON DELETE CASCADE,
    intimacy INTEGER DEFAULT 0 CHECK (intimacy BETWEEN 0 AND 100),
    shared_experience INTEGER DEFAULT 0 CHECK (shared_experience BETWEEN 0 AND 100),
    emotional_understanding INTEGER DEFAULT 0 CHECK (emotional_understanding BETWEEN 0 AND 100),
    total_interactions INTEGER DEFAULT 0,
    last_interaction_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, agent_id)
);

-- 会話履歴テーブル
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id VARCHAR(255) REFERENCES agents(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'agent')),
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 共有経験テーブル
CREATE TABLE IF NOT EXISTS shared_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_agent_relationship_id UUID REFERENCES user_agent_relationships(id) ON DELETE CASCADE,
    experience_type VARCHAR(255) NOT NULL,
    description TEXT,
    impact_score INTEGER CHECK (impact_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- パラメーター更新履歴テーブル
CREATE TABLE IF NOT EXISTS relationship_parameter_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_agent_relationship_id UUID REFERENCES user_agent_relationships(id) ON DELETE CASCADE,
    parameter_name VARCHAR(50) CHECK (parameter_name IN ('intimacy', 'shared_experience', 'emotional_understanding')),
    old_value INTEGER CHECK (old_value BETWEEN 0 AND 100),
    new_value INTEGER CHECK (new_value BETWEEN 0 AND 100),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 会話評価テーブル
CREATE TABLE IF NOT EXISTS conversation_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    user_agent_relationship_id UUID REFERENCES user_agent_relationships(id) ON DELETE CASCADE,
    depth_score INTEGER CHECK (depth_score BETWEEN 0 AND 100),
    emotional_score INTEGER CHECK (emotional_score BETWEEN 0 AND 100),
    interest_score INTEGER CHECK (interest_score BETWEEN 0 AND 100),
    length_score INTEGER CHECK (length_score BETWEEN 0 AND 100),
    response_score INTEGER CHECK (response_score BETWEEN 0 AND 100),
    total_score INTEGER CHECK (total_score BETWEEN 0 AND 100),
    intimacy_change INTEGER,
    shared_experience_change INTEGER,
    emotional_understanding_change INTEGER,
    evaluation_factors JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 会話タグテーブル
CREATE TABLE IF NOT EXISTS conversation_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_user_agent_relationships_user_id ON user_agent_relationships(user_id);
CREATE INDEX idx_user_agent_relationships_agent_id ON user_agent_relationships(agent_id);
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_agent_id ON conversations(agent_id);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);
CREATE INDEX idx_shared_experiences_relationship_id ON shared_experiences(user_agent_relationship_id);
CREATE INDEX idx_parameter_history_relationship_id ON relationship_parameter_history(user_agent_relationship_id);
CREATE INDEX idx_conversation_evaluations_conversation_id ON conversation_evaluations(conversation_id);
CREATE INDEX idx_conversation_tags_conversation_id ON conversation_tags(conversation_id);

-- トリガー関数: updated_atの自動更新
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atを自動更新するトリガーの作成
CREATE TRIGGER update_user_agent_relationships_updated_at
    BEFORE UPDATE ON user_agent_relationships
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 