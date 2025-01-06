-- ff_goalsスキーマの作成
create schema if not exists ff_habits;

-- ゴールカテゴリーテーブル
create table if not exists ff_habits.goal_categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,                           -- カテゴリー名
    description text,                             -- 説明
    icon text,                                    -- アイコン
    color text,                                   -- カラーコード
    parent_id uuid references ff_habits.goal_categories(id), -- 親カテゴリー
    is_active boolean default true,               -- 有効/無効フラグ
    display_order integer not null default 0,     -- 表示順
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(name)
);

-- メトリクス定義テーブル
create table if not exists ff_habits.metric_definitions (
    id uuid primary key default uuid_generate_v4(),
    name text not null,                           -- メトリクス名
    description text,                             -- 説明
    type text not null,                          -- メトリクスタイプ（'numeric', 'boolean', 'percentage', 'duration'）
    unit text,                                    -- 単位（'count', 'minutes', 'hours', 'percent'等）
    default_target_value numeric,                 -- デフォルトの目標値
    min_value numeric,                           -- 最小値
    max_value numeric,                           -- 最大値
    measurement_frequency text not null,          -- 測定頻度（'daily', 'weekly', 'monthly'）
    calculation_method text,                      -- 計算方法（'sum', 'average', 'last'等）
    is_active boolean default true,               -- 有効/無効フラグ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (type in ('numeric', 'boolean', 'percentage', 'duration')),
    check (measurement_frequency in ('daily', 'weekly', 'monthly')),
    check (calculation_method in ('sum', 'average', 'last')),
    unique(name)
);

-- ゴールテンプレートテーブル
create table if not exists ff_habits.goal_templates (
    id uuid primary key default uuid_generate_v4(),
    title text not null,                          -- ゴールのタイトル
    description text,                             -- ゴールの詳細説明
    category_id uuid references ff_habits.goal_categories(id) not null, -- カテゴリーID
    difficulty text default 'medium',             -- 難易度（'easy', 'medium', 'hard'）
    estimated_duration interval,                  -- 推定達成期間
    recommended_habits jsonb default '[]'::jsonb, -- 推奨される習慣
    metric_id uuid references ff_habits.metric_definitions(id), -- メトリクス定義ID
    metric_target_value numeric,                  -- 目標値
    tags text[],                                  -- タグ
    is_featured boolean default false,            -- おすすめフラグ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (difficulty in ('easy', 'medium', 'hard'))
);

-- ユーザーゴールテーブル
create table if not exists ff_habits.user_goals (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    template_id uuid references ff_habits.goal_templates(id),
    title text not null,                          -- ゴールのタイトル
    description text,                             -- ゴールの詳細説明
    category_id uuid references ff_habits.goal_categories(id) not null, -- カテゴリーID
    priority text default 'medium',               -- 優先度（'high', 'medium', 'low'）
    status text default 'active',                 -- 状態（'active', 'completed', 'paused', 'cancelled'）
    progress integer default 0,                   -- 進捗率（0-100）
    start_date timestamp with time zone,          -- 開始予定日
    target_date timestamp with time zone,         -- 目標達成予定日
    completed_at timestamp with time zone,        -- 完了日
    related_skills text[],                        -- 関連するスキル
    metric_id uuid references ff_habits.metric_definitions(id), -- メトリクス定義ID
    metric_target_value numeric,                  -- 目標値
    metric_current_value numeric default 0,       -- 現在値
    visibility text default 'private',            -- 公開設定（'public', 'followers', 'private'）
    tags text[],                                  -- タグ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (priority in ('high', 'medium', 'low')),
    check (status in ('active', 'completed', 'paused', 'cancelled')),
    check (progress between 0 and 100),
    check (visibility in ('public', 'followers', 'private'))
);



-- マイルストーンテーブル
create table if not exists ff_habits.goal_milestones (
    id uuid primary key default uuid_generate_v4(),
    goal_id uuid references ff_habits.user_goals(id) not null,
    title text not null,                          -- マイルストーンのタイトル
    description text,                             -- 詳細説明
    due_date timestamp with time zone,            -- 期限
    status text default 'not_started',            -- 状態（'not_started', 'in_progress', 'completed'）
    completion_date timestamp with time zone,      -- 完了日
    order_index integer not null,                 -- 表示順序
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (status in ('not_started', 'in_progress', 'completed'))
);

-- 目標-習慣の関連付けテーブル
create table if not exists ff_habits.goal_habits (
    id uuid primary key default uuid_generate_v4(),
    goal_id uuid references ff_habits.user_goals(id) not null,
    habit_id uuid references ff_habits.user_habits(id) not null,
    relationship_type text default 'primary',      -- 関連タイプ（'primary', 'secondary'）
    ai_suggestion_id uuid,                         -- AI提案との関連付け
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(goal_id, habit_id),
    check (relationship_type in ('primary', 'secondary'))
);

