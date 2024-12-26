-- プロジェクトテーブルの作成
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL CHECK (status IN ('not_started', 'in_progress', 'completed', 'on_hold')),
  priority TEXT NOT NULL CHECK (priority IN ('high', 'medium', 'low')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  is_archived BOOLEAN DEFAULT FALSE,
  color TEXT
);

-- プロジェクトタスク中間テーブルの作成
CREATE TABLE project_tasks (
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  position INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (project_id, task_id)
);

-- updated_atを自動更新するトリガーの作成
CREATE TRIGGER update_projects_updated_at
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- プロジェクトテーブルのRLSを設定
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

-- プロジェクトテーブルのポリシーを作成
CREATE POLICY "プロジェクトは作成者のみが参照可能" ON projects
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "プロジェクトは認証済みユーザーが作成可能" ON projects
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "プロジェクトは作成者のみが更新可能" ON projects
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "プロジェクトは作成者のみが削除可能" ON projects
  FOR DELETE USING (auth.uid() = user_id);

-- プロジェクトタスク中間テーブルのRLSを設定
ALTER TABLE project_tasks ENABLE ROW LEVEL SECURITY;

-- プロジェクトタスク中間テーブルのポリシーを作成
CREATE POLICY "select_project_tasks" ON project_tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "insert_project_tasks" ON project_tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "update_project_tasks" ON project_tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  );

CREATE POLICY "delete_project_tasks" ON project_tasks
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_tasks.project_id
      AND projects.user_id = auth.uid()
    )
  ); 