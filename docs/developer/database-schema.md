# データベーススキーマ設計書

## スキーマ構成

Focus Flowのデータベースは以下のスキーマで構成されています：

1. ff_users - ユーザー管理
2. ff_tasks - タスク管理
3. ff_focus - フォーカスセッション
4. ff_notes - ノート管理
5. ff_habits - 習慣管理
6. ff_logs - ログ管理
7. ff_social - ソーシャル機能
8. ff_schedules - スケジュール管理
9. ff_skills - スキル管理
10. ff_gamification - ゲーミフィケーション
11. ff_agents - AIエージェント
12. ff_storage - ストレージ管理
13. ff_notifications - 通知管理

## 詳細スキーマ

### ff_users スキーマ
ユーザー管理に関連するテーブル群

#### users
- id: uuid (PK)
- email: text (UNIQUE)
- username: text (UNIQUE)
- full_name: text
- avatar_url: text
- created_at: timestamp
- updated_at: timestamp
- last_login: timestamp
- status: text
- settings: jsonb

#### user_preferences
- user_id: uuid (FK -> users.id)
- theme: text
- language: text
- notification_settings: jsonb
- privacy_settings: jsonb

### ff_tasks スキーマ
タスク管理に関連するテーブル群

#### projects
- id: uuid (PK)
- name: text
- description: text
- owner_id: uuid (FK -> users.id)
- status: text
- created_at: timestamp
- updated_at: timestamp
- settings: jsonb

#### tasks
- id: uuid (PK)
- project_id: uuid (FK -> projects.id)
- title: text
- description: text
- status: text
- priority: integer
- due_date: timestamp
- created_by: uuid (FK -> users.id)
- assigned_to: uuid (FK -> users.id)
- created_at: timestamp
- updated_at: timestamp
- metadata: jsonb

#### task_dependencies
- task_id: uuid (FK -> tasks.id)
- dependent_task_id: uuid (FK -> tasks.id)
- dependency_type: text

#### task_groups
- id: uuid (PK)
- name: text
- description: text
- project_id: uuid (FK -> projects.id)
- created_at: timestamp

### ff_focus スキーマ
フォーカスセッション管理に関連するテーブル群

#### focus_sessions
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- start_time: timestamp
- end_time: timestamp
- duration: interval
- task_id: uuid (FK -> tasks.id)
- status: text
- interruption_count: integer
- focus_score: numeric

#### session_metrics
- session_id: uuid (FK -> focus_sessions.id)
- metric_type: text
- value: numeric
- recorded_at: timestamp

### ff_notes スキーマ
ノート管理に関連するテーブル群

#### notes
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- title: text
- content: text
- format: text
- created_at: timestamp
- updated_at: timestamp
- tags: text[]
- metadata: jsonb

#### note_templates
- id: uuid (PK)
- name: text
- description: text
- content: text
- created_by: uuid (FK -> users.id)
- is_public: boolean
- created_at: timestamp

#### note_links
- source_note_id: uuid (FK -> notes.id)
- target_note_id: uuid (FK -> notes.id)
- link_type: text
- created_at: timestamp

### ff_habits スキーマ
習慣管理に関連するテーブル群

#### habits
- id: uuid (PK)
- user_id: uuid (FK -> users.id)
- name: text
- description: text
- frequency: jsonb
- start_date: date
- end_date: date
- status: text
- created_at: timestamp

#### habit_logs
- id: uuid (PK)
- habit_id: uuid (FK -> habits.id)
- completed_at: timestamp
- status: text
- notes: text

### ff_gamification スキーマ
ゲーミフィケーションに関連するテーブル群

#### experience_points
- user_id: uuid (FK -> users.id)
- activity_type: text
- points: integer
- earned_at: timestamp
- source_id: uuid
- source_type: text

#### achievements
- id: uuid (PK)
- name: text
- description: text
- requirements: jsonb
- points: integer
- badge_url: text

#### user_achievements
- user_id: uuid (FK -> users.id)
- achievement_id: uuid (FK -> achievements.id)
- earned_at: timestamp
- progress: jsonb

## インデックス設計

各テーブルには以下のインデックスが設定されています：

1. 主キー（Primary Key）インデックス
2. 外部キー（Foreign Key）インデックス
3. 検索性能向上のための複合インデックス
4. 全文検索用のインデックス（該当するテーブルのみ）

## セキュリティ設計

1. Row Level Security (RLS)の実装
2. データ暗号化
3. アクセス制御
4. 監査ログ

## バックアップ戦略

1. 定期的なフルバックアップ
2. Point-in-Time Recovery (PITR)
3. レプリケーション
4. 障害復旧計画 