-- AI提案履歴テーブル
create table if not exists ff_habits.ai_suggestions (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    suggestion_type text not null,                -- 提案タイプ（'goal_details', 'habit_recommendation', 'next_goal'）
    original_input text,                          -- ユーザーの入力
    suggested_content jsonb not null,             -- AI提案内容
    status text default 'pending',                -- 状態（'pending', 'accepted', 'rejected'）
    feedback text,                                -- ユーザーからのフィードバック
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (suggestion_type in ('goal_details', 'habit_recommendation', 'next_goal')),
    check (status in ('pending', 'accepted', 'rejected'))
);

-- テンプレート選択履歴テーブル
create table if not exists ff_habits.template_selections (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    template_type text not null,                  -- テンプレートタイプ（'goal', 'habit'）
    template_id uuid not null,                    -- goal_templates or habit_templatesのID
    customizations jsonb,                         -- テンプレートからの変更点
    created_at timestamp with time zone default now(),
    check (template_type in ('goal', 'habit'))
);

-- 目標の振り返りテーブル
create table if not exists ff_habits.goal_reflections (
    id uuid primary key default uuid_generate_v4(),
    goal_id uuid references ff_habits.user_goals(id) not null,
    note_id uuid references ff_notes.notes(id) not null,
    reflection_type text not null check (reflection_type in ('weekly', 'monthly', 'milestone', 'completion')),
    milestone_id uuid references ff_habits.goal_milestones(id),
    period_start timestamp with time zone not null,
    period_end timestamp with time zone not null,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(goal_id, note_id)
);


-- RLSポリシーの設定
alter table ff_habits.user_goals enable row level security;
alter table ff_habits.goal_milestones enable row level security;
alter table ff_habits.goal_reflections enable row level security;

-- ゴールの基本ポリシー
create policy "Users can view their own goals"
    on ff_habits.user_goals
    for select
    using (
        auth.uid() = user_id
        or visibility = 'public'
        or (
            visibility = 'followers'
            and exists (
                select 1 from ff_social.follows
                where follower_id = auth.uid()
                and following_id = user_id
                and status = 'accepted'
            )
        )
    );

create policy "Users can insert their own goals"
    on ff_habits.user_goals
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own goals"
    on ff_habits.user_goals
    for update
    using (auth.uid() = user_id);

create policy "Users can delete their own goals"
    on ff_habits.user_goals
    for delete
    using (auth.uid() = user_id);

-- マイルストーンのポリシー
create policy "Users can view goal milestones"
    on ff_habits.goal_milestones
    for select
    using (
        exists (
            select 1 from ff_habits.user_goals
            where id = goal_id
            and (
                user_id = auth.uid()
                or visibility = 'public'
                or (
                    visibility = 'followers'
                    and exists (
                        select 1 from ff_social.follows
                        where follower_id = auth.uid()
                        and following_id = user_id
                        and status = 'accepted'
                    )
                )
            )
        )
    );

create policy "Users can manage their goal milestones"
    on ff_habits.goal_milestones
    for all
    using (
        exists (
            select 1 from ff_habits.user_goals
            where id = goal_id
            and user_id = auth.uid()
        )
    );


-- 振り返りのポリシー
create policy "Users can view goal reflections"
    on ff_habits.goal_reflections
    for select
    using (
        exists (
            select 1 from ff_habits.user_goals
            where id = goal_id
            and (
                user_id = auth.uid()
                or visibility = 'public'
                or (
                    visibility = 'followers'
                    and exists (
                        select 1 from ff_social.follows
                        where follower_id = auth.uid()
                        and following_id = user_id
                        and status = 'accepted'
                    )
                )
            )
        )
    );

create policy "Users can manage their goal reflections"
    on ff_habits.goal_reflections
    for all
    using (
        exists (
            select 1 from ff_habits.user_goals
            where id = goal_id
            and user_id = auth.uid()
        )
    );

-- テーブルコメント
comment on table ff_habits.goal_templates is 'ゴールのテンプレートを管理するテーブル';
comment on table ff_habits.user_goals is 'ユーザーの個別ゴールを管理するテーブル';

