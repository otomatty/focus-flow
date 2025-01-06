-- エージェントとユーザーの関係性を管理するためのテーブル
create table if not exists ff_agents.user_agent_relationships (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id VARCHAR(255) REFERENCES ff_agents.agents(id) ON DELETE CASCADE,
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
create table if not exists ff_agents.conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    agent_id VARCHAR(255) REFERENCES ff_agents.agents(id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    sender_type VARCHAR(10) NOT NULL CHECK (sender_type IN ('user', 'agent')),
    context TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 共有経験テーブル
create table if not exists ff_agents.shared_experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_agent_relationship_id UUID REFERENCES ff_agents.user_agent_relationships(id) ON DELETE CASCADE,
    experience_type VARCHAR(255) NOT NULL,
    description TEXT,
    impact_score INTEGER CHECK (impact_score BETWEEN 0 AND 100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- パラメーター更新履歴テーブル
create table if not exists ff_agents.relationship_parameter_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_agent_relationship_id UUID REFERENCES ff_agents.user_agent_relationships(id) ON DELETE CASCADE,
    parameter_name VARCHAR(50) CHECK (parameter_name IN ('intimacy', 'shared_experience', 'emotional_understanding')),
    old_value INTEGER CHECK (old_value BETWEEN 0 AND 100),
    new_value INTEGER CHECK (new_value BETWEEN 0 AND 100),
    reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 会話評価テーブル
create table if not exists ff_agents.conversation_evaluations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ff_agents.conversations(id) ON DELETE CASCADE,
    user_agent_relationship_id UUID REFERENCES ff_agents.user_agent_relationships(id) ON DELETE CASCADE,
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
create table if not exists ff_agents.conversation_tags (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID REFERENCES ff_agents.conversations(id) ON DELETE CASCADE,
    tag_name VARCHAR(50) NOT NULL,
    confidence_score FLOAT CHECK (confidence_score BETWEEN 0 AND 1),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- インデックスの作成
CREATE INDEX idx_user_agent_relationships_user_id ON ff_agents.user_agent_relationships(user_id);
CREATE INDEX idx_user_agent_relationships_agent_id ON ff_agents.user_agent_relationships(agent_id);
CREATE INDEX idx_conversations_user_id ON ff_agents.conversations(user_id);
CREATE INDEX idx_conversations_agent_id ON ff_agents.conversations(agent_id);
CREATE INDEX idx_conversations_created_at ON ff_agents.conversations(created_at);
CREATE INDEX idx_shared_experiences_relationship_id ON ff_agents.shared_experiences(user_agent_relationship_id);
CREATE INDEX idx_parameter_history_relationship_id ON ff_agents.relationship_parameter_history(user_agent_relationship_id);
CREATE INDEX idx_conversation_evaluations_conversation_id ON ff_agents.conversation_evaluations(conversation_id);
CREATE INDEX idx_conversation_tags_conversation_id ON ff_agents.conversation_tags(conversation_id);

-- トリガー関数: updated_atの自動更新
create or replace function ff_agents.update_updated_at_column()
returns trigger as $$
begin
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- updated_atを自動更新するトリガーの作成
create trigger update_user_agent_relationships_updated_at
    before update on ff_agents.user_agent_relationships
    for each row
    execute function ff_agents.update_updated_at_column(); 