-- Reactスキルの学習リソース
with react_skill as (
  select id from skill_details where slug = 'react'
)
insert into learning_resources (
  skill_id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
)
select
  react_skill.id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
from react_skill,
(values
  (
    'course',
    'React Complete Guide 2024',
    'Udemy',
    'https://www.udemy.com/course/react-complete-guide',
    'モダンなReactの完全ガイド。Hooks、Redux、Next.jsなどをカバー',
    '48時間',
    'intermediate',
    'Japanese',
    '{"amount": 16000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["JavaScript基礎", "ES6", "HTML/CSS"]'::jsonb,
    '[
      "Reactの基本概念とフック",
      "状態管理とRedux",
      "ルーティングとNext.js",
      "パフォーマンス最適化",
      "テストとデバッグ"
    ]'::jsonb,
    'online',
    '{"score": 4.8, "count": 150000}'::jsonb,
    '{"includes": ["演習問題", "プロジェクト課題", "質疑応答"]}'::jsonb
  ),
  (
    'book',
    'りあクト！ TypeScriptで始めるつらくないReact開発',
    '技術書典',
    'https://oukayuka.booth.pm/',
    '実践的なReact + TypeScript開発の解説書',
    '約300ページ',
    'intermediate',
    'Japanese',
    '{"amount": 3000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["JavaScript基礎", "TypeScript基礎"]'::jsonb,
    '[
      "モダンなReact開発の基礎",
      "TypeScriptとの統合",
      "状態管理パターン",
      "テスト駆動開発"
    ]'::jsonb,
    'offline',
    '{"score": 4.9, "count": 500}'::jsonb,
    '{"format": "PDF/印刷書籍", "updates": "定期的な改訂"}'::jsonb
  ),
  (
    'video',
    'React公式チュートリアル',
    'React Dev Team',
    'https://react.dev/learn',
    'React公式による基礎から応用までのチュートリアル',
    '8時間',
    'beginner',
    'Japanese',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["HTML", "JavaScript基礎"]'::jsonb,
    '[
      "Reactの基本概念",
      "コンポーネント開発",
      "状態管理",
      "副作用の扱い"
    ]'::jsonb,
    'online',
    '{"score": 4.7, "count": 10000}'::jsonb,
    '{"interactive": true, "exercises": true}'::jsonb
  ),
  (
    'community',
    'React Discord Community',
    'Discord',
    'https://discord.gg/react',
    'React開発者のためのコミュニティ',
    '常時開催',
    'all',
    'English',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '[]'::jsonb,
    '[
      "コミュニティでの学び",
      "質問と回答",
      "ベストプラクティスの共有",
      "ネットワーキング"
    ]'::jsonb,
    'online',
    '{"score": 4.6, "count": 50000}'::jsonb,
    '{"members": 100000, "channels": ["help", "jobs", "showcase"]}'::jsonb
  ),
  (
    'workshop',
    'React実践ワークショップ',
    'React Community Japan',
    'https://reactcommunity.jp/workshops',
    '実践的なReactアプリケーション開発を学ぶワークショップ',
    '2日間',
    'intermediate',
    'Japanese',
    '{"amount": 50000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["React基礎", "TypeScript"]'::jsonb,
    '[
      "実践的なアプリケーション設計",
      "パフォーマンス最適化",
      "セキュリティ対策",
      "デプロイメント"
    ]'::jsonb,
    'hybrid',
    '{"score": 4.9, "count": 200}'::jsonb,
    '{"capacity": 30, "materials": "included", "certificate": true}'::jsonb
  )
) as data(type, name, provider, url, description, duration, level, language, cost, prerequisites, objectives, format, rating, metadata)
on conflict do nothing;

-- Node.jsスキルの学習リソース
with nodejs_skill as (
  select id from skill_details where slug = 'nodejs'
)
insert into learning_resources (
  skill_id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
)
select
  nodejs_skill.id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
from nodejs_skill,
(values
  (
    'course',
    'Node.js Complete Guide',
    'Udemy',
    'https://www.udemy.com/course/nodejs-complete-guide',
    'Node.jsの基礎から応用まで学ぶ総合コース',
    '40時間',
    'intermediate',
    'Japanese',
    '{"amount": 16000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["JavaScript基礎", "非同期プログラミング"]'::jsonb,
    '[
      "Node.jsの基本概念",
      "Express.jsフレームワーク",
      "データベース統合",
      "認証と認可",
      "RESTful API開発"
    ]'::jsonb,
    'online',
    '{"score": 4.7, "count": 80000}'::jsonb,
    '{"includes": ["演習問題", "プロジェクト課題", "質疑応答"]}'::jsonb
  ),
  (
    'certification',
    'OpenJS Node.js Application Developer',
    'Linux Foundation',
    'https://training.linuxfoundation.org/certification/jsnad/',
    'Node.jsアプリケーション開発者認定試験',
    '2時間',
    'advanced',
    'English',
    '{"amount": 30000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["Node.js実務経験", "JavaScript上級"]'::jsonb,
    '[
      "Node.jsコア機能",
      "非同期プログラミング",
      "エラーハンドリング",
      "セキュリティ"
    ]'::jsonb,
    'online',
    '{"score": 4.8, "count": 5000}'::jsonb,
    '{"validity": "3年間", "passing_score": 75}'::jsonb
  ),
  (
    'book',
    'Node.jsデザインパターン 第3版',
    'O\'Reilly',
    'https://www.oreilly.co.jp/books/nodejs-design-patterns/',
    'Node.jsアプリケーションの設計パターンを学ぶ',
    '約500ページ',
    'advanced',
    'Japanese',
    '{"amount": 5000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["Node.js基礎", "デザインパターン"]'::jsonb,
    '[
      "非同期パターン",
      "アーキテクチャパターン",
      "メッセージングパターン",
      "スケーラビリティ"
    ]'::jsonb,
    'offline',
    '{"score": 4.9, "count": 1000}'::jsonb,
    '{"format": "PDF/印刷書籍", "code_examples": true}'::jsonb
  ),
  (
    'workshop',
    'Node.jsパフォーマンスチューニング',
    'Node.js Japan',
    'https://nodejs.jp/workshops',
    'Node.jsアプリケーションの最適化手法を学ぶ',
    '1日',
    'expert',
    'Japanese',
    '{"amount": 40000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["Node.js実務経験", "パフォーマンス基礎"]'::jsonb,
    '[
      "メモリ最適化",
      "CPU最適化",
      "非同期処理の最適化",
      "モニタリング"
    ]'::jsonb,
    'offline',
    '{"score": 4.8, "count": 150}'::jsonb,
    '{"capacity": 20, "hands_on": true, "tools_provided": true}'::jsonb
  ),
  (
    'guide',
    'Node.js Best Practices',
    'GitHub',
    'https://github.com/goldbergyoni/nodebestpractices',
    'Node.jsのベストプラクティス集',
    '継続的更新',
    'all',
    'English',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["Node.js基礎"]'::jsonb,
    '[
      "プロジェクト構造",
      "エラーハンドリング",
      "コード品質",
      "セキュリティ"
    ]'::jsonb,
    'online',
    '{"score": 4.9, "count": 70000}'::jsonb,
    '{"contributors": 200, "stars": 80000}'::jsonb
  )
) as data(type, name, provider, url, description, duration, level, language, cost, prerequisites, objectives, format, rating, metadata)
on conflict do nothing;

-- TypeScriptスキルの学習リソース
with typescript_skill as (
  select id from skill_details where slug = 'typescript'
)
insert into learning_resources (
  skill_id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
)
select
  typescript_skill.id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
from typescript_skill,
(values
  (
    'course',
    'TypeScript Deep Dive',
    'Frontend Masters',
    'https://frontendmasters.com/courses/typescript-v3/',
    'TypeScriptの深い理解と実践的な使用方法を学ぶ',
    '32時間',
    'intermediate',
    'Japanese',
    '{"amount": 4000, "currency": "JPY", "type": "monthly"}'::jsonb,
    '["JavaScript上級"]'::jsonb,
    '[
      "TypeScriptの型システム",
      "ジェネリクス",
      "高度な型機能",
      "デコレータ",
      "モジュールシステム"
    ]'::jsonb,
    'online',
    '{"score": 4.9, "count": 12000}'::jsonb,
    '{"includes": ["演習問題", "ソースコード", "コミュニティアクセス"]}'::jsonb
  ),
  (
    'book',
    'プログラミングTypeScript',
    'O\'Reilly',
    'https://www.oreilly.co.jp/books/typescript/',
    'TypeScriptの実践的な使い方を網羅的に解説',
    '約400ページ',
    'intermediate',
    'Japanese',
    '{"amount": 4000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["JavaScript基礎"]'::jsonb,
    '[
      "型システムの基礎",
      "オブジェクト指向プログラミング",
      "非同期プログラミング",
      "型の設計パターン"
    ]'::jsonb,
    'offline',
    '{"score": 4.8, "count": 800}'::jsonb,
    '{"format": "PDF/印刷書籍", "code_examples": true}'::jsonb
  ),
  (
    'video',
    'TypeScript公式チュートリアル',
    'Microsoft',
    'https://www.typescriptlang.org/docs/handbook/',
    'TypeScript開発チームによる公式ガイド',
    '10時間',
    'beginner',
    'Japanese',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["JavaScript基礎"]'::jsonb,
    '[
      "TypeScriptの基本",
      "型注釈と型推論",
      "インターフェースとクラス",
      "モジュールとネームスペース"
    ]'::jsonb,
    'online',
    '{"score": 4.7, "count": 20000}'::jsonb,
    '{"interactive": true, "playground": true}'::jsonb
  ),
  (
    'workshop',
    'TypeScript実践ワークショップ',
    'TypeScript Japan',
    'https://typescript.jp/workshops',
    '実践的なTypeScriptアプリケーション開発を学ぶ',
    '2日間',
    'advanced',
    'Japanese',
    '{"amount": 45000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["TypeScript基礎", "フレームワーク経験"]'::jsonb,
    '[
      "型定義の設計",
      "ライブラリ開発",
      "型安全なAPI設計",
      "パフォーマンス最適化"
    ]'::jsonb,
    'offline',
    '{"score": 4.9, "count": 150}'::jsonb,
    '{"capacity": 25, "materials": "included", "certificate": true}'::jsonb
  ),
  (
    'certification',
    'TypeScript Professional Developer',
    'Microsoft',
    'https://learn.microsoft.com/certifications/',
    'TypeScript開発者向けの公式認定資格',
    '3時間',
    'expert',
    'English',
    '{"amount": 25000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["TypeScript実務経験2年以上"]'::jsonb,
    '[
      "型システムの高度な機能",
      "コンパイラAPI",
      "型の設計と最適化",
      "ツール開発"
    ]'::jsonb,
    'online',
    '{"score": 4.8, "count": 3000}'::jsonb,
    '{"validity": "2年間", "passing_score": 80}'::jsonb
  )
) as data(type, name, provider, url, description, duration, level, language, cost, prerequisites, objectives, format, rating, metadata)
on conflict do nothing;

-- Tailwind CSSスキルの学習リソース
with tailwind_skill as (
  select id from skill_details where slug = 'tailwind-css'
)
insert into learning_resources (
  skill_id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
)
select
  tailwind_skill.id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
from tailwind_skill,
(values
  (
    'course',
    'Tailwind CSS Mastery',
    'Udemy',
    'https://www.udemy.com/course/tailwind-css-mastery',
    'Tailwind CSSの基礎から応用まで学ぶ総合コース',
    '20時間',
    'intermediate',
    'Japanese',
    '{"amount": 12000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["HTML", "CSS基礎"]'::jsonb,
    '[
      "Tailwind CSSの基本概念",
      "レスポンシブデザイン",
      "カスタマイズと設定",
      "最適化とパフォーマンス",
      "コンポーネント設計"
    ]'::jsonb,
    'online',
    '{"score": 4.8, "count": 5000}'::jsonb,
    '{"includes": ["演習問題", "プロジェクト課題", "ソースコード"]}'::jsonb
  ),
  (
    'video',
    'Tailwind CSS公式チュートリアル',
    'Tailwind Labs',
    'https://tailwindcss.com/docs',
    'Tailwind CSS開発チームによる公式ガイド',
    '6時間',
    'beginner',
    'Japanese',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["HTML基礎"]'::jsonb,
    '[
      "ユーティリティファースト",
      "レスポンシブデザイン",
      "ダークモード",
      "カスタマイズ"
    ]'::jsonb,
    'online',
    '{"score": 4.9, "count": 15000}'::jsonb,
    '{"interactive": true, "playground": true}'::jsonb
  ),
  (
    'workshop',
    'Tailwind CSS実践ワークショップ',
    'Frontend Community',
    'https://frontend.jp/workshops',
    '実践的なTailwind CSSの使用方法を学ぶ',
    '1日',
    'intermediate',
    'Japanese',
    '{"amount": 30000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["Tailwind CSS基礎", "フロントエンド開発経験"]'::jsonb,
    '[
      "効率的なコンポーネント設計",
      "カスタムユーティリティ",
      "最適化テクニック",
      "アニメーション実装"
    ]'::jsonb,
    'offline',
    '{"score": 4.8, "count": 100}'::jsonb,
    '{"capacity": 20, "materials": "included", "hands_on": true}'::jsonb
  ),
  (
    'book',
    'Tailwind CSS実践ガイド',
    '技術書典',
    'https://techbookfest.org/product/tailwindcss-guide',
    'Tailwind CSSの実践的な使い方を解説',
    '約250ページ',
    'intermediate',
    'Japanese',
    '{"amount": 3000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["CSS基礎"]'::jsonb,
    '[
      "設計思想の理解",
      "実践的なコンポーネント設計",
      "パフォーマンス最適化",
      "アクセシビリティ対応"
    ]'::jsonb,
    'offline',
    '{"score": 4.7, "count": 300}'::jsonb,
    '{"format": "PDF/印刷書籍", "code_examples": true}'::jsonb
  ),
  (
    'guide',
    'Tailwind CSS Best Practices',
    'GitHub',
    'https://github.com/aniftyco/awesome-tailwindcss',
    'Tailwind CSSのベストプラクティス集',
    '継続的更新',
    'all',
    'English',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["Tailwind CSS基礎"]'::jsonb,
    '[
      "コード品質",
      "パフォーマンス",
      "保守性",
      "再利用性"
    ]'::jsonb,
    'online',
    '{"score": 4.8, "count": 8000}'::jsonb,
    '{"contributors": 100, "stars": 20000}'::jsonb
  )
) as data(type, name, provider, url, description, duration, level, language, cost, prerequisites, objectives, format, rating, metadata)
on conflict do nothing;

-- Next.jsスキルの学習リソース
with nextjs_skill as (
  select id from skill_details where slug = 'nextjs'
)
insert into learning_resources (
  skill_id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
)
select
  nextjs_skill.id,
  type,
  name,
  provider,
  url,
  description,
  duration,
  level,
  language,
  cost,
  prerequisites,
  objectives,
  format,
  rating,
  metadata
from nextjs_skill,
(values
  (
    'course',
    'Next.js 14 Complete Guide',
    'Udemy',
    'https://www.udemy.com/course/nextjs-14-complete-guide',
    'Next.js 14の基礎から応用まで学ぶ総合コース',
    '40時間',
    'intermediate',
    'Japanese',
    '{"amount": 16000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["React", "TypeScript"]'::jsonb,
    '[
      "App RouterとServer Components",
      "データフェッチングとキャッシュ",
      "ルーティングとミドルウェア",
      "最適化とパフォーマンス",
      "デプロイメント"
    ]'::jsonb,
    'online',
    '{"score": 4.9, "count": 8000}'::jsonb,
    '{"includes": ["演習問題", "プロジェクト課題", "ソースコード", "質疑応答"]}'::jsonb
  ),
  (
    'video',
    'Next.js公式チュートリアル',
    'Vercel',
    'https://nextjs.org/learn',
    'Next.js開発チームによる公式学習リソース',
    '10時間',
    'beginner',
    'Japanese',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["React基礎"]'::jsonb,
    '[
      "Next.jsの基本概念",
      "ページとルーティング",
      "データフェッチング",
      "スタイリング"
    ]'::jsonb,
    'online',
    '{"score": 4.8, "count": 25000}'::jsonb,
    '{"interactive": true, "playground": true}'::jsonb
  ),
  (
    'workshop',
    'Next.js実践ワークショップ',
    'Next.js Japan',
    'https://nextjs.jp/workshops',
    '実践的なNext.jsアプリケーション開発を学ぶ',
    '2日間',
    'advanced',
    'Japanese',
    '{"amount": 50000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["Next.js基礎", "TypeScript", "React"]'::jsonb,
    '[
      "マイクロフロントエンド",
      "パフォーマンス最適化",
      "セキュリティ対策",
      "CI/CD"
    ]'::jsonb,
    'offline',
    '{"score": 4.9, "count": 120}'::jsonb,
    '{"capacity": 20, "materials": "included", "certificate": true}'::jsonb
  ),
  (
    'book',
    'Next.js実践ガイド',
    '技術書典',
    'https://techbookfest.org/product/nextjs-guide',
    'Next.jsの実践的な使い方を解説',
    '約350ページ',
    'intermediate',
    'Japanese',
    '{"amount": 4000, "currency": "JPY", "type": "one-time"}'::jsonb,
    '["React", "TypeScript"]'::jsonb,
    '[
      "アプリケーション設計",
      "状態管理",
      "パフォーマンス最適化",
      "デプロイメント"
    ]'::jsonb,
    'offline',
    '{"score": 4.8, "count": 400}'::jsonb,
    '{"format": "PDF/印刷書籍", "code_examples": true}'::jsonb
  ),
  (
    'guide',
    'Next.js Best Practices',
    'GitHub',
    'https://github.com/vercel/next.js/tree/canary/examples',
    'Next.jsの公式サンプルとベストプラクティス集',
    '継続的更新',
    'all',
    'English',
    '{"amount": 0, "currency": "JPY", "type": "free"}'::jsonb,
    '["Next.js基礎"]'::jsonb,
    '[
      "アプリケーション構造",
      "パフォーマンス",
      "セキュリティ",
      "デプロイメント"
    ]'::jsonb,
    'online',
    '{"score": 4.9, "count": 50000}'::jsonb,
    '{"examples": 100, "stars": 100000}'::jsonb
  )
) as data(type, name, provider, url, description, duration, level, language, cost, prerequisites, objectives, format, rating, metadata)
on conflict do nothing; 