-- カラムコメント（goal_templates）
comment on column ff_habits.goal_templates.id is 'ゴールテンプレートの一意識別子';
comment on column ff_habits.goal_templates.title is 'ゴールテンプレートのタイトル';
comment on column ff_habits.goal_templates.description is 'ゴールテンプレートの詳細説明';
comment on column ff_habits.goal_templates.category_id is 'ゴールのカテゴリーID';
comment on column ff_habits.goal_templates.difficulty is 'ゴールの難易度（easy, medium, hard）';
comment on column ff_habits.goal_templates.estimated_duration is '推定達成期間';
comment on column ff_habits.goal_templates.recommended_habits is '推奨される習慣のリスト';
comment on column ff_habits.goal_templates.metric_id is 'メトリクス定義ID';
comment on column ff_habits.goal_templates.metric_target_value is '目標値';
comment on column ff_habits.goal_templates.tags is 'ゴールの分類や検索用のタグ';
comment on column ff_habits.goal_templates.is_featured is 'おすすめフラグ';
comment on column ff_habits.goal_templates.created_at is 'レコード作成日時';
comment on column ff_habits.goal_templates.updated_at is 'レコード更新日時';

-- カラムコメント（user_goals）
comment on column ff_habits.user_goals.id is 'ユーザーゴールの一意識別子';
comment on column ff_habits.user_goals.user_id is 'ゴールの所有者ID';
comment on column ff_habits.user_goals.template_id is '参照元のゴールテンプレートID';
comment on column ff_habits.user_goals.title is 'ゴールのタイトル';
comment on column ff_habits.user_goals.description is 'ゴールの詳細説明';
comment on column ff_habits.user_goals.category_id is 'ゴールのカテゴリーID';
comment on column ff_habits.user_goals.priority is 'ゴールの優先度';
comment on column ff_habits.user_goals.status is 'ゴールの現在の状態';
comment on column ff_habits.user_goals.progress is 'ゴールの進捗率（0-100）';
comment on column ff_habits.user_goals.start_date is 'ゴール開始予定日';
comment on column ff_habits.user_goals.target_date is 'ゴール達成予定日';
comment on column ff_habits.user_goals.completed_at is 'ゴール完了日時';
comment on column ff_habits.user_goals.related_skills is '関連するスキルのリスト';
comment on column ff_habits.user_goals.metric_id is 'メトリクス定義ID';
comment on column ff_habits.user_goals.metric_target_value is '目標値';
comment on column ff_habits.user_goals.metric_current_value is '現在値';
comment on column ff_habits.user_goals.visibility is 'ゴールの公開設定';
comment on column ff_habits.user_goals.tags is 'ゴールの分類や検索用のタグ';
comment on column ff_habits.user_goals.created_at is 'レコード作成日時';
comment on column ff_habits.user_goals.updated_at is 'レコード更新日時';

-- カラムコメント（goal_milestones）
comment on column ff_habits.goal_milestones.id is 'マイルストーンの一意識別子';
comment on column ff_habits.goal_milestones.goal_id is 'マイルストーンの所属するゴールID';
comment on column ff_habits.goal_milestones.title is 'マイルストーンのタイトル';
comment on column ff_habits.goal_milestones.description is 'マイルストーンの詳細説明';
comment on column ff_habits.goal_milestones.due_date is 'マイルストーンの期限';
comment on column ff_habits.goal_milestones.status is 'マイルストーンの状態';
comment on column ff_habits.goal_milestones.completion_date is 'マイルストーンの完了日';
comment on column ff_habits.goal_milestones.order_index is 'マイルストーンの表示順序';
comment on column ff_habits.goal_milestones.created_at is 'レコード作成日時';
comment on column ff_habits.goal_milestones.updated_at is 'レコード更新日時';

-- カラムコメント（goal_habits）
comment on column ff_habits.goal_habits.id is '目標-習慣の関連付けの一意識別子';
comment on column ff_habits.goal_habits.goal_id is '目標-習慣の関連付けの所属するゴールID';
comment on column ff_habits.goal_habits.habit_id is '目標-習慣の関連付けの所属する習慣ID';
comment on column ff_habits.goal_habits.relationship_type is '目標-習慣の関連付けの関連タイプ';
comment on column ff_habits.goal_habits.ai_suggestion_id is '目標-習慣の関連付けのAI提案との関連付け';
comment on column ff_habits.goal_habits.created_at is 'レコード作成日時';
comment on column ff_habits.goal_habits.updated_at is 'レコード更新日時';

