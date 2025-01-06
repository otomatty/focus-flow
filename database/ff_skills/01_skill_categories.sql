create table if not exists ff_skills.skill_categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique check (slug ~ '^[a-z0-9-]+$'),
  description text,
  parent_id uuid references ff_skills.skill_categories(id),
  icon text,
  color text check (color ~ '^#[0-9A-Fa-f]{6}$'),
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  constraint prevent_self_reference check (id != parent_id)
);

comment on table ff_skills.skill_categories is 'スキルのカテゴリを管理するテーブル';

-- RLSポリシーの設定
alter table ff_skills.skill_categories enable row level security;

create policy "全てのユーザーがスキルカテゴリを参照できる"
  on ff_skills.skill_categories for select
  to authenticated
  using (true);

-- インデックスの作成
create index skill_categories_parent_id_idx on ff_skills.skill_categories(parent_id);
create index skill_categories_slug_idx on ff_skills.skill_categories(slug);
create index skill_categories_name_idx on ff_skills.skill_categories(name);
create index skill_categories_is_active_idx on ff_skills.skill_categories(is_active);

-- 複合インデックス
create index skill_categories_active_parent_idx on ff_skills.skill_categories(is_active, parent_id);

-- トリガーの設定
create trigger update_skill_categories_updated_at
  before update on ff_skills.skill_categories
  for each row
  execute function update_updated_at_column();

-- メーザースキルテーブル
create table if not exists ff_skills.user_skills (
    id uuid primary key default uuid_generate_v4(),
    user_id uuid references auth.users(id) not null,
    category_id uuid references ff_skills.skill_categories(id) not null,
    rank_id uuid references ff_skills.skill_ranks(id) not null,
    total_exp integer default 0,
    achievements jsonb default '{}'::jsonb,
    stats jsonb default '{
        "completed_tasks": 0,
        "perfect_tasks": 0,
        "consecutive_days": 0,
        "max_consecutive_days": 0,
        "total_focus_time": 0,
        "collaboration_count": 0,
        "teaching_count": 0
    }'::jsonb,
    last_gained_at timestamp with time zone,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now(),
    -- 制約
    constraint positive_total_exp check (total_exp >= 0),
    constraint valid_achievements check (jsonb_typeof(achievements) = 'object'),
    constraint valid_stats check (jsonb_typeof(stats) = 'object'),
    constraint unique_user_category unique(user_id, category_id)
);

comment on table ff_skills.user_skills is 'ユーザーのスキルランクと経験値を管理するテーブル';
comment on column ff_skills.user_skills.category_id is 'スキルカテゴリID';
comment on column ff_skills.user_skills.rank_id is '現在のランク';
comment on column ff_skills.user_skills.total_exp is '累計経験値';
comment on column ff_skills.user_skills.achievements is '達成した実績情報';
comment on column ff_skills.user_skills.stats is 'スキルに関する統計情報';
comment on column ff_skills.user_skills.last_gained_at is '最後に経験値を獲得した日時';

-- RLSポリシーの設定
alter table ff_skills.user_skills enable row level security;

create policy "ユーザーは自分のスキル情報を参照できる"
  on ff_skills.user_skills for select
  using (auth.uid() = user_id);

create policy "ユーザーは自分のスキル情報を更新できる"
  on ff_skills.user_skills for update
  using (auth.uid() = user_id);

create policy "システム管理者はすべてのユーザースキル情報を参照できる"
  on ff_skills.user_skills for select
  using (ff_users.is_system_admin(auth.uid()));

-- インデックス
create index user_skills_user_id_idx on ff_skills.user_skills(user_id);
create index user_skills_category_id_idx on ff_skills.user_skills(category_id);
create index user_skills_rank_id_idx on ff_skills.user_skills(rank_id);
create index user_skills_last_gained_at_idx on ff_skills.user_skills(last_gained_at);
create index user_skills_total_exp_idx on ff_skills.user_skills(total_exp);

-- 更新日時トリガー
create trigger handle_updated_at before update on ff_skills.user_skills
    for each row execute procedure moddatetime (updated_at);

-- メインカテゴリの挿入
insert into ff_skills.skill_categories (name, slug, description, parent_id, icon, color) values
-- テクノロジー系
('ソフトウェア開発', 'software-development', 'プログラミングからアプリケーション開発まで、ソフトウェア開発に関連するスキル', null, 'Code', '#3B82F6'),
('データサイエンス', 'data-science', 'データ分析、機械学習、統計学などのデータサイエンス関連スキル', null, 'Database', '#6366F1'),
('デザイン', 'design', 'UI/UXデザイン、グラフィックデザイン、プロダクトデザインなどのクリエイティブスキル', null, 'Palette', '#EC4899'),
('インフラストラクチャ', 'infrastructure', 'クラウド、ネットワーク、セキュリティなどのインフラ関連スキル', null, 'Server', '#0EA5E9'),
('AI・先端技術', 'emerging-tech', 'AI、ロボティクス、量子コンピューティングなどの先端技術', null, 'Cpu', '#9333EA'),

-- ビジネス系
('プロジェクトマネジメント', 'project-management', 'プロジェクト管理、アジャイル開発、チームリーダーシップなどのマネジメントスキル', null, 'GitBranch', '#10B981'),
('ビジネス戦略', 'business-strategy', '事業戦略、マーケティング、財務などのビジネススキル', null, 'TrendingUp', '#F59E0B'),
('製品開発', 'product-development', '製品戦略、プロトタイピング、市場投入までの製品開発プロセス', null, 'Box', '#0891B2'),

-- クリエイティブ系
('コンテンツ制作', 'content-creation', '動画制作、ライティング、イラストレーションなどのコンテンツ制作スキル', null, 'Image', '#8B5CF6'),
('音楽・オーディオ', 'music-audio', '作曲、音響編集、ポッドキャスト制作などの音楽・オーディオ関連スキル', null, 'Music', '#EF4444'),
('マーケティング・広報', 'marketing-pr', 'デジタルマーケティング、広報戦略、ブランディングなどの対外的なコミュニケーション', null, 'Megaphone', '#EA580C'),

-- 教育・研究系
('教育・指導', 'education', '教育コンテンツ作成、指導法、カリキュラム設計などの教育関連スキル', null, 'GraduationCap', '#14B8A6'),
('研究・分析', 'research', '学術研究、市場調査、データ分析などの研究関連スキル', null, 'Microscope', '#6366F1'),
('サステナビリティ', 'sustainability', '環境配慮、社会的責任、持続可能な開発に関するスキル', null, 'Leaf', '#059669'),

-- その他の専門分野
('言語・コミュニケーション', 'language-communication', '多言語コミュニケーション、技術文書作成、プレゼンテーションなどのスキル', null, 'MessageCircle', '#8B5CF6'),
('健康・ウェルネス', 'health-wellness', '健康管理、メンタルヘルス、ワークライフバランスなどのウェルネススキル', null, 'Heart', '#EC4899')

on conflict (slug) do nothing;

-- サブカテゴリの挿入のために親カテゴリのIDを取得
with parent_ids as (
  select id, slug from ff_skills.skill_categories
  where parent_id is null
)
insert into ff_skills.skill_categories (name, slug, description, parent_id, icon, color)
select
  sub.name,
  sub.slug,
  sub.description,
  p.id as parent_id,
  sub.icon,
  sub.color
from (
  values
    -- ソフトウェア開発
    ('フロントエンド開発', 'frontend', 'Webフロントエンド開発、UI実装、クライアントサイドの最適化', 'software-development', 'Layout', '#60A5FA'),
    ('バックエンド開発', 'backend', 'サーバーサイド開発、APIデザイン、データベース設計', 'software-development', 'Database', '#818CF8'),
    ('モバイルアプリ開発', 'mobile', 'iOSおよびAndroidアプリの設計・開発', 'software-development', 'Smartphone', '#34D399'),
    ('システムアーキテクチャ', 'system-architecture', 'システム設計、マイクロサービス、分散システム', 'software-development', 'Network', '#F472B6'),
    ('品質管理', 'quality-assurance', 'テスト自動化、品質保証、パフォーマンス最適化', 'software-development', 'Shield', '#FBBF24'),
    
    -- データサイエンス
    ('機械学習', 'machine-learning', 'ML/DLモデルの開発、学習データの前処理、モデル評価', 'data-science', 'Brain', '#818CF8'),
    ('データ分析', 'data-analysis', 'データの収集・加工・分析、BIツールの活用', 'data-science', 'BarChart', '#34D399'),
    ('ビッグデータ処理', 'big-data', '大規模データの処理、分散処理、データパイプライン', 'data-science', 'Database', '#F472B6'),
    ('統計解析', 'statistical-analysis', '統計モデリング、仮説検定、実験計画', 'data-science', 'Calculator', '#FBBF24'),
    
    -- デザイン
    ('UIデザイン', 'ui-design', 'インターフェースデザイン、ビジュアルデザイン、プロトタイピング', 'design', 'Smartphone', '#F472B6'),
    ('UXデザイン', 'ux-design', 'ユーザー調査、ペルソナ設計、ユーザビリティテスト', 'design', 'Users', '#818CF8'),
    ('グラフィックデザイン', 'graphic-design', 'ブランディング、ロゴデザイン、販促物デザイン', 'design', 'Image', '#60A5FA'),
    ('モーショングラフィックス', 'motion-graphics', 'アニメーション制作、映像編集、特殊効果', 'design', 'Video', '#34D399'),
    
    -- インフラストラクチャ
    ('クラウドインフラ', 'cloud-infrastructure', 'クラウドアーキテクチャ、IaC、運用自動化', 'infrastructure', 'Cloud', '#60A5FA'),
    ('ネットワーク', 'networking', 'ネットワーク設計、セキュリティ、負荷分散', 'infrastructure', 'Network', '#818CF8'),
    ('セキュリティ', 'security', 'セキュリティ設計、脆弱性診断、インシデント対応', 'infrastructure', 'Shield', '#F472B6'),
    ('DevOps', 'devops', 'CI/CD、モニタリング、インフラ自動化', 'infrastructure', 'GitBranch', '#34D399'),
    
    -- プロジェクトマネジメント
    ('アジャイル開発管理', 'agile-management', 'スクラム、カンバン、アジャイルプラクティス', 'project-management', 'GitBranch', '#60A5FA'),
    ('リスク管理', 'risk-management', 'リスク分析、対策立案、モニタリング', 'project-management', 'Shield', '#F472B6'),
    ('チームリーダーシップ', 'team-leadership', 'チーム育成、パフォーマンス管理、コンフリクト解決', 'project-management', 'Users', '#34D399'),
    
    -- ビジネス戦略
    ('マーケティング戦略', 'marketing-strategy', 'マーケティング計画、市場分析、ブランド戦略', 'business-strategy', 'TrendingUp', '#60A5FA'),
    ('財務管理', 'financial-management', '予算管理、コスト分析、投資評価', 'business-strategy', 'DollarSign', '#F472B6'),
    ('事業開発', 'business-development', '新規事業開発、パートナーシップ、市場開拓', 'business-strategy', 'Briefcase', '#34D399'),
    
    -- コンテンツ制作
    ('動画制作', 'video-production', '撮影、編集、ポストプロダクション', 'content-creation', 'Video', '#60A5FA'),
    ('テクニカルライティング', 'technical-writing', '技術文書作成、マニュアル制作、API文書化', 'content-creation', 'FileText', '#F472B6'),
    ('コンテンツマーケティング', 'content-marketing', 'コンテンツ戦略、SEO、コンテンツ分析', 'content-creation', 'FileText', '#34D399'),
    
    -- 音楽・オーディオ
    ('音楽制作', 'music-production', '作曲、編曲、ミキシング', 'music-audio', 'Music', '#60A5FA'),
    ('サウンドデザイン', 'sound-design', '効果音制作、環境音デザイン、音響設計', 'music-audio', 'Volume2', '#F472B6'),
    ('ポッドキャスト制作', 'podcast-production', '企画、収録、編集、配信', 'music-audio', 'Mic', '#34D399'),
    
    -- 教育・指導
    ('教育コンテンツ開発', 'educational-content', 'カリキュラム設計、教材作成、評価設計', 'education', 'Book', '#60A5FA'),
    ('オンライン教育', 'online-education', 'eラーニング、オンラインコース設計、学習管理', 'education', 'Monitor', '#F472B6'),
    ('メンタリング', 'mentoring', '個別指導、キャリア支援、スキル開発支援', 'education', 'Users', '#34D399'),
    
    -- 研究・分析
    ('市場調査', 'market-research', '市場分析、競合分析、消費者調査', 'research', 'Search', '#60A5FA'),
    ('学術研究', 'academic-research', '文献調査、実験設計、論文執筆', 'research', 'GraduationCap', '#F472B6'),
    ('ビジネス分析', 'business-analysis', '業務分析、要件定義、プロセス改善', 'research', 'LineChart', '#34D399'),
    
    -- 言語・コミュニケーション
    ('ビジネス英語', 'business-english', 'ビジネス文書、プレゼン、ネゴシエーション', 'language-communication', 'Globe', '#60A5FA'),
    ('技術コミュニケーション', 'technical-communication', '技術プレゼン、ドキュメンテーション、知識共有', 'language-communication', 'FileText', '#F472B6'),
    ('異文化コミュニケーション', 'cross-cultural', '異文化理解、グローバルチーム連携', 'language-communication', 'Users', '#34D399'),
    
    -- 健康・ウェルネス
    ('メンタルヘルス管理', 'mental-health', 'ストレス管理、マインドフルネス、レジリエンス', 'health-wellness', 'Heart', '#60A5FA'),
    ('ワークライフバランス', 'work-life-balance', '時間管理、生産性向上、健康管理', 'health-wellness', 'Clock', '#F472B6'),
    ('チームウェルネス', 'team-wellness', 'チーム健康管理、職場環境改善', 'health-wellness', 'Users', '#34D399'),

    -- AI・先端技術
    ('AIモデル開発', 'ai-model-development', 'ディープラーニングモデルの設計・開発・最適化', 'emerging-tech', 'Brain', '#9333EA'),
    ('自然言語処理', 'nlp', '自然言語処理、テキスト分析、言語モデル開発', 'emerging-tech', 'MessageSquare', '#7C3AED'),
    ('コンピュータビジョン', 'computer-vision', '画像認識、物体検出、映像解析', 'emerging-tech', 'Eye', '#6D28D9'),
    ('ロボティクス', 'robotics', 'ロボット制御、センサー処理、自動化システム', 'emerging-tech', 'Bot', '#5B21B6'),
    ('量子コンピューティング', 'quantum-computing', '量子アルゴリズム、量子回路設計', 'emerging-tech', 'Atom', '#4C1D95'),

    -- 製品開発
    ('製品戦略', 'product-strategy', '製品ビジョン、ロードマップ、市場分析', 'product-development', 'Target', '#0E7490'),
    ('プロトタイピング', 'prototyping', '試作品開発、実証実験、ユーザーテスト', 'product-development', 'Tool', '#0891B2'),
    ('製品品質管理', 'product-quality', '品質基準、検査プロセス、認証対応', 'product-development', 'CheckCircle', '#0E7490'),
    ('製品ライフサイクル管理', 'product-lifecycle', '製品保守、アップデート、廃止計画', 'product-development', 'RotateCw', '#0891B2'),

    -- マーケティング・広報
    ('デジタルマーケティング', 'digital-marketing', 'オンライン広告、SNSマーケティング、SEO', 'marketing-pr', 'Globe', '#EA580C'),
    ('広報戦略', 'pr-strategy', 'メディアリレーション、危機管理、企業広報', 'marketing-pr', 'Share2', '#F97316'),
    ('ブランド管理', 'brand-management', 'ブランド戦略、アイデンティティ管理、ガイドライン作成', 'marketing-pr', 'Award', '#FB923C'),
    ('イベント企画', 'event-planning', '展示会、セミナー、ウェビナーの企画運営', 'marketing-pr', 'Calendar', '#FD8A4B'),

    -- サステナビリティ
    ('環境影響評価', 'environmental-impact', '環境アセスメント、カーボンフットプリント計算', 'sustainability', 'TreePine', '#059669'),
    ('サステナブル開発', 'sustainable-development', '持続可能な製品開発、循環型設計', 'sustainability', 'Recycle', '#10B981'),
    ('ESG戦略', 'esg-strategy', 'ESG基準への適合、サステナビリティレポート作成', 'sustainability', 'LineChart', '#34D399'),
    ('エネルギー管理', 'energy-management', 'エネルギー効率化、再生可能エネルギー活用', 'sustainability', 'Zap', '#047857')

) as sub(name, slug, description, parent_slug, icon, color)
join parent_ids p on p.slug = sub.parent_slug
on conflict (slug) do nothing; 