-- goal_templatesのサンプルデータ
insert into ff_goals.goal_templates 
    (title, description, category, difficulty, estimated_duration, recommended_habits, suggested_milestones, metrics_template, tags, is_featured)
values
    -- 学習カテゴリ
    (
        'プログラミング言語の基礎習得',
        'プログラミング言語の基本概念と文法を学び、簡単なアプリケーションを作成できるようになる',
        'learning',
        'medium',
        '3 months',
        '[
            {
                "title": "毎日のコーディング練習",
                "frequency": "daily",
                "duration": 30
            },
            {
                "title": "技術書の読書",
                "frequency": "daily",
                "duration": 20
            }
        ]'::jsonb,
        '[
            {
                "title": "基本文法の理解",
                "description": "変数、制御構文、関数などの基本概念を理解する",
                "target_date": "+2 weeks"
            },
            {
                "title": "簡単なプログラムの作成",
                "description": "基本的なアルゴリズムを実装できる",
                "target_date": "+1 month"
            },
            {
                "title": "小規模プロジェクトの完成",
                "description": "実用的な機能を持つアプリケーションを作成する",
                "target_date": "+3 months"
            }
        ]'::jsonb,
        '{
            "type": "milestone",
            "milestones": [
                {"name": "基本文法の理解", "weight": 30},
                {"name": "プログラミング演習の完了", "weight": 40},
                {"name": "プロジェクトの完成", "weight": 30}
            ],
            "measurement_frequency": "weekly"
        }'::jsonb,
        array['programming', 'learning', 'coding'],
        true
    ),
    
    -- スキルカテゴリ
    (
        'プレゼンテーションスキルの向上',
        '効果的なプレゼンテーションを行うためのスキルを習得し、自信を持って発表できるようになる',
        'skill',
        'medium',
        '2 months',
        '[
            {
                "title": "スピーチ練習",
                "frequency": "daily",
                "duration": 15
            },
            {
                "title": "プレゼン資料作成",
                "frequency": "weekly",
                "duration": 60
            }
        ]'::jsonb,
        '[
            {
                "title": "基本的なプレゼンテーション構成の習得",
                "description": "効果的な導入、本論、結論の組み立て方を学ぶ",
                "target_date": "+2 weeks"
            },
            {
                "title": "視覚資料の作成スキル向上",
                "description": "分かりやすいスライドの作成方法を習得する",
                "target_date": "+1 month"
            },
            {
                "title": "実践的なプレゼンテーション実施",
                "description": "実際の観客の前でプレゼンテーションを行う",
                "target_date": "+2 months"
            }
        ]'::jsonb,
        '{
            "type": "rubric",
            "criteria": [
                {"name": "内容構成", "max_score": 5},
                {"name": "視覚資料", "max_score": 5},
                {"name": "発表スキル", "max_score": 5}
            ],
            "measurement_frequency": "monthly"
        }'::jsonb,
        array['presentation', 'public-speaking', 'communication'],
        true
    ),

    -- プロジェクトカテゴリ
    (
        'ポートフォリオウェブサイトの作成',
        '自身のスキルと実績を効果的に紹介するポートフォリオウェブサイトを作成する',
        'project',
        'hard',
        '1 month',
        '[
            {
                "title": "デザイン作業",
                "frequency": "daily",
                "duration": 45
            },
            {
                "title": "コーディング作業",
                "frequency": "daily",
                "duration": 60
            }
        ]'::jsonb,
        '[
            {
                "title": "要件定義とワイヤーフレーム作成",
                "description": "サイトの構成と必要な機能を決定する",
                "target_date": "+1 week"
            },
            {
                "title": "デザインとプロトタイプ作成",
                "description": "視覚的なデザインを確定し、プロトタイプを作成する",
                "target_date": "+2 weeks"
            },
            {
                "title": "開発と実装",
                "description": "実際のウェブサイトを開発する",
                "target_date": "+3 weeks"
            },
            {
                "title": "テストと公開",
                "description": "最終テストを行い、サイトを公開する",
                "target_date": "+1 month"
            }
        ]'::jsonb,
        '{
            "type": "checklist",
            "items": [
                {"name": "要件定義", "weight": 20},
                {"name": "デザイン", "weight": 25},
                {"name": "開発", "weight": 40},
                {"name": "テストと公開", "weight": 15}
            ],
            "measurement_frequency": "daily"
        }'::jsonb,
        array['web-development', 'portfolio', 'design'],
        true
    ),

    -- キャリアカテゴリ
    (
        'テックリード昇進準備',
        'テックリードポジションに必要なスキルと経験を積み、昇進を目指す',
        'career',
        'hard',
        '6 months',
        '[
            {
                "title": "技術書の読書",
                "frequency": "daily",
                "duration": 30
            },
            {
                "title": "チーム内勉強会の開催",
                "frequency": "weekly",
                "duration": 60
            }
        ]'::jsonb,
        '[
            {
                "title": "リーダーシップスキルの向上",
                "description": "チーム内での小規模なリーダー役を担当する",
                "target_date": "+2 months"
            },
            {
                "title": "技術的な専門性の向上",
                "description": "特定の技術領域でのエキスパートになる",
                "target_date": "+4 months"
            },
            {
                "title": "プロジェクトマネジメントスキルの習得",
                "description": "小規模プロジェクトのリード経験を積む",
                "target_date": "+6 months"
            }
        ]'::jsonb,
        '{
            "type": "composite",
            "components": [
                {"name": "技術スキル", "weight": 40},
                {"name": "リーダーシップ", "weight": 30},
                {"name": "プロジェクト管理", "weight": 30}
            ],
            "measurement_frequency": "monthly"
        }'::jsonb,
        array['career-growth', 'leadership', 'tech-lead'],
        true
    ),

    -- 学習カテゴリ（追加）
    (
        'TOEIC 800点達成',
        'TOEIC試験で800点以上のスコアを獲得し、ビジネスレベルの英語力を証明する',
        'learning',
        'hard',
        '4 months',
        '[
            {
                "title": "英単語学習",
                "frequency": "daily",
                "duration": 20
            },
            {
                "title": "リスニング練習",
                "frequency": "daily",
                "duration": 30
            },
            {
                "title": "模擬テスト受験",
                "frequency": "weekly",
                "duration": 120
            }
        ]'::jsonb,
        '[
            {
                "title": "基礎語彙の習得",
                "description": "TOEIC頻出単語3000語の習得",
                "target_date": "+1 month"
            },
            {
                "title": "リスニング力の向上",
                "description": "模擬テストでリスニングセクション400点相当の実力をつける",
                "target_date": "+2 months"
            },
            {
                "title": "リーディング力の向上",
                "description": "模擬テストでリーディングセクション400点相当の実力をつける",
                "target_date": "+3 months"
            },
            {
                "title": "総合力の完成",
                "description": "模擬テストで800点以上を安定して獲得する",
                "target_date": "+4 months"
            }
        ]'::jsonb,
        '{
            "type": "score",
            "target_score": 800,
            "components": [
                {"name": "Listening", "max_score": 495},
                {"name": "Reading", "max_score": 495}
            ],
            "measurement_frequency": "weekly"
        }'::jsonb,
        array['english', 'toeic', 'language-learning'],
        true
    ); 