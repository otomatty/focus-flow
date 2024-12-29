-- バックエンド開発スキル
with backend_category as (
  select id from skill_categories where slug = 'backend'
)
insert into skill_details (
  category_id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
) 
select
  backend_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from backend_category,
(values
  (
    'Node.js',
    'nodejs',
    'サーバーサイドJavaScriptランタイム',
    'intermediate',
    '[
      {"type": "official", "url": "https://nodejs.org/docs"},
      {"type": "course", "name": "Node.js Complete Guide"}
    ]'::jsonb,
    '["javascript-advanced", "async-programming"]'::jsonb,
    '["express", "nestjs", "deno"]'::jsonb,
    '{"latest": "20.0.0", "lts": "18.16.0"}'::jsonb
  ),
  (
    'Express.js',
    'expressjs',
    'Node.js用Webアプリケーションフレームワーク',
    'intermediate',
    '[
      {"type": "official", "url": "https://expressjs.com/"},
      {"type": "tutorial", "name": "Express.js Fundamentals"}
    ]'::jsonb,
    '["nodejs", "http-basics"]'::jsonb,
    '["koa", "fastify", "middleware-development"]'::jsonb,
    '{"latest": "4.18.2"}'::jsonb
  ),
  (
    'PostgreSQL',
    'postgresql',
    'オープンソースリレーショナルデータベース',
    'advanced',
    '[
      {"type": "official", "url": "https://www.postgresql.org/docs/"},
      {"type": "course", "name": "PostgreSQL Administration"}
    ]'::jsonb,
    '["sql-basics", "database-theory"]'::jsonb,
    '["mysql", "database-optimization", "sql-tuning"]'::jsonb,
    '{"latest": "15.3", "lts": "15.3"}'::jsonb
  ),
  (
    'GraphQL',
    'graphql',
    'APIのためのクエリ言語',
    'advanced',
    '[
      {"type": "official", "url": "https://graphql.org/learn/"},
      {"type": "tutorial", "name": "GraphQL Fundamentals"}
    ]'::jsonb,
    '["api-design", "json"]'::jsonb,
    '["apollo-server", "relay", "prisma"]'::jsonb,
    '{"latest": "16.6.0"}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- データ分析スキル
with data_analysis_category as (
  select id from skill_categories where slug = 'data-analysis'
)
insert into skill_details (
  category_id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
) 
select
  data_analysis_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from data_analysis_category,
(values
  (
    'Python Data Analysis',
    'python-data-analysis',
    'Pythonを使用したデータ分析の基礎',
    'intermediate',
    '[
      {"type": "course", "name": "Data Analysis with Python"},
      {"type": "book", "name": "Python for Data Analysis"}
    ]'::jsonb,
    '["python-basics", "statistics-basics"]'::jsonb,
    '["pandas", "numpy", "matplotlib"]'::jsonb,
    '{"recommended_python": "3.9+"}'::jsonb
  ),
  (
    'Pandas',
    'pandas',
    'Pythonデータ操作・分析ライブラリ',
    'intermediate',
    '[
      {"type": "official", "url": "https://pandas.pydata.org/docs/"},
      {"type": "tutorial", "name": "Pandas Cookbook"}
    ]'::jsonb,
    '["python-data-analysis", "numpy-basics"]'::jsonb,
    '["data-cleaning", "data-visualization"]'::jsonb,
    '{"latest": "2.0.0"}'::jsonb
  ),
  (
    'SQL for Analytics',
    'sql-analytics',
    'データ分析のためのSQL',
    'intermediate',
    '[
      {"type": "course", "name": "SQL for Data Analysis"},
      {"type": "guide", "name": "Advanced SQL Analytics"}
    ]'::jsonb,
    '["sql-basics", "database-basics"]'::jsonb,
    '["data-warehousing", "bi-tools"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Power BI',
    'power-bi',
    'ビジネスインテリジェンスツール',
    'intermediate',
    '[
      {"type": "official", "url": "https://learn.microsoft.com/power-bi/"},
      {"type": "course", "name": "Power BI Desktop"}
    ]'::jsonb,
    '["data-visualization-basics", "business-analytics"]'::jsonb,
    '["dax", "power-query", "tableau"]'::jsonb,
    '{"latest": "2023"}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- 機械学習スキル
with ml_category as (
  select id from skill_categories where slug = 'machine-learning'
)
insert into skill_details (
  category_id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
) 
select
  ml_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
from ml_category,
(values
  (
    'Scikit-learn',
    'scikit-learn',
    '機械学習のためのPythonライブラリ',
    'advanced',
    '[
      {"type": "official", "url": "https://scikit-learn.org/stable/"},
      {"type": "course", "name": "Machine Learning with Scikit-learn"}
    ]'::jsonb,
    '["python-advanced", "numpy", "pandas"]'::jsonb,
    '["ml-algorithms", "model-evaluation"]'::jsonb
  ),
  (
    'TensorFlow',
    'tensorflow',
    'ディープラーニングフレームワーク',
    'advanced',
    '[
      {"type": "official", "url": "https://www.tensorflow.org/learn"},
      {"type": "course", "name": "Deep Learning with TensorFlow"}
    ]'::jsonb,
    '["python-advanced", "linear-algebra", "calculus"]'::jsonb,
    '["keras", "pytorch", "neural-networks"]'::jsonb
  ),
  (
    'Machine Learning Algorithms',
    'ml-algorithms',
    '機械学習アルゴリズムの理論と実装',
    'advanced',
    '[
      {"type": "course", "name": "Machine Learning Fundamentals"},
      {"type": "book", "name": "Introduction to Machine Learning"}
    ]'::jsonb,
    '["statistics-advanced", "linear-algebra", "calculus"]'::jsonb,
    '["deep-learning", "reinforcement-learning"]'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills)
on conflict (slug) do nothing;

-- UIデザインスキル
with ui_design_category as (
  select id from skill_categories where slug = 'ui-design'
)
insert into skill_details (
  category_id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
) 
select
  ui_design_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from ui_design_category,
(values
  (
    'Figma',
    'figma',
    'コラボレーティブインターフェースデザインツール',
    'intermediate',
    '[
      {"type": "official", "url": "https://help.figma.com/"},
      {"type": "course", "name": "Figma UI/UX Design"}
    ]'::jsonb,
    '["design-basics", "typography"]'::jsonb,
    '["sketch", "adobe-xd", "prototyping"]'::jsonb,
    '{"latest": "2023"}'::jsonb
  ),
  (
    'Design Systems',
    'design-systems',
    'デザインシステムの構築と管理',
    'advanced',
    '[
      {"type": "guide", "name": "Design Systems Handbook"},
      {"type": "course", "name": "Creating Design Systems"}
    ]'::jsonb,
    '["ui-design-principles", "component-design"]'::jsonb,
    '["style-guides", "component-libraries"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Responsive Design',
    'responsive-design',
    'レスポンシブWebデザイン',
    'intermediate',
    '[
      {"type": "course", "name": "Responsive Web Design"},
      {"type": "guide", "name": "Mobile-First Design"}
    ]'::jsonb,
    '["html-css-advanced", "media-queries"]'::jsonb,
    '["mobile-design", "fluid-layouts"]'::jsonb,
    '{}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 