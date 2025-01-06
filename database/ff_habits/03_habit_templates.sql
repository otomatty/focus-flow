-- 追加の習慣テンプレート
insert into ff_habits.habit_templates (
    title,
    description,
    category_id,
    identity_label,
    expected_outcome,
    implementation_intention_template,
    setup_guideline
) values
    -- 夜の習慣
    (
        'デジタルデトックスタイム',
        '就寝1時間前にすべての電子機器の使用を終了する',
        (select id from ff_habits.habit_categories where name = 'evening_routine'),
        '質の高い睡眠を大切にする人',
        '睡眠の質が向上し、翌朝の目覚めが改善される',
        'When it becomes 9 PM, I will turn off all electronic devices',
        '{
            "environment": [
                "電子機器を寝室に持ち込まない",
                "就寝時間を決める",
                "リラックスできる照明を用意する"
            ],
            "reminders": [
                "就寝1時間前にアラームを設定する",
                "電子機器をサイレントモードにする"
            ],
            "tracking": [
                "就寝時間を記録する",
                "睡眠の質を評価する"
            ]
        }'::jsonb
    ),
    -- 運動習慣
    (
        '朝のクイックエクササイズ',
        '朝一番に7分間の高強度インターバルトレーニングを行う',
        (select id from ff_habits.habit_categories where name = 'exercise'),
        '活動的なライフスタイルを送る人',
        '基礎代謝が上がり、一日中エネルギッシュに過ごせる',
        'After I wake up and change into workout clothes, I will do a 7-minute workout',
        '{
            "environment": [
                "運動着を前日に用意する",
                "トレーニングスペースを確保する",
                "運動マットを用意する"
            ],
            "reminders": [
                "運動着を目につく場所に置く",
                "7分間ワークアウトアプリを使用する"
            ],
            "tracking": [
                "運動の種類と強度を記録する",
                "体調の変化を記録する"
            ]
        }'::jsonb
    ),
    -- 栄養管理
    (
        '食事の写真記録',
        '毎食前に食事の写真を撮り、栄養バランスを意識する',
        (select id from ff_habits.habit_categories where name = 'nutrition'),
        '健康的な食生活を送る人',
        '食事の内容を可視化し、栄養バランスの改善につながる',
        'Before I start eating, I will take a photo of my meal',
        '{
            "environment": [
                "スマートフォンを手の届く場所に置く",
                "食事記録アプリをインストールする",
                "適切な照明を確保する"
            ],
            "reminders": [
                "食事時間にリマインダーを設定する",
                "アプリの通知を有効にする"
            ],
            "tracking": [
                "食事内容を記録する",
                "栄養バランスを評価する",
                "気づきや改善点をメモする"
            ]
        }'::jsonb
    ),
    -- 集中力向上
    (
        'ポモドーロテクニック',
        '25分の集中作業と5分の休憩を繰り返す',
        (select id from ff_habits.habit_categories where name = 'focus'),
        '効率的に作業をこなす人',
        '集中力が向上し、作業効率が上がる',
        'When I start my work, I will set a 25-minute timer and focus until it rings',
        '{
            "environment": [
                "タイマーを用意する",
                "作業スペースを整える",
                "通知をオフにする"
            ],
            "reminders": [
                "作業開始時にタイマーをセットする",
                "休憩時間を必ず取る"
            ],
            "tracking": [
                "ポモドーロの回数を記録する",
                "タスクの完了状況を記録する"
            ]
        }'::jsonb
    ),
    -- マインドフルネス
    (
        '食事の瞑想',
        '食事中は食べることに集中し、味わいながらゆっくり食べる',
        (select id from ff_habits.habit_categories where name = 'mindfulness'),
        'マインドフルに生活する人',
        '食事を楽しみ、消化が改善され、過食を防ぐ',
        'When I sit down to eat, I will focus on my food and eat slowly',
        '{
            "environment": [
                "テレビやスマートフォンを片付ける",
                "適切な照明を設定する",
                "快適な食事空間を作る"
            ],
            "reminders": [
                "食事前に深呼吸をする",
                "箸を置く時間を意識する"
            ],
            "tracking": [
                "食事時間を記録する",
                "満腹感や消化の状態を記録する"
            ]
        }'::jsonb
    ),
    -- 社会性
    (
        '感謝の表現',
        '毎日一人に感謝の気持ちを伝える',
        (select id from ff_habits.habit_categories where name = 'social'),
        '感謝の気持ちを大切にする人',
        '人間関係が深まり、ポジティブな環境が作られる',
        'Before I go to bed, I will express gratitude to one person',
        '{
            "environment": [
                "感謝ノートを用意する",
                "連絡手段を確保する"
            ],
            "reminders": [
                "就寝前にリマインダーを設定する",
                "感謝したい人のリストを作成する"
            ],
            "tracking": [
                "感謝を伝えた相手と内容を記録する",
                "相手の反応や自分の気持ちの変化を記録する"
            ]
        }'::jsonb
    ),
    -- 創造性
    (
        'アイデアジャーナル',
        '毎日3つのアイデアを書き留める',
        (select id from ff_habits.habit_categories where name = 'creativity'),
        '創造的な思考を持つ人',
        'アイデアを整理し、創造性が向上する',
        'After lunch, I will write down 3 new ideas',
        '{
            "environment": [
                "専用のノートを用意する",
                "お気に入りのペンを用意する",
                "アイデアを書くスペースを確保する"
            ],
            "reminders": [
                "昼食後にリマインダーを設定する",
                "インスピレーションカードを用意する"
            ],
            "tracking": [
                "アイデアの数と質を記録する",
                "実行に移したアイデアをマークする"
            ]
        }'::jsonb
    ),
    -- 整理整頓
    (
        '5分間の整理整頓',
        '毎日5分間、決まった場所の整理整頓を行う',
        (select id from ff_habits.habit_categories where name = 'organization'),
        '整理された環境を維持する人',
        '生活空間が整理され、心の余裕が生まれる',
        'After dinner, I will spend 5 minutes tidying up one area',
        '{
            "environment": [
                "整理用のボックスを用意する",
                "捨てるものを入れる袋を用意する",
                "掃除道具を使いやすい場所に置く"
            ],
            "reminders": [
                "夕食後にタイマーをセットする",
                "整理する場所のリストを作成する"
            ],
            "tracking": [
                "整理した場所を記録する",
                "片付いた満足度を評価する"
            ]
        }'::jsonb
    ),
    -- 睡眠管理
    (
        '就寝時間の習慣化',
        '毎日決まった時間に就寝する',
        (select id from ff_habits.habit_categories where name = 'sleep'),
        '規則正しい生活を送る人',
        '睡眠の質が向上し、生活リズムが整う',
        'When it becomes 10 PM, I will start my bedtime routine',
        '{
            "environment": [
                "寝室の温度と湿度を調整する",
                "快適な寝具を用意する",
                "遮光カーテンを設置する"
            ],
            "reminders": [
                "就寝1時間前にアラームを設定する",
                "就寝準備のチェックリストを作成する"
            ],
            "tracking": [
                "就寝時間と起床時間を記録する",
                "睡眠の質を評価する",
                "翌朝の目覚めの状態を記録する"
            ]
        }'::jsonb
    ),
    -- 時間管理
    (
        'タイムブロッキング',
        '毎朝、その日の時間をブロックに分けて計画を立てる',
        (select id from ff_habits.habit_categories where name = 'time_management'),
        '時間を効率的に使う人',
        '時間の使い方が可視化され、生産性が向上する',
        'After checking my schedule in the morning, I will block out my day in 30-minute increments',
        '{
            "environment": [
                "デジタルまたはアナログのカレンダーを用意する",
                "タイムブロッキング用のテンプレートを作成する",
                "優先タスクリストを準備する"
            ],
            "reminders": [
                "朝一番にリマインダーを設定する",
                "時間ブロックの通知を設定する"
            ],
            "tracking": [
                "計画と実際の時間使用を記録する",
                "タスクの完了状況を記録する",
                "時間の使い方の効率を評価する"
            ]
        }'::jsonb
    ); 