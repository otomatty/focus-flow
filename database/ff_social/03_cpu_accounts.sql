-- CPUアカウントを管理するテーブル
CREATE TABLE IF NOT EXISTS ff_social.cpu_accounts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(255) NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  avatar_url TEXT,
  personality VARCHAR(20) NOT NULL CHECK (personality IN ('supportive', 'competitive', 'analytical', 'creative')),
  base_focus_time INTEGER NOT NULL DEFAULT 120, -- 1日あたりの基本フォーカス時間（分）
  base_achievement_rate FLOAT NOT NULL DEFAULT 0.8, -- 基本達成率（0-1）
  base_session_completion FLOAT NOT NULL DEFAULT 0.85, -- セッション完了率（0-1）
  base_consistency FLOAT NOT NULL DEFAULT 0.9, -- 一貫性（0-1）
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- デフォルトのCPUアカウントを作成
INSERT INTO ff_social.cpu_accounts (name, level, personality, base_focus_time, base_achievement_rate, base_session_completion, base_consistency)
VALUES
  ('Focus Bot Alpha', 5, 'supportive', 150, 0.85, 0.9, 0.95),
  ('Task Master Beta', 7, 'competitive', 180, 0.9, 0.85, 0.85),
  ('Analytics Bot', 6, 'analytical', 160, 0.8, 0.95, 0.9),
  ('Creative Assistant', 4, 'creative', 140, 0.75, 0.8, 0.85);

-- トリガー：更新時のタイムスタンプを自動更新
CREATE OR REPLACE FUNCTION ff_social.update_cpu_accounts_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_cpu_accounts_updated_at
  BEFORE UPDATE ON ff_social.cpu_accounts
  FOR EACH ROW
  EXECUTE FUNCTION ff_social.update_cpu_accounts_updated_at(); 