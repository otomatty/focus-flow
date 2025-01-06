-- 追加のゴールテンプレートデータ
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
    -- 健康カテゴリー
    (
        '毎日10,000歩ウォーキング習慣',
        '健康維持と体重管理のために毎日10,000歩の歩行を達成する',
        (select id from ff_habits.goal_categories where name = 'health'),
        'easy',
        interval '3 months',
        '[{"name": "朝のウォーキング", "frequency": "daily", "duration": 30}, {"name": "夜のストレッチ", "frequency": "daily", "duration": 15}, {"name": "週末のロングウォーク", "frequency": "weekly", "duration": 90}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_streak'),
        30,
        array['health', 'exercise', 'walking'],
        true
    ),
    (
        '週3回の筋力トレーニング',
        '基礎的な筋力をつけ、体型を改善する',
        (select id from ff_habits.goal_categories where name = 'health'),
        'medium',
        interval '6 months',
        '[{"name": "自重トレーニング", "frequency": "daily", "duration": 45}, {"name": "プロテイン摂取", "frequency": "daily", "duration": 5}, {"name": "体重・体脂肪率記録", "frequency": "weekly", "duration": 10}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'practice_sessions'),
        72,
        array['fitness', 'strength', 'workout'],
        true
    ),
    -- 財務カテゴリー
    (
        '月の支出20%削減',
        '不要な支出を見直し、月々の支出を20%削減する',
        (select id from ff_habits.goal_categories where name = 'finance'),
        'medium',
        interval '3 months',
        '[{"name": "家計簿記録", "frequency": "daily", "duration": 10}, {"name": "支出分析", "frequency": "weekly", "duration": 30}, {"name": "予算見直し", "frequency": "monthly", "duration": 60}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_percentage'),
        20,
        array['finance', 'saving', 'budget'],
        true
    ),
    (
        '緊急資金の確保',
        '6ヶ月分の生活費を緊急資金として貯蓄する',
        (select id from ff_habits.goal_categories where name = 'finance'),
        'hard',
        interval '12 months',
        '[{"name": "自動貯金設定", "frequency": "monthly", "duration": 15}, {"name": "支出最適化", "frequency": "weekly", "duration": 30}, {"name": "収入源の検討", "frequency": "monthly", "duration": 60}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_percentage'),
        100,
        array['savings', 'emergency-fund', 'financial-security'],
        true
    ),
    -- 個人の成長カテゴリー
    (
        'マインドフルネス習慣の確立',
        '毎日の瞑想を通じてストレス管理とメンタルヘルスを改善する',
        (select id from ff_habits.goal_categories where name = 'personal'),
        'easy',
        interval '2 months',
        '[{"name": "朝の瞑想", "frequency": "daily", "duration": 15}, {"name": "感謝日記", "frequency": "daily", "duration": 10}, {"name": "呼吸エクササイズ", "frequency": "daily", "duration": 5}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'time_spent'),
        1800,
        array['mindfulness', 'meditation', 'mental-health'],
        true
    ),
    (
        'デジタルデトックスの実践',
        'スマートフォンの使用時間を削減し、より質の高い時間の使い方を実現する',
        (select id from ff_habits.goal_categories where name = 'personal'),
        'medium',
        interval '1 month',
        '[{"name": "スマホフリータイム設定", "frequency": "daily", "duration": 120}, {"name": "オフライン活動", "frequency": "daily", "duration": 60}, {"name": "使用時間振り返り", "frequency": "weekly", "duration": 15}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_percentage'),
        50,
        array['digital-wellbeing', 'productivity', 'lifestyle'],
        false
    ),
    -- スキルカテゴリー
    (
        'プレゼンテーションスキル向上',
        '効果的なプレゼンテーションを行うためのスキルを習得する',
        (select id from ff_habits.goal_categories where name = 'skill'),
        'medium',
        interval '3 months',
        '[{"name": "スピーチ練習", "frequency": "daily", "duration": 20}, {"name": "プレゼン資料作成", "frequency": "weekly", "duration": 60}, {"name": "フィードバック収集", "frequency": "weekly", "duration": 30}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'practice_sessions'),
        24,
        array['presentation', 'public-speaking', 'communication'],
        true
    ),
    (
        'タイムマネジメント習得',
        '効率的な時間管理手法を学び、実践する',
        (select id from ff_habits.goal_categories where name = 'skill'),
        'medium',
        interval '2 months',
        '[{"name": "タスク優先順位付け", "frequency": "daily", "duration": 15}, {"name": "ポモドーロテクニック", "frequency": "daily", "duration": 120}, {"name": "週次レビュー", "frequency": "weekly", "duration": 30}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_percentage'),
        100,
        array['time-management', 'productivity', 'organization'],
        true
    ),
    -- 学習カテゴリー
    (
        'オンライン講座修了',
        '選択したオンライン講座を計画的に受講し、修了証を取得する',
        (select id from ff_habits.goal_categories where name = 'learning'),
        'medium',
        interval '3 months',
        '[{"name": "講座視聴", "frequency": "daily", "duration": 45}, {"name": "演習問題", "frequency": "daily", "duration": 30}, {"name": "復習セッション", "frequency": "weekly", "duration": 60}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'completion_percentage'),
        100,
        array['online-learning', 'education', 'self-study'],
        true
    ),
    (
        '新しい趣味の習得',
        '興味のある分野で新しい趣味を見つけ、基礎スキルを習得する',
        (select id from ff_habits.goal_categories where name = 'learning'),
        'easy',
        interval '3 months',
        '[{"name": "基礎練習", "frequency": "daily", "duration": 30}, {"name": "オンラインチュートリアル", "frequency": "weekly", "duration": 60}, {"name": "コミュニティ参加", "frequency": "monthly", "duration": 120}]'::jsonb,
        (select id from ff_habits.metric_definitions where name = 'practice_sessions'),
        36,
        array['hobby', 'creativity', 'personal-development'],
        false
    );