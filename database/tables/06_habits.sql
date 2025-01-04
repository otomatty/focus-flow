-- ff_habitsスキーマの作成
create schema if not exists ff_habits;

-- 習慣テンプレートテーブル
create table if not exists ff_habits.habit_templates (
    id uuid primary key default uuid_generate_v4(),
    title text not null,                          -- 習慣のタイトル
    description text,                             -- 習慣の説明
    category text not null,                       -- カテゴリ（'health', 'learning', 'productivity', etc.）
    difficulty text default 'medium',             -- 難易度（'easy', 'medium', 'hard'）
    estimated_minutes integer,                    -- 推定所要時間（分）
    recommended_frequency jsonb not null default '{
        "type": "daily",
        "times_per_day": 1,
        "recommended_days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "time_of_day": ["morning"]
    }'::jsonb,
    benefits text[],                             -- 期待される効果
    tips text[],                                 -- 実践のためのヒント
    common_obstacles text[],                     -- よくある障害
    success_criteria jsonb,                      -- 成功の基準
    related_habits text[],                       -- 関連する習慣
    tags text[],                                 -- タグ
    is_featured boolean default false,           -- おすすめフラグ
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (difficulty in ('easy', 'medium', 'hard'))
);

-- ユーザーの習慣テーブル
create table if not exists ff_habits.user_habits (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    template_id uuid references ff_habits.habit_templates(id),
    goal_id uuid references ff_goals.user_goals(id),
    title text not null,
    description text,
    frequency jsonb not null default '{
        "type": "daily",
        "days": ["monday", "tuesday", "wednesday", "thursday", "friday"],
        "time_of_day": ["morning"],
        "reminder_times": []
    }'::jsonb,
    target_count integer default 1,              -- 1日あたりの目標回数
    current_streak integer default 0,            -- 現在の継続日数
    longest_streak integer default 0,            -- 最長継続日数
    total_completions integer default 0,         -- 合計完了回数
    status text default 'active',
    priority text default 'medium',
    start_date timestamp with time zone,
    target_end_date timestamp with time zone,    -- 目標終了日（任意）
    last_completed_at timestamp with time zone,
    completion_rate numeric(5,2) default 0,      -- 完了率（%）
    skip_dates timestamp with time zone[],       -- スキップする日付
    notes jsonb default '[]'::jsonb,            -- メモや振り返り
    visibility text default 'private',           -- 公開設定（'private', 'public', 'friends'）
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (status in ('active', 'completed', 'paused', 'archived')),
    check (priority in ('high', 'medium', 'low')),
    check (target_count > 0),
    check (completion_rate between 0 and 100),
    check (visibility in ('private', 'public', 'friends'))
);

-- 習慣の実施記録テーブル
create table if not exists ff_habits.habit_logs (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    user_id uuid references auth.users(id) not null,
    completed_at timestamp with time zone default now(),
    count integer default 1,                     -- 実施回数
    duration_minutes integer,                    -- 実施時間（分）
    difficulty_level text,                       -- 実施時の難易度感
    energy_level integer,                        -- エネルギーレベル（1-5）
    mood text,                                   -- 実施時の気分
    location text,                              -- 実施場所
    environment text[],                         -- 環境要因（'quiet', 'music', 'outside'等）
    obstacles text[],                           -- 直面した障害
    notes text,                                 -- メモ
    created_at timestamp with time zone default now(),
    check (count > 0),
    check (energy_level between 1 and 5),
    check (difficulty_level in ('easy', 'moderate', 'challenging'))
);

-- 習慣の統計テーブル
create table if not exists ff_habits.habit_stats (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    user_id uuid references auth.users(id) not null,
    date date not null,
    completion_count integer default 0,
    streak_count integer default 0,
    success_rate numeric(5,2) default 0,
    total_duration_minutes integer default 0,
    average_energy_level numeric(3,2),
    common_obstacles text[],
    common_environments text[],
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(habit_id, date)
);

-- 習慣のリマインダーテーブル
create table if not exists ff_habits.habit_reminders (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    user_id uuid references auth.users(id) not null,
    reminder_time time not null,
    days_of_week text[] not null,
    message text,
    is_enabled boolean default true,
    last_triggered_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- テーブルコメント
comment on table ff_habits.habit_templates is '習慣のテンプレートを管理するテーブル';
comment on table ff_habits.user_habits is 'ユーザーの個別習慣を管理するテーブル';
comment on table ff_habits.habit_logs is '習慣の実施記録を管理するテーブル';
comment on table ff_habits.habit_stats is '習慣の統計情報を管理するテーブル';
comment on table ff_habits.habit_reminders is '習慣のリマインダーを管理するテーブル';

-- カラムコメント（habit_templates）
comment on column ff_habits.habit_templates.id is '習慣テンプレートの一意識別子';
comment on column ff_habits.habit_templates.title is '習慣テンプレートのタイトル';
comment on column ff_habits.habit_templates.description is '習慣テンプレートの説明';
comment on column ff_habits.habit_templates.category is '習慣のカテゴリ';
comment on column ff_habits.habit_templates.difficulty is '習慣の難易度';
comment on column ff_habits.habit_templates.estimated_minutes is '推定所要時間（分）';
comment on column ff_habits.habit_templates.recommended_frequency is '推奨される実施頻度';
comment on column ff_habits.habit_templates.benefits is '期待される効果のリスト';
comment on column ff_habits.habit_templates.tips is '実践のためのヒント';
comment on column ff_habits.habit_templates.common_obstacles is 'よくある障害のリスト';
comment on column ff_habits.habit_templates.success_criteria is '習慣の成功基準';
comment on column ff_habits.habit_templates.related_habits is '関連する習慣のリスト';
comment on column ff_habits.habit_templates.tags is '習慣の分類や検索用のタグ';
comment on column ff_habits.habit_templates.is_featured is 'おすすめフラグ';
comment on column ff_habits.habit_templates.created_at is 'レコード作成日時';
comment on column ff_habits.habit_templates.updated_at is 'レコード更新日時';

-- カラムコメント（user_habits）
comment on column ff_habits.user_habits.id is 'ユーザー習慣の一意識別子';
comment on column ff_habits.user_habits.user_id is '習慣の所有者ID';
comment on column ff_habits.user_habits.template_id is '参照元の習慣テンプレートID';
comment on column ff_habits.user_habits.goal_id is '関連するゴールID';
comment on column ff_habits.user_habits.title is '習慣のタイトル';
comment on column ff_habits.user_habits.description is '習慣の説明';
comment on column ff_habits.user_habits.frequency is '実施頻度の設定';
comment on column ff_habits.user_habits.target_count is '1日あたりの目標実施回数';
comment on column ff_habits.user_habits.current_streak is '現在の継続日数';
comment on column ff_habits.user_habits.longest_streak is '最長継続日数';
comment on column ff_habits.user_habits.total_completions is '合計完了回数';
comment on column ff_habits.user_habits.status is '習慣の現在の状態';
comment on column ff_habits.user_habits.priority is '習慣の優先度';
comment on column ff_habits.user_habits.start_date is '開始日';
comment on column ff_habits.user_habits.target_end_date is '目標終了日';
comment on column ff_habits.user_habits.last_completed_at is '最後に完了した日時';
comment on column ff_habits.user_habits.completion_rate is '完了率（%）';
comment on column ff_habits.user_habits.skip_dates is 'スキップする日付のリスト';
comment on column ff_habits.user_habits.notes is 'メモや振り返り';
comment on column ff_habits.user_habits.visibility is '習慣の公開設定';
comment on column ff_habits.user_habits.created_at is 'レコード作成日時';
comment on column ff_habits.user_habits.updated_at is 'レコード更新日時';

-- カラムコメント（habit_logs）
comment on column ff_habits.habit_logs.id is '実施記録の一意識別子';
comment on column ff_habits.habit_logs.habit_id is '対象の習慣ID';
comment on column ff_habits.habit_logs.user_id is '実施したユーザーID';
comment on column ff_habits.habit_logs.completed_at is '完了日時';
comment on column ff_habits.habit_logs.count is '実施回数';
comment on column ff_habits.habit_logs.duration_minutes is '実施時間（分）';
comment on column ff_habits.habit_logs.difficulty_level is '実施時の難易度感';
comment on column ff_habits.habit_logs.energy_level is 'エネルギーレベル（1-5）';
comment on column ff_habits.habit_logs.mood is '実施時の気分';
comment on column ff_habits.habit_logs.location is '実施場所';
comment on column ff_habits.habit_logs.environment is '環境要因のリスト';
comment on column ff_habits.habit_logs.obstacles is '直面した障害のリスト';
comment on column ff_habits.habit_logs.notes is 'メモ';
comment on column ff_habits.habit_logs.created_at is 'レコード作成日時';

-- カラムコメント（habit_stats）
comment on column ff_habits.habit_stats.id is '統計情報の一意識別子';
comment on column ff_habits.habit_stats.habit_id is '対象の習慣ID';
comment on column ff_habits.habit_stats.user_id is 'ユーザーID';
comment on column ff_habits.habit_stats.date is '統計対象日';
comment on column ff_habits.habit_stats.completion_count is '完了回数';
comment on column ff_habits.habit_stats.streak_count is '継続日数';
comment on column ff_habits.habit_stats.success_rate is '成功率（%）';
comment on column ff_habits.habit_stats.total_duration_minutes is '合計実施時間（分）';
comment on column ff_habits.habit_stats.average_energy_level is '平均エネルギーレベル';
comment on column ff_habits.habit_stats.common_obstacles is 'よくある障害のリスト';
comment on column ff_habits.habit_stats.common_environments is 'よくある環境要因のリスト';
comment on column ff_habits.habit_stats.created_at is 'レコード作成日時';
comment on column ff_habits.habit_stats.updated_at is 'レコード更新日時';

-- カラムコメント（habit_reminders）
comment on column ff_habits.habit_reminders.id is 'リマインダーの一意識別子';
comment on column ff_habits.habit_reminders.habit_id is '対象の習慣ID';
comment on column ff_habits.habit_reminders.user_id is 'ユーザーID';
comment on column ff_habits.habit_reminders.reminder_time is 'リマインド時刻';
comment on column ff_habits.habit_reminders.days_of_week is 'リマインドする曜日のリスト';
comment on column ff_habits.habit_reminders.message is 'カスタムメッセージ';
comment on column ff_habits.habit_reminders.is_enabled is '有効/無効フラグ';
comment on column ff_habits.habit_reminders.last_triggered_at is '最後にリマインドした日時';
comment on column ff_habits.habit_reminders.created_at is 'レコード作成日時';
comment on column ff_habits.habit_reminders.updated_at is 'レコード更新日時';

-- インデックス
create index idx_habit_templates_category on ff_habits.habit_templates(category);
create index idx_habit_templates_featured on ff_habits.habit_templates(is_featured) where is_featured = true;

create index idx_user_habits_user_id on ff_habits.user_habits(user_id);
create index idx_user_habits_template_id on ff_habits.user_habits(template_id);
create index idx_user_habits_goal_id on ff_habits.user_habits(goal_id);
create index idx_user_habits_status on ff_habits.user_habits(status);
create index idx_user_habits_start_date on ff_habits.user_habits(start_date);
create index idx_user_habits_visibility on ff_habits.user_habits(visibility);

create index idx_habit_logs_habit_id on ff_habits.habit_logs(habit_id);
create index idx_habit_logs_user_id on ff_habits.habit_logs(user_id);
create index idx_habit_logs_completed_at on ff_habits.habit_logs(completed_at);

create index idx_habit_stats_habit_id_date on ff_habits.habit_stats(habit_id, date);
create index idx_habit_stats_user_id on ff_habits.habit_stats(user_id);

create index idx_habit_reminders_habit_id on ff_habits.habit_reminders(habit_id);
create index idx_habit_reminders_user_id on ff_habits.habit_reminders(user_id);

-- トリガー
create trigger update_habit_templates_updated_at
    before update on ff_habits.habit_templates
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_user_habits_updated_at
    before update on ff_habits.user_habits
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_stats_updated_at
    before update on ff_habits.habit_stats
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_reminders_updated_at
    before update on ff_habits.habit_reminders
    for each row
    execute function ff_users.update_updated_at_column(); 