-- カラムコメント（ai_suggestions）
comment on column ff_habits.ai_suggestions.id is 'AI提案の一意識別子';
comment on column ff_habits.ai_suggestions.user_id is 'AI提案の所有者ID';
comment on column ff_habits.ai_suggestions.suggestion_type is 'AI提案の提案タイプ';
comment on column ff_habits.ai_suggestions.original_input is 'ユーザーの入力';
comment on column ff_habits.ai_suggestions.suggested_content is 'AI提案内容';
comment on column ff_habits.ai_suggestions.status is 'AI提案の状態';
comment on column ff_habits.ai_suggestions.feedback is 'ユーザーからのフィードバック';
comment on column ff_habits.ai_suggestions.created_at is 'レコード作成日時';
comment on column ff_habits.ai_suggestions.updated_at is 'レコード更新日時';

-- カラムコメント（template_selections）
comment on column ff_habits.template_selections.id is 'テンプレート選択履歴の一意識別子';
comment on column ff_habits.template_selections.user_id is 'テンプレート選択履歴の所有者ID';
comment on column ff_habits.template_selections.template_type is 'テンプレート選択履歴のテンプレートタイプ';
comment on column ff_habits.template_selections.template_id is 'テンプレート選択履歴のテンプレートID';
comment on column ff_habits.template_selections.customizations is 'テンプレート選択履歴のテンプレートからの変更点';
comment on column ff_habits.template_selections.created_at is 'レコード作成日時';

-- インデックス
create index idx_goal_templates_category_id on ff_habits.goal_templates(category_id);
create index idx_goal_templates_metric_id on ff_habits.goal_templates(metric_id);

create index idx_user_goals_user_id on ff_habits.user_goals(user_id);
create index idx_user_goals_template_id on ff_habits.user_goals(template_id);
create index idx_user_goals_category_id on ff_habits.user_goals(category_id);
create index idx_user_goals_metric_id on ff_habits.user_goals(metric_id);
create index idx_user_goals_status on ff_habits.user_goals(status);
create index idx_user_goals_priority on ff_habits.user_goals(priority);
create index idx_user_goals_target_date on ff_habits.user_goals(target_date);
create index idx_user_goals_visibility on ff_habits.user_goals(visibility);

create index idx_goal_milestones_goal_id on ff_habits.goal_milestones(goal_id);
create index idx_goal_milestones_status on ff_habits.goal_milestones(status);
create index idx_goal_milestones_due_date on ff_habits.goal_milestones(due_date);

create index idx_goal_habits_goal on ff_habits.goal_habits(goal_id);
create index idx_goal_habits_habit on ff_habits.goal_habits(habit_id);

create index idx_ai_suggestions_user_type on ff_habits.ai_suggestions(user_id, suggestion_type);
create index idx_ai_suggestions_status on ff_habits.ai_suggestions(status);

create index idx_template_selections_user_type on ff_habits.template_selections(user_id, template_type);

-- トリガー
create trigger update_goal_templates_updated_at
    before update on ff_habits.goal_templates
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_user_goals_updated_at
    before update on ff_habits.user_goals
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_goal_milestones_updated_at
    before update on ff_habits.goal_milestones
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_goal_habits_updated_at
    before update on ff_habits.goal_habits
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_ai_suggestions_updated_at
    before update on ff_habits.ai_suggestions
    for each row
    execute function ff_users.update_updated_at_column();

-- 新しいインデックス
create index idx_goal_categories_parent_id on ff_habits.goal_categories(parent_id);
create index idx_goal_categories_is_active on ff_habits.goal_categories(is_active);
create index idx_goal_categories_display_order on ff_habits.goal_categories(display_order);

create index idx_metric_definitions_type on ff_habits.metric_definitions(type);
create index idx_metric_definitions_is_active on ff_habits.metric_definitions(is_active);

-- カテゴリーの初期データ
insert into ff_habits.goal_categories (name, description, icon, color, display_order) values
    ('learning', '学習に関する目標', '📚', '#4CAF50', 1),
    ('skill', 'スキル向上に関する目標', '🎯', '#2196F3', 2),
    ('project', 'プロジェクトに関する目標', '📋', '#9C27B0', 3),
    ('career', 'キャリアに関する目標', '💼', '#FF9800', 4),
    ('health', '健康に関する目標', '🏃', '#E91E63', 5),
    ('finance', '財務に関する目標', '💰', '#795548', 6),
    ('personal', '個人の成長に関する目標', '🌱', '#009688', 7),
    ('reading', '読書に関する目標', '📖', '#3F51B5', 8),
    ('language', '言語学習に関する目標', '🗣️', '#FF5722', 9),
    ('coding', 'プログラミングに関する目標', '💻', '#607D8B', 10);

-- メトリクス定義の初期データ
insert into ff_habits.metric_definitions (name, description, type, unit, default_target_value, min_value, max_value, measurement_frequency, calculation_method) values
    ('completion_percentage', '完了率', 'percentage', 'percent', 100, 0, 100, 'daily', 'last'),
    ('time_spent', '費やした時間', 'duration', 'minutes', 3600, 0, null, 'daily', 'sum'),
    ('task_count', 'タスク完了数', 'numeric', 'count', 10, 0, null, 'weekly', 'sum'),
    ('milestone_achieved', 'マイルストーン達成', 'boolean', null, 1, 0, 1, 'monthly', 'last'),
    ('pages_read', '読んだページ数', 'numeric', 'pages', 30, 0, null, 'daily', 'sum'),
    ('words_learned', '学習した単語数', 'numeric', 'words', 20, 0, null, 'daily', 'sum'),
    ('practice_sessions', '練習セッション数', 'numeric', 'sessions', 5, 0, null, 'weekly', 'sum'),
    ('code_lines', 'コード行数', 'numeric', 'lines', 100, 0, null, 'weekly', 'sum'),
    ('review_sessions', '復習セッション数', 'numeric', 'sessions', 3, 0, null, 'weekly', 'sum'),
    ('completion_streak', '連続達成日数', 'numeric', 'days', 7, 0, null, 'daily', 'last');

-- ゴールテンプレートの初期データ
insert into ff_habits.goal_templates (
    title,
    description,
    category_id,
    difficulty,
    estimated_duration,
    recommended_habits,
    metric_id,
    metric_target_value,
    tags,
    is_featured
) values
    (
        'プログラミング言語の基礎習得',
        '新しいプログラミング言語の基本構文、概念、ベストプラクティスを学習する',
        (select id from ff_habits.goal_categories where name = 'coding'),
        'medium',
        interval '3 months',
        '[{"name": "毎日のコーディング練習", "frequency": "daily", "duration": 30}, {"name": "公式ドキュメントの読書", "frequency": "weekly", "duration": 60}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'practice_sessions'),
        60,
        array['programming', 'learning', 'coding'],
        true
    ),
    (
        'テクニカルブック完読チャレンジ',
        '技術書を計画的に読破し、実践的な知識を身につける',
        (select id from ff_habits.goal_categories where name = 'reading'),
        'easy',
        interval '1 month',
        '[{"name": "毎日の読書時間確保", "frequency": "daily", "duration": 30}, {"name": "読書ノート作成", "frequency": "weekly", "duration": 45}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'pages_read'),
        300,
        array['reading', 'technical', 'self-improvement'],
        true
    ),
    (
        'TOEIC 800点達成',
        'TOEIC試験で800点以上のスコアを獲得する',
        (select id from ff_habits.goal_categories where name = 'language'),
        'hard',
        interval '6 months',
        '[{"name": "英単語学習", "frequency": "daily", "duration": 20}, {"name": "リスニング練習", "frequency": "daily", "duration": 30}, {"name": "模擬テスト受験", "frequency": "weekly", "duration": 120}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'words_learned'),
        1000,
        array['english', 'toeic', 'language-learning'],
        true
    ),
    (
        'オープンソースプロジェクトへの貢献',
        'GitHubで関心のあるオープンソースプロジェクトにコントリビュートする',
        (select id from ff_habits.goal_categories where name = 'project'),
        'medium',
        interval '2 months',
        '[{"name": "イシューの確認", "frequency": "daily", "duration": 15}, {"name": "コードレビュー", "frequency": "weekly", "duration": 60}, {"name": "PRの作成", "frequency": "weekly", "duration": 120}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'task_count'),
        5,
        array['opensource', 'github', 'collaboration'],
        true
    ),
    (
        'ポートフォリオプロジェクトの完成',
        '自分のスキルを効果的にアピールするポートフォリオサイトを作成する',
        (select id from ff_habits.goal_categories where name = 'career'),
        'medium',
        interval '1 month',
        '[{"name": "デザイン作業", "frequency": "daily", "duration": 45}, {"name": "コーディング", "frequency": "daily", "duration": 60}, {"name": "コンテンツ作成", "frequency": "weekly", "duration": 120}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_percentage'),
        100,
        array['portfolio', 'web-development', 'career'],
        true
    );

-- インデックスの追加
create index idx_goal_reflections_goal_id on ff_habits.goal_reflections(goal_id);
create index idx_goal_reflections_note_id on ff_habits.goal_reflections(note_id);
create index idx_goal_reflections_milestone_id on ff_habits.goal_reflections(milestone_id);
create index idx_goal_reflections_reflection_type on ff_habits.goal_reflections(reflection_type);

-- トリガーの追加
create trigger update_goal_reflections_updated_at
    before update on ff_habits.goal_reflections
    for each row
    execute function ff_users.update_updated_at_column(); 