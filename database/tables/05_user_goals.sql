-- ff_goalsスキーマの作成
create schema if not exists ff_goals;

-- ゴールテンプレートテーブル
create table if not exists ff_goals.goal_templates (
    id uuid primary key default uuid_generate_v4(),
    title text not null,                          -- ゴールのタイトル
    description text,                             -- ゴールの詳細説明
    category text not null,                       -- カテゴリ（'learning', 'skill', 'project', 'career'）
    difficulty text default 'medium',             -- 難易度（'easy', 'medium', 'hard'）
    estimated_duration interval,                  -- 推定達成期間
    recommended_habits jsonb default '[]'::jsonb, -- 推奨される習慣
    suggested_milestones jsonb default '[]'::jsonb, -- 推奨されるマイルストーン
    metrics_template jsonb default '{             
        "type": "completion",
        "target_value": 100,
        "unit": "percent",
        "measurement_frequency": "daily"
    }'::jsonb,-- 測定基準のテンプレート
    tags text[],                                  -- タグ
    is_featured boolean default false,            -- おすすめフラグ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (difficulty in ('easy', 'medium', 'hard')),
    check (category in ('learning', 'skill', 'project', 'career'))
);

-- ユーザーゴールテーブル
create table if not exists ff_goals.user_goals (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    template_id uuid references ff_goals.goal_templates(id),
    parent_goal_id uuid references ff_goals.user_goals(id), -- 親ゴールID（サブゴール管理用）
    title text not null,                          -- ゴールのタイトル
    description text,                             -- ゴールの詳細説明
    category text not null,                       -- カテゴリ
    priority text default 'medium',               -- 優先度（'high', 'medium', 'low'）
    status text default 'active',                 -- 状態（'active', 'completed', 'paused', 'cancelled'）
    progress integer default 0,                   -- 進捗率（0-100）
    start_date timestamp with time zone,          -- 開始予定日
    target_date timestamp with time zone,         -- 目標達成予定日
    completed_at timestamp with time zone,        -- 完了日
    related_skills text[],                        -- 関連するスキル
    milestones jsonb default '[]'::jsonb,         -- マイルストーン
    metrics jsonb default '{                      
        "type": "completion",
        "target_value": 100,
        "current_value": 0,
        "unit": "percent"
    }'::jsonb,                                    -- 目標の測定基準
    reflection_notes jsonb default '[]'::jsonb,    -- 振り返りノート
    visibility text default 'private',             -- 公開設定（'private', 'public', 'friends'）
    collaborators uuid[] default array[]::uuid[],  -- 共同達成者
    tags text[],                                  -- タグ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (priority in ('high', 'medium', 'low')),
    check (status in ('active', 'completed', 'paused', 'cancelled')),
    check (progress between 0 and 100),
    check (category in ('learning', 'skill', 'project', 'career')),
    check (visibility in ('private', 'public', 'friends'))
);

-- テーブルコメント
comment on table ff_goals.goal_templates is 'ゴールのテンプレートを管理するテーブル';
comment on table ff_goals.user_goals is 'ユーザーの個別ゴールを管理するテーブル';

-- カラムコメント（goal_templates）
comment on column ff_goals.goal_templates.id is 'ゴールテンプレートの一意識別子';
comment on column ff_goals.goal_templates.title is 'ゴールテンプレートのタイトル';
comment on column ff_goals.goal_templates.description is 'ゴールテンプレートの詳細説明';
comment on column ff_goals.goal_templates.category is 'ゴールのカテゴリ（学習、スキル、プロジェクト、キャリア）';
comment on column ff_goals.goal_templates.difficulty is 'ゴールの難易度（easy, medium, hard）';
comment on column ff_goals.goal_templates.estimated_duration is '推定達成期間';
comment on column ff_goals.goal_templates.recommended_habits is '推奨される習慣のリスト';
comment on column ff_goals.goal_templates.suggested_milestones is '推奨されるマイルストーンのリスト';
comment on column ff_goals.goal_templates.metrics_template is '目標達成度の測定方法テンプレート';
comment on column ff_goals.goal_templates.tags is 'ゴールの分類や検索用のタグ';
comment on column ff_goals.goal_templates.is_featured is 'おすすめフラグ';
comment on column ff_goals.goal_templates.created_at is 'レコード作成日時';
comment on column ff_goals.goal_templates.updated_at is 'レコード更新日時';

-- カラムコメント（user_goals）
comment on column ff_goals.user_goals.id is 'ユーザーゴールの一意識別子';
comment on column ff_goals.user_goals.user_id is 'ゴールの所有者ID';
comment on column ff_goals.user_goals.template_id is '参照元のゴールテンプレートID';
comment on column ff_goals.user_goals.parent_goal_id is '親ゴールのID（サブゴールの場合）';
comment on column ff_goals.user_goals.title is 'ゴールのタイトル';
comment on column ff_goals.user_goals.description is 'ゴールの詳細説明';
comment on column ff_goals.user_goals.category is 'ゴールのカテゴリ';
comment on column ff_goals.user_goals.priority is 'ゴールの優先度';
comment on column ff_goals.user_goals.status is 'ゴールの現在の状態';
comment on column ff_goals.user_goals.progress is 'ゴールの進捗率（0-100）';
comment on column ff_goals.user_goals.start_date is 'ゴール開始予定日';
comment on column ff_goals.user_goals.target_date is 'ゴール達成予定日';
comment on column ff_goals.user_goals.completed_at is 'ゴール完了日時';
comment on column ff_goals.user_goals.related_skills is '関連するスキルのリスト';
comment on column ff_goals.user_goals.milestones is 'ゴール達成のためのマイルストーン';
comment on column ff_goals.user_goals.metrics is 'ゴール達成度の測定方法と現在値';
comment on column ff_goals.user_goals.reflection_notes is '振り返りノート';
comment on column ff_goals.user_goals.visibility is 'ゴールの公開設定';
comment on column ff_goals.user_goals.collaborators is '共同達成者のユーザーIDリスト';
comment on column ff_goals.user_goals.tags is 'ゴールの分類や検索用のタグ';
comment on column ff_goals.user_goals.created_at is 'レコード作成日時';
comment on column ff_goals.user_goals.updated_at is 'レコード更新日時';

-- インデックス
create index idx_goal_templates_category on ff_goals.goal_templates(category);
create index idx_goal_templates_featured on ff_goals.goal_templates(is_featured) where is_featured = true;

create index idx_user_goals_user_id on ff_goals.user_goals(user_id);
create index idx_user_goals_template_id on ff_goals.user_goals(template_id);
create index idx_user_goals_parent_goal_id on ff_goals.user_goals(parent_goal_id);
create index idx_user_goals_category on ff_goals.user_goals(category);
create index idx_user_goals_status on ff_goals.user_goals(status);
create index idx_user_goals_priority on ff_goals.user_goals(priority);
create index idx_user_goals_target_date on ff_goals.user_goals(target_date);
create index idx_user_goals_visibility on ff_goals.user_goals(visibility);

-- トリガー
create trigger update_goal_templates_updated_at
    before update on ff_goals.goal_templates
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_user_goals_updated_at
    before update on ff_goals.user_goals
    for each row
    execute function ff_users.update_updated_at_column(); 