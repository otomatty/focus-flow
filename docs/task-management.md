# タスク管理機能設計ドキュメント

## 概要

タスク管理機能は、プロジェクトベースの階層的なタスク管理を実現し、柔軟なグループ化と依存関係の管理を可能にします。

## データベース構造

### プロジェクト（projects）

プロジェクトは最上位の管理単位として機能します。

```sql
create table projects (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  description text,
  status project_status not null default 'not_started',
  priority project_priority not null default 'medium',
  color text default 'default',
  start_date timestamp with time zone,
  end_date timestamp with time zone,
  user_id uuid not null references auth.users(id),
  is_archived boolean not null default false,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### タスクグループ（task_groups）

タスクの論理的なグループ化を管理します。階層構造を持つことができます。

```sql
create table task_groups (
  id uuid primary key default uuid_generate_v4(),
  project_id uuid references projects(id),
  parent_group_id uuid references task_groups(id),
  name text not null,
  description text,
  path ltree,                    -- 階層パスの管理
  metadata jsonb,                -- グループ固有の設定
  position integer,              -- 同階層内での順序
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### タスク（tasks）

実際の作業単位を表します。

```sql
create table tasks (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users(id) not null,
  parent_task_id uuid references tasks(id),
  title text not null,
  description text,
  due_date timestamp with time zone,
  priority text check (priority in ('high', 'medium', 'low')),
  category text,
  status text check (status in ('not_started', 'in_progress', 'completed')),
  is_recurring boolean default false,
  recurring_pattern jsonb,
  ai_generated boolean default false,
  difficulty_level integer check (difficulty_level between 1 and 5),
  estimated_duration interval,
  actual_duration interval,
  position integer,
  path ltree,
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);
```

### タスクグループメンバーシップ（task_group_memberships）

タスクとグループの関係を管理します。

```sql
create table task_group_memberships (
  task_id uuid references tasks(id),
  group_id uuid references task_groups(id),
  position integer,              -- グループ内での順序
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (task_id, group_id)
);
```

### タスク関連性（task_relationships）

タスク間の関連性を管理します。

```sql
create table task_relationships (
  source_task_id uuid references tasks(id),
  target_task_id uuid references tasks(id),
  relationship_type text not null,  -- ('related', 'references', 'derived_from' など)
  metadata jsonb,                   -- 関連性の追加情報
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (source_task_id, target_task_id)
);
```

### タスク依存関係（task_dependencies）

タスク間の依存関係を管理します。

```sql
create table task_dependencies (
  dependent_task_id uuid references tasks(id),    -- 依存する側のタスク
  prerequisite_task_id uuid references tasks(id), -- 前提となるタスク
  dependency_type text not null,                  -- ('required', 'optional', 'conditional')
  conditions jsonb,                               -- 条件付き依存の場合の条件
  status text,                                    -- 依存関係の状態
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now(),
  primary key (dependent_task_id, prerequisite_task_id)
);
```

## 主要な機能

### 1. 階層構造管理

- プロジェクト > グループ > タスク の階層構造
- グループの無限階層化が可能
- ltreeを使用した効率的な階層パス管理

### 2. グループ化機能

- タスクの柔軟なグループ化
- 1つのタスクを複数のグループに所属可能
- グループ内でのタスクの順序管理

### 3. タスクの関連性管理

- タスク間の様々な関連性の定義
- 双方向・単方向の関連付け
- メタデータによる関連性の詳細情報管理

### 4. 依存関係管理

- タスク間の前提条件の定義
- 必須・オプション・条件付きの依存関係
- 依存関係の状態管理

### 5. 進捗管理

- タスクの状態管理
- 予定時間と実際の所要時間の記録
- 難易度レベルの管理

### 6. 繰り返しタスク

- 定期的なタスクの自動生成
- 日次・週次・月次の繰り返しパターン
- 繰り返しタスクのカスタマイズ

## セキュリティ

### RLSポリシー

各テーブルにRow Level Securityを適用し、ユーザーごとのアクセス制御を実現します。

```sql
-- プロジェクトのRLS
create policy "ユーザーは自分のプロジェクトのみアクセス可能"
  on projects for all
  using (auth.uid() = user_id);

-- タスクグループのRLS
create policy "プロジェクトの所有者のみグループにアクセス可能"
  on task_groups for all
  using (
    exists (
      select 1 from projects
      where projects.id = task_groups.project_id
      and projects.user_id = auth.uid()
    )
  );

-- タスクのRLS
create policy "ユーザーは自分のタスクのみアクセス可能"
  on tasks for all
  using (auth.uid() = user_id);
```

## インデックス

パフォーマンス最適化のための主要なインデックス：

```sql
-- タスクのインデックス
create index idx_tasks_user_id on tasks (user_id);
create index idx_tasks_status on tasks (status);
create index idx_tasks_due_date on tasks (due_date) where status != 'completed';
create index idx_tasks_path_gist on tasks using gist (path);
create index idx_tasks_position on tasks ("position") where parent_task_id is not null;

-- グループのインデックス
create index idx_task_groups_project_id on task_groups (project_id);
create index idx_task_groups_path_gist on task_groups using gist (path);
```

## 拡張機能

### 1. AIタスク生成

- AIによるタスク提案機能
- タスクの自動分類
- 依存関係の自動検出

### 2. タスク分析

- 所要時間の予測
- ボトルネックの検出
- 進捗レポートの生成

### 3. スキル管理

- タスク完了による経験値獲得
- スキルレベルの管理
- 達成度の可視化 