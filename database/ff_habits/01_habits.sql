-- ff_habitsスキーマの作成
create schema if not exists ff_habits;

-- 習慣カテゴリテーブル
create table if not exists ff_habits.habit_categories (
    id uuid primary key default uuid_generate_v4(),
    name text not null,                           -- カテゴリ名
    description text,                             -- カテゴリの説明
    icon text,                                    -- アイコン
    color text,                                   -- カラーコード
    parent_id uuid references ff_habits.habit_categories(id), -- 親カテゴリ
    display_order integer default 0,              -- 表示順
    is_active boolean default true,               -- アクティブ状態
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(name)
);

-- 習慣テンプレートテーブル
create table if not exists ff_habits.habit_templates (
    id uuid primary key default uuid_generate_v4(),
    title text not null,                          -- 具体的な最小行動（例：「靴を玄関に置く」）
    description text,                             -- 習慣の説明
    category_id uuid references ff_habits.habit_categories(id) not null, -- カテゴリ
    identity_label text,                          -- なりたい自分（例：「整理整頓が得意な人」）
    expected_outcome text,                        -- 期待される結果
    implementation_intention_template text,        -- 実装意図のテンプレート（"When [X], I will [Y]"形式）
    setup_guideline jsonb default '{
        "environment": [],                        
        "reminders": [],                        
        "tracking": []                            
    }'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- ユーザーの習慣テーブル
create table if not exists ff_habits.user_habits (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    template_id uuid references ff_habits.habit_templates(id),
    category_id uuid references ff_habits.habit_categories(id) not null,
    title text not null,                          -- 具体的な最小行動
    description text,                             -- 個人的なメモや補足
    identity_statement text,                      -- アイデンティティステートメント
    implementation_intention text,                -- 個人化された実装意図
    stack_after_habit_id uuid references ff_habits.user_habits(id), -- 習慣の積み重ね
    status text default 'active',
    visibility text default 'private',
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (status in ('active', 'completed', 'paused', 'archived')),
    check (visibility in ('public', 'followers', 'private'))
);

-- 習慣の頻度設定テーブル
create table if not exists ff_habits.habit_frequencies (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    type text not null,                          -- daily, weekly, monthly, custom
    days_of_week text[],                         -- 曜日指定（weekly用）
    days_of_month integer[],                     -- 日付指定（monthly用）
    custom_pattern text,                         -- カスタムパターン（cron形式）
    time_windows jsonb[] not null default array[]::jsonb[], -- 時間帯設定
    timezone text not null default 'UTC',        -- タイムゾーン
    start_date date,                             -- 開始日
    end_date date,                               -- 終了日（任意）
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (type in ('daily', 'weekly', 'monthly', 'custom')),
    check (
        (type = 'daily') or
        (type = 'weekly' and days_of_week is not null) or
        (type = 'monthly' and days_of_month is not null) or
        (type = 'custom' and custom_pattern is not null)
    )
);

-- 習慣のきっかけ（cue）テーブル
create table if not exists ff_habits.habit_cues (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    type text not null,                          -- time, location, preceding_action, emotional_state, context
    name text not null,                          -- きっかけの名前
    description text,                            -- 詳細説明
    conditions jsonb not null,                   -- きっかけの条件
    priority integer default 1,                  -- 優先度（複数のきっかけがある場合）
    is_active boolean default true,              -- アクティブ状態
    effectiveness_score numeric(3,2) default 0,   -- 有効性スコア（0-5）
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    check (type in ('time', 'location', 'preceding_action', 'emotional_state', 'context')),
    check (effectiveness_score between 0 and 5)
);

-- 習慣の進捗テーブル
create table if not exists ff_habits.habit_progress (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    current_streak integer default 0,             -- 現在の継続日数
    longest_streak integer default 0,             -- 最長継続日数
    total_completions integer default 0,          -- 合計完了回数
    success_rate numeric(5,2) default 0,          -- 成功率
    last_completed_at timestamp with time zone,   -- 最終完了日時
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(habit_id)
);

-- 習慣の実施記録テーブル
create table if not exists ff_habits.habit_logs (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    user_id uuid references auth.users(id) not null,
    completed_at timestamp with time zone default now(),
    quality_score integer,                        -- 総合的な実施の質（1-5）
    exp_gained integer default 0,                -- 獲得経験値
    created_at timestamp with time zone default now(),
    check (quality_score between 1 and 5)
);

-- 習慣の振り返りテーブル
create table if not exists ff_habits.habit_reflections (
    id uuid primary key default uuid_generate_v4(),
    habit_id uuid references ff_habits.user_habits(id) not null,
    week_start_date date not null,                -- 振り返り対象週の開始日
    scores jsonb not null default '{
        "identity_alignment": null,              
        "difficulty": null,                      
        "satisfaction": null,                   
        "motivation": null                       
    }'::jsonb,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    unique(habit_id, week_start_date),
    check (
        (scores->>'identity_alignment')::integer between 1 and 5 and
        (scores->>'difficulty')::integer between 1 and 5 and
        (scores->>'satisfaction')::integer between 1 and 5 and
        (scores->>'motivation')::integer between 1 and 5
    )
);

-- 振り返り集計ビューの作成
create or replace view ff_habits.habit_reflection_stats as
select
    habit_id,
    avg((scores->>'identity_alignment')::integer) as avg_identity_alignment,
    avg((scores->>'difficulty')::integer) as avg_difficulty,
    avg((scores->>'satisfaction')::integer) as avg_satisfaction,
    avg((scores->>'motivation')::integer) as avg_motivation
from ff_habits.habit_reflections
group by habit_id;

-- RLSポリシーの設定
alter table ff_habits.user_habits enable row level security;
alter table ff_habits.habit_logs enable row level security;
alter table ff_habits.habit_progress enable row level security;
alter table ff_habits.habit_reflections enable row level security;

-- 習慣の基本ポリシー
create policy "Users can view habits"
    on ff_habits.user_habits
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

create policy "Users can insert their own habits"
    on ff_habits.user_habits
    for insert
    with check (auth.uid() = user_id);

create policy "Users can update their own habits"
    on ff_habits.user_habits
    for update
    using (auth.uid() = user_id);

create policy "Users can delete their own habits"
    on ff_habits.user_habits
    for delete
    using (auth.uid() = user_id);

-- 習慣ログのポリシー
create policy "Users can view habit logs"
    on ff_habits.habit_logs
    for select
    using (
        exists (
            select 1 from ff_habits.user_habits
            where id = habit_id
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

create policy "Users can manage their habit logs"
    on ff_habits.habit_logs
    for all
    using (
        exists (
            select 1 from ff_habits.user_habits
            where id = habit_id
            and user_id = auth.uid()
        )
    );

-- 習慣進捗のポリシー
create policy "Users can view habit progress"
    on ff_habits.habit_progress
    for select
    using (
        exists (
            select 1 from ff_habits.user_habits
            where id = habit_id
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

create policy "System can manage habit progress"
    on ff_habits.habit_progress
    for all
    using (true);

-- 振り返りのポリシー
create policy "Users can view habit reflections"
    on ff_habits.habit_reflections
    for select
    using (
        exists (
            select 1 from ff_habits.user_habits
            where id = habit_id
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

create policy "Users can manage their habit reflections"
    on ff_habits.habit_reflections
    for all
    using (
        exists (
            select 1 from ff_habits.user_habits
            where id = habit_id
            and user_id = auth.uid()
        )
    );

-- インデックス
create index idx_habit_categories_parent_id on ff_habits.habit_categories(parent_id);
create index idx_habit_categories_is_active on ff_habits.habit_categories(is_active);

create index idx_habit_frequencies_habit_id on ff_habits.habit_frequencies(habit_id);
create index idx_habit_frequencies_type on ff_habits.habit_frequencies(type);
create index idx_habit_frequencies_start_date on ff_habits.habit_frequencies(start_date);

create index idx_habit_cues_habit_id on ff_habits.habit_cues(habit_id);
create index idx_habit_cues_type on ff_habits.habit_cues(type);
create index idx_habit_cues_is_active on ff_habits.habit_cues(is_active);

create index idx_habit_templates_category on ff_habits.habit_templates(category_id);
create index idx_user_habits_user_id on ff_habits.user_habits(user_id);
create index idx_user_habits_template_id on ff_habits.user_habits(template_id);
create index idx_user_habits_stack_after_habit_id on ff_habits.user_habits(stack_after_habit_id);
create index idx_user_habits_status on ff_habits.user_habits(status);
create index idx_user_habits_visibility on ff_habits.user_habits(visibility);

create index idx_habit_progress_habit_id on ff_habits.habit_progress(habit_id);
create index idx_habit_progress_last_completed_at on ff_habits.habit_progress(last_completed_at);

create index idx_habit_logs_habit_id on ff_habits.habit_logs(habit_id);
create index idx_habit_logs_user_id on ff_habits.habit_logs(user_id);
create index idx_habit_logs_completed_at on ff_habits.habit_logs(completed_at);

create index idx_habit_reflections_habit_id on ff_habits.habit_reflections(habit_id);
create index idx_habit_reflections_week_start_date on ff_habits.habit_reflections(week_start_date);

-- トリガー
create trigger update_habit_categories_updated_at
    before update on ff_habits.habit_categories
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_frequencies_updated_at
    before update on ff_habits.habit_frequencies
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_cues_updated_at
    before update on ff_habits.habit_cues
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_templates_updated_at
    before update on ff_habits.habit_templates
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_user_habits_updated_at
    before update on ff_habits.user_habits
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_progress_updated_at
    before update on ff_habits.habit_progress
    for each row
    execute function ff_users.update_updated_at_column();

create trigger update_habit_reflections_updated_at
    before update on ff_habits.habit_reflections
    for each row
    execute function ff_users.update_updated_at_column(); 

-- 経験値計算関数
create or replace function ff_habits.calculate_habit_exp(
    p_habit_id uuid,
    p_quality_score integer,
    p_current_streak integer
)
returns integer
language plpgsql
security definer
as $$
declare
    base_exp integer := 10;  -- 基本経験値
    streak_bonus integer;    -- 継続ボーナス
    quality_bonus integer;   -- 品質ボーナス
begin
    -- 継続ボーナスの計算（7日ごとに追加ボーナス）
    streak_bonus := (p_current_streak / 7) * 5;
    if streak_bonus > 50 then  -- 最大ボーナスを制限
        streak_bonus := 50;
    end if;

    -- 実施品質に基づくボーナス
    quality_bonus := (coalesce(p_quality_score, 3) - 1) * 5;

    return base_exp + streak_bonus + quality_bonus;
end;
$$;

-- 経験値付与トリガー関数
create or replace function ff_habits.grant_habit_exp()
returns trigger
language plpgsql
security definer
as $$
declare
    v_current_streak integer;
    v_exp integer;
begin
    -- 現在の継続日数を取得
    select current_streak into v_current_streak
    from ff_habits.habit_progress
    where habit_id = NEW.habit_id;

    -- 経験値を計算
    v_exp := ff_habits.calculate_habit_exp(
        NEW.habit_id,
        NEW.quality_score,
        coalesce(v_current_streak, 0)
    );

    -- 経験値を記録
    NEW.exp_gained := v_exp;

    -- ユーザーの経験値を更新
    insert into ff_gamification.user_levels (user_id, current_level, current_exp, total_exp)
    values (NEW.user_id, 1, v_exp, v_exp)
    on conflict (user_id)
    do update set
        total_exp = ff_gamification.user_levels.total_exp + v_exp,
        current_exp = ff_gamification.user_levels.current_exp + v_exp;

    return NEW;
end;
$$;

-- 経験値付与トリガーの設定
create trigger grant_habit_exp_trigger
    before insert on ff_habits.habit_logs
    for each row
    execute function ff_habits.grant_habit_exp(); 

-- カテゴリーの初期データ
insert into ff_habits.habit_categories (name, description, icon, color, display_order) values
    -- メインカテゴリー
    ('morning_routine', '朝の習慣作り', '🌅', '#FF9800', 10),
    ('evening_routine', '夜の習慣作り', '🌙', '#3F51B5', 20),
    ('health', '健康的な習慣', '💪', '#4CAF50', 30),
    ('productivity', '生産性向上', '⚡', '#2196F3', 40),
    ('learning', '学習習慣', '📚', '#9C27B0', 50),
    ('mindfulness', 'マインドフルネス', '🧘', '#E91E63', 60),
    ('social', '社会性・人間関係', '🤝', '#795548', 70),
    ('creativity', '創造性', '🎨', '#607D8B', 80);

-- サブカテゴリー：朝の習慣
insert into ff_habits.habit_categories (name, description, icon, color, parent_id, display_order) values
    ('morning_exercise', '朝の運動習慣', '🏃', '#FF9800', 
        (select id from ff_habits.habit_categories where name = 'morning_routine'), 11),
    ('morning_planning', '朝の計画立て', '📝', '#FF9800', 
        (select id from ff_habits.habit_categories where name = 'morning_routine'), 12);

-- サブカテゴリー：健康
insert into ff_habits.habit_categories (name, description, icon, color, parent_id, display_order) values
    ('exercise', '運動習慣', '🏋️', '#4CAF50', 
        (select id from ff_habits.habit_categories where name = 'health'), 31),
    ('nutrition', '食事管理', '🥗', '#4CAF50', 
        (select id from ff_habits.habit_categories where name = 'health'), 32),
    ('sleep', '睡眠管理', '😴', '#4CAF50', 
        (select id from ff_habits.habit_categories where name = 'health'), 33);

-- サブカテゴリー：生産性
insert into ff_habits.habit_categories (name, description, icon, color, parent_id, display_order) values
    ('time_management', '時間管理', '⏰', '#2196F3', 
        (select id from ff_habits.habit_categories where name = 'productivity'), 41),
    ('focus', '集中力向上', '🎯', '#2196F3', 
        (select id from ff_habits.habit_categories where name = 'productivity'), 42),
    ('organization', '整理整頓', '📋', '#2196F3', 
        (select id from ff_habits.habit_categories where name = 'productivity'), 43);

-- 習慣テンプレートの初期データ
insert into ff_habits.habit_templates (
    title,
    description,
    category_id,
    identity_label,
    expected_outcome,
    implementation_intention_template,
    setup_guideline
) values
    -- 朝の習慣
    (
        '朝の5分間瞑想',
        '朝一番に5分間の瞑想を行い、一日を穏やかにスタートする',
        (select id from ff_habits.habit_categories where name = 'morning_routine'),
        'マインドフルな生活を送る人',
        '朝から落ち着いた状態で一日をスタートでき、ストレス耐性が向上する',
        'When I wake up and sit on my bed, I will meditate for 5 minutes',
        '{
            "environment": [
                "瞑想用のクッションを用意する",
                "静かな場所を確保する",
                "スマートフォンをサイレントモードにする"
            ],
            "reminders": [
                "目覚まし時計の5分後に瞑想リマインダーを設定する",
                "瞑想アプリをインストールする"
            ],
            "tracking": [
                "瞑想アプリで記録する",
                "習慣トラッカーにチェックを入れる"
            ]
        }'::jsonb
    ),
    (
        '朝の水分補給',
        '起床後すぐにコップ1杯の水を飲む',
        (select id from ff_habits.habit_categories where name = 'morning_routine'),
        '健康を大切にする人',
        '代謝が活性化され、一日を活力的にスタートできる',
        'When I wake up, I will drink a glass of water before doing anything else',
        '{
            "environment": [
                "ベッドサイドに水とコップを用意する",
                "水筒や専用ボトルを準備する"
            ],
            "reminders": [
                "コップを目につく場所に置く",
                "スマートフォンのリマインダーを設定する"
            ],
            "tracking": [
                "習慣トラッカーにチェックを入れる",
                "水分摂取量を記録する"
            ]
        }'::jsonb
    ),
    -- 健康習慣
    (
        '就寝前のストレッチ',
        '就寝前に5分間の簡単なストレッチを行い、体をリラックスさせる',
        (select id from ff_habits.habit_categories where name = 'health'),
        '体のケアを大切にする人',
        '質の良い睡眠が取れ、翌朝の目覚めが改善される',
        'After I brush my teeth at night, I will do stretching for 5 minutes',
        '{
            "environment": [
                "ストレッチマットを用意する",
                "ストレッチ手順を壁に貼る",
                "快適な室温を設定する"
            ],
            "reminders": [
                "就寝30分前にリマインダーを設定する",
                "ストレッチ用のタイマーを設定する"
            ],
            "tracking": [
                "習慣トラッカーにチェックを入れる",
                "体の柔軟性の変化を記録する"
            ]
        }'::jsonb
    ),
    -- 生産性習慣
    (
        'デイリープランニング',
        '毎朝10分間、その日のタスクと優先順位を整理する',
        (select id from ff_habits.habit_categories where name = 'productivity'),
        '計画的に行動する人',
        '一日の優先順位が明確になり、効率的なタスク管理ができる',
        'After I finish breakfast, I will plan my day for 10 minutes',
        '{
            "environment": [
                "プランナーやノートを用意する",
                "静かな作業スペースを確保する",
                "タスク管理アプリを準備する"
            ],
            "reminders": [
                "朝食後にリマインダーを設定する",
                "プランニングの時間をカレンダーにブロックする"
            ],
            "tracking": [
                "プランニングの実施をチェックする",
                "タスクの完了率を記録する"
            ]
        }'::jsonb
    ),
    -- 学習習慣
    (
        '毎日の読書時間',
        '毎日20分間、目的を持って読書をする',
        (select id from ff_habits.habit_categories where name = 'learning'),
        '継続的に学ぶ人',
        '知識が増え、集中力と理解力が向上する',
        'When I sit on my favorite reading chair, I will read for 20 minutes',
        '{
            "environment": [
                "読書スペースを整える",
                "読みたい本を手の届く場所に置く",
                "快適な照明を用意する"
            ],
            "reminders": [
                "読書時間をカレンダーに設定する",
                "本を目につく場所に置く"
            ],
            "tracking": [
                "読書時間を記録する",
                "読んだページ数を記録する",
                "学んだことをノートに記録する"
            ]
        }'::jsonb
    ); 