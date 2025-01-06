-- フロントエンド開発スキル
with frontend_category as (
  select id from ff_skills.skill_categories where slug = 'frontend'
)
insert into ff_skills.skill_details (
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
  frontend_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from frontend_category,
(values
  (
    'React',
    'react',
    'モダンなUIを構築するためのJavaScriptライブラリ',
    'intermediate',
    '[
      {"type": "official", "url": "https://react.dev"},
      {"type": "course", "name": "React Complete Guide"},
      {"type": "certification", "name": "Meta React Developer"}
    ]'::jsonb,
    '["javascript-advanced", "es6", "web-fundamentals"]'::jsonb,
    '["redux", "react-router", "next-js"]'::jsonb,
    '{"latest": "18.2.0", "recommended": "^18.0.0"}'::jsonb
  ),
  (
    'Next.js',
    'next-js',
    'Reactベースのフルスタックフレームワーク',
    'advanced',
    '[
      {"type": "official", "url": "https://nextjs.org/docs"},
      {"type": "course", "name": "Next.js Mastery"},
      {"type": "workshop", "name": "Building with App Router"}
    ]'::jsonb,
    '["react", "typescript", "web-performance"]'::jsonb,
    '["server-components", "edge-functions", "middleware"]'::jsonb,
    '{"latest": "14.0.0", "recommended": "^14.0.0"}'::jsonb
  ),
  (
    'TypeScript',
    'typescript',
    '静的型付けをサポートするJavaScriptのスーパーセット',
    'intermediate',
    '[
      {"type": "official", "url": "https://www.typescriptlang.org/docs/"},
      {"type": "course", "name": "TypeScript Deep Dive"},
      {"type": "book", "name": "Programming TypeScript"}
    ]'::jsonb,
    '["javascript-advanced", "object-oriented-programming"]'::jsonb,
    '["type-systems", "generics", "decorators"]'::jsonb,
    '{"latest": "5.2.0", "recommended": "^5.0.0"}'::jsonb
  ),
  (
    'Tailwind CSS',
    'tailwind-css',
    'ユーティリティファーストのCSSフレームワーク',
    'intermediate',
    '[
      {"type": "official", "url": "https://tailwindcss.com/docs"},
      {"type": "course", "name": "Tailwind CSS Mastery"},
      {"type": "playground", "name": "Tailwind Play"}
    ]'::jsonb,
    '["css", "responsive-design"]'::jsonb,
    '["css-architecture", "design-systems"]'::jsonb,
    '{"latest": "3.3.0", "recommended": "^3.0.0"}'::jsonb
  ),
  (
    'Web Performance',
    'web-performance',
    'Webアプリケーションのパフォーマンス最適化',
    'advanced',
    '[
      {"type": "guide", "name": "Web Performance Guide"},
      {"type": "tool", "name": "Lighthouse"},
      {"type": "metrics", "name": "Core Web Vitals"}
    ]'::jsonb,
    '["browser-apis", "network-fundamentals"]'::jsonb,
    '["caching", "code-splitting", "image-optimization"]'::jsonb,
    '{"tools": ["Lighthouse", "WebPageTest", "Chrome DevTools"]}'::jsonb
  ),
  (
    'State Management',
    'state-management',
    'フロントエンドの状態管理',
    'advanced',
    '[
      {"type": "course", "name": "Advanced State Management"},
      {"type": "workshop", "name": "Redux & Zustand Patterns"}
    ]'::jsonb,
    '["react", "javascript-advanced"]'::jsonb,
    '["redux", "zustand", "jotai", "recoil"]'::jsonb,
    '{"recommended": ["Redux", "Zustand", "Jotai"]}'::jsonb
  ),
  (
    'Testing',
    'frontend-testing',
    'フロントエンドのテスト手法',
    'advanced',
    '[
      {"type": "course", "name": "Frontend Testing Guide"},
      {"type": "workshop", "name": "Testing React Applications"}
    ]'::jsonb,
    '["javascript", "react"]'::jsonb,
    '["jest", "react-testing-library", "cypress"]'::jsonb,
    '{"tools": ["Jest", "React Testing Library", "Cypress"]}'::jsonb
  ),
  (
    'Accessibility',
    'web-accessibility',
    'Webアクセシビリティの実装と最適化',
    'advanced',
    '[
      {"type": "guide", "name": "WCAG Guidelines"},
      {"type": "course", "name": "Web Accessibility in React"}
    ]'::jsonb,
    '["html", "aria", "semantic-html"]'::jsonb,
    '["screen-readers", "keyboard-navigation"]'::jsonb,
    '{"standards": ["WCAG 2.1", "Section 508"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- バックエンド開発スキル
with backend_category as (
  select id from ff_skills.skill_categories where slug = 'backend'
)
insert into ff_skills.skill_details (
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
      {"type": "course", "name": "Node.js Complete Guide"},
      {"type": "certification", "name": "OpenJS Node.js Services Developer"}
    ]'::jsonb,
    '["javascript-advanced", "async-programming"]'::jsonb,
    '["express", "nest-js", "fastify"]'::jsonb,
    '{"latest": "20.0.0", "lts": "18.16.0"}'::jsonb
  ),
  (
    'Database Design',
    'database-design',
    'データベース設計とモデリング',
    'advanced',
    '[
      {"type": "course", "name": "Database Design Fundamentals"},
      {"type": "book", "name": "Database Design for Mere Mortals"}
    ]'::jsonb,
    '["sql-basics", "data-modeling"]'::jsonb,
    '["normalization", "indexing", "query-optimization"]'::jsonb,
    '{"tools": ["ERD Tools", "Database Design Tools"]}'::jsonb
  ),
  (
    'API Design',
    'api-design',
    'RESTful APIとGraphQLの設計',
    'advanced',
    '[
      {"type": "guide", "name": "REST API Design Guide"},
      {"type": "course", "name": "GraphQL API Development"}
    ]'::jsonb,
    '["http", "rest-fundamentals"]'::jsonb,
    '["graphql", "api-security", "documentation"]'::jsonb,
    '{"specs": ["OpenAPI 3.0", "GraphQL"]}'::jsonb
  ),
  (
    'Authentication',
    'authentication',
    '認証と認可の実装',
    'advanced',
    '[
      {"type": "course", "name": "Authentication Security"},
      {"type": "guide", "name": "OAuth 2.0 Implementation"}
    ]'::jsonb,
    '["security-basics", "cryptography"]'::jsonb,
    '["oauth", "jwt", "session-management"]'::jsonb,
    '{"standards": ["OAuth 2.0", "OpenID Connect"]}'::jsonb
  ),
  (
    'Microservices',
    'microservices',
    'マイクロサービスアーキテクチャの設計と実装',
    'expert',
    '[
      {"type": "course", "name": "Microservices Architecture"},
      {"type": "book", "name": "Building Microservices"}
    ]'::jsonb,
    '["distributed-systems", "api-design"]'::jsonb,
    '["service-mesh", "container-orchestration"]'::jsonb,
    '{"patterns": ["CQRS", "Event Sourcing", "Saga"]}'::jsonb
  ),
  (
    'Message Queues',
    'message-queues',
    'メッセージキューイングシステムの実装',
    'advanced',
    '[
      {"type": "course", "name": "Message Queue Systems"},
      {"type": "documentation", "name": "RabbitMQ Guides"}
    ]'::jsonb,
    '["distributed-systems", "networking"]'::jsonb,
    '["rabbitmq", "kafka", "redis-pub-sub"]'::jsonb,
    '{"technologies": ["RabbitMQ", "Apache Kafka", "Redis"]}'::jsonb
  ),
  (
    'Caching Strategies',
    'caching-strategies',
    'キャッシュ戦略の設計と実装',
    'advanced',
    '[
      {"type": "guide", "name": "Caching Best Practices"},
      {"type": "course", "name": "Redis Caching"}
    ]'::jsonb,
    '["distributed-systems", "performance"]'::jsonb,
    '["redis", "memcached", "cdn"]'::jsonb,
    '{"technologies": ["Redis", "Memcached", "Varnish"]}'::jsonb
  ),
  (
    'Security',
    'backend-security',
    'バックエンドセキュリティの実装',
    'expert',
    '[
      {"type": "course", "name": "Web Security"},
      {"type": "certification", "name": "Certified Secure Software Lifecycle Professional"}
    ]'::jsonb,
    '["security-fundamentals", "cryptography"]'::jsonb,
    '["penetration-testing", "security-auditing"]'::jsonb,
    '{"standards": ["OWASP Top 10", "NIST Guidelines"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- データサイエンススキル
with data_science_category as (
  select id from ff_skills.skill_categories where slug = 'data-science'
)
insert into ff_skills.skill_details (
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
  data_science_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from data_science_category,
(values
  (
    'Data Analysis',
    'data-analysis',
    'データの収集、クリーニング、分析、可視化',
    'intermediate',
    '[
      {"type": "course", "name": "Data Analysis with Python"},
      {"type": "certification", "name": "Google Data Analytics"},
      {"type": "book", "name": "Python for Data Analysis"}
    ]'::jsonb,
    '["python-basics", "statistics-fundamentals"]'::jsonb,
    '["pandas", "numpy", "matplotlib"]'::jsonb,
    '{"tools": ["Python", "Jupyter", "pandas"]}'::jsonb
  ),
  (
    'Machine Learning',
    'machine-learning',
    '機械学習モデルの開発と評価',
    'advanced',
    '[
      {"type": "course", "name": "Machine Learning Specialization"},
      {"type": "certification", "name": "TensorFlow Developer"},
      {"type": "book", "name": "Hands-on Machine Learning"}
    ]'::jsonb,
    '["python-advanced", "linear-algebra", "calculus"]'::jsonb,
    '["scikit-learn", "tensorflow", "pytorch"]'::jsonb,
    '{"frameworks": ["scikit-learn", "TensorFlow", "PyTorch"]}'::jsonb
  ),
  (
    'Deep Learning',
    'deep-learning',
    'ディープラーニングモデルの設計と実装',
    'expert',
    '[
      {"type": "course", "name": "Deep Learning Specialization"},
      {"type": "certification", "name": "NVIDIA DLI"},
      {"type": "workshop", "name": "Advanced Neural Networks"}
    ]'::jsonb,
    '["machine-learning", "gpu-computing"]'::jsonb,
    '["neural-networks", "computer-vision", "nlp"]'::jsonb,
    '{"frameworks": ["TensorFlow 2.x", "PyTorch 2.x"]}'::jsonb
  ),
  (
    'Natural Language Processing',
    'natural-language-processing',
    '自然言語処理と言語モデルの開発',
    'expert',
    '[
      {"type": "course", "name": "NLP Specialization"},
      {"type": "workshop", "name": "Large Language Models"},
      {"type": "paper", "name": "Transformer Architecture"}
    ]'::jsonb,
    '["deep-learning", "linguistics"]'::jsonb,
    '["transformers", "bert", "gpt"]'::jsonb,
    '{"libraries": ["Hugging Face", "spaCy", "NLTK"]}'::jsonb
  ),
  (
    'Computer Vision',
    'computer-vision',
    '画像・動画処理と視覚的認識',
    'expert',
    '[
      {"type": "course", "name": "Computer Vision Nanodegree"},
      {"type": "workshop", "name": "Advanced CV Techniques"},
      {"type": "paper", "name": "CNN Architectures"}
    ]'::jsonb,
    '["deep-learning", "image-processing"]'::jsonb,
    '["object-detection", "segmentation", "tracking"]'::jsonb,
    '{"libraries": ["OpenCV", "TensorFlow Vision", "PyTorch Vision"]}'::jsonb
  ),
  (
    'Big Data Processing',
    'big-data-processing',
    '大規模データの処理と分析',
    'advanced',
    '[
      {"type": "course", "name": "Big Data with PySpark"},
      {"type": "certification", "name": "Databricks Certified"},
      {"type": "workshop", "name": "Distributed Computing"}
    ]'::jsonb,
    '["distributed-systems", "data-analysis"]'::jsonb,
    '["spark", "hadoop", "data-lakes"]'::jsonb,
    '{"tools": ["Apache Spark", "Hadoop", "Databricks"]}'::jsonb
  ),
  (
    'MLOps',
    'mlops',
    '機械学習モデルの運用と保守',
    'expert',
    '[
      {"type": "course", "name": "MLOps Fundamentals"},
      {"type": "certification", "name": "Google Cloud ML Engineer"},
      {"type": "workshop", "name": "ML Pipeline Development"}
    ]'::jsonb,
    '["machine-learning", "devops"]'::jsonb,
    '["model-deployment", "monitoring", "pipeline"]'::jsonb,
    '{"tools": ["MLflow", "Kubeflow", "TensorFlow Extended"]}'::jsonb
  ),
  (
    'Data Visualization',
    'data-visualization',
    'データの視覚化とストーリーテリング',
    'intermediate',
    '[
      {"type": "course", "name": "Data Visualization Mastery"},
      {"type": "certification", "name": "Tableau Desktop"},
      {"type": "workshop", "name": "Advanced D3.js"}
    ]'::jsonb,
    '["data-analysis", "design-basics"]'::jsonb,
    '["tableau", "power-bi", "d3js"]'::jsonb,
    '{"tools": ["Tableau", "Power BI", "D3.js"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- AI・先端技術スキル
with emerging_tech_category as (
  select id from ff_skills.skill_categories where slug = 'emerging-tech'
)
insert into ff_skills.skill_details (
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
  emerging_tech_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from emerging_tech_category,
(values
  (
    'Generative AI',
    'generative-ai',
    '生成AIモデルの開発と応用',
    'expert',
    '[
      {"type": "course", "name": "Generative AI with PyTorch"},
      {"type": "paper", "name": "Diffusion Models"},
      {"type": "workshop", "name": "LLM Fine-tuning"}
    ]'::jsonb,
    '["deep-learning", "nlp"]'::jsonb,
    '["diffusion-models", "transformers", "gan"]'::jsonb,
    '{"frameworks": ["PyTorch", "JAX", "Stable Diffusion"]}'::jsonb
  ),
  (
    'Quantum Computing',
    'quantum-computing',
    '量子コンピューティングの基礎と応用',
    'expert',
    '[
      {"type": "course", "name": "Quantum Computing Fundamentals"},
      {"type": "certification", "name": "IBM Quantum"},
      {"type": "workshop", "name": "Quantum Algorithms"}
    ]'::jsonb,
    '["linear-algebra", "quantum-mechanics"]'::jsonb,
    '["quantum-algorithms", "quantum-error-correction"]'::jsonb,
    '{"platforms": ["IBM Quantum", "Google Cirq", "Amazon Braket"]}'::jsonb
  ),
  (
    'Robotics',
    'robotics',
    'ロボット工学と自律システム',
    'expert',
    '[
      {"type": "course", "name": "Robotics Specialization"},
      {"type": "certification", "name": "ROS Developer"},
      {"type": "workshop", "name": "Autonomous Systems"}
    ]'::jsonb,
    '["control-systems", "computer-vision"]'::jsonb,
    '["ros", "motion-planning", "slam"]'::jsonb,
    '{"frameworks": ["ROS", "PyBullet", "Gazebo"]}'::jsonb
  ),
  (
    'Edge AI',
    'edge-ai',
    'エッジデバイスでのAI実装',
    'expert',
    '[
      {"type": "course", "name": "Edge AI Fundamentals"},
      {"type": "certification", "name": "Intel Edge AI"},
      {"type": "workshop", "name": "TinyML Development"}
    ]'::jsonb,
    '["embedded-systems", "machine-learning"]'::jsonb,
    '["model-optimization", "embedded-ml"]'::jsonb,
    '{"platforms": ["TensorFlow Lite", "Edge TPU", "TinyML"]}'::jsonb
  ),
  (
    'Augmented Reality',
    'augmented-reality',
    'AR技術の開発と実装',
    'advanced',
    '[
      {"type": "course", "name": "AR Development"},
      {"type": "certification", "name": "Unity AR Developer"},
      {"type": "workshop", "name": "ARKit Development"}
    ]'::jsonb,
    '["3d-graphics", "mobile-development"]'::jsonb,
    '["arkit", "arcore", "unity-ar"]'::jsonb,
    '{"frameworks": ["ARKit", "ARCore", "Vuforia"]}'::jsonb
  ),
  (
    'Blockchain',
    'blockchain',
    'ブロックチェーン技術の開発',
    'advanced',
    '[
      {"type": "course", "name": "Blockchain Fundamentals"},
      {"type": "certification", "name": "Ethereum Developer"},
      {"type": "workshop", "name": "Smart Contract Development"}
    ]'::jsonb,
    '["cryptography", "distributed-systems"]'::jsonb,
    '["smart-contracts", "web3", "defi"]'::jsonb,
    '{"platforms": ["Ethereum", "Solana", "Polkadot"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- デザインスキル
with design_category as (
  select id from ff_skills.skill_categories where slug = 'design'
)
insert into ff_skills.skill_details (
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
  design_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from design_category,
(values
  (
    'UI Design',
    'ui-design',
    'ユーザーインターフェースのデザイン',
    'intermediate',
    '[
      {"type": "course", "name": "UI Design Fundamentals"},
      {"type": "certification", "name": "Google UX Design"},
      {"type": "workshop", "name": "Design Systems"}
    ]'::jsonb,
    '["visual-design", "typography"]'::jsonb,
    '["design-systems", "prototyping", "accessibility"]'::jsonb,
    '{"tools": ["Figma", "Sketch", "Adobe XD"]}'::jsonb
  ),
  (
    'UX Design',
    'ux-design',
    'ユーザー体験のデザインと最適化',
    'advanced',
    '[
      {"type": "course", "name": "UX Research Methods"},
      {"type": "certification", "name": "Certified Usability Analyst"},
      {"type": "workshop", "name": "User Testing"}
    ]'::jsonb,
    '["user-research", "psychology"]'::jsonb,
    '["usability-testing", "information-architecture"]'::jsonb,
    '{"tools": ["Maze", "Hotjar", "UserTesting"]}'::jsonb
  ),
  (
    'Design Systems',
    'design-systems',
    'デザインシステムの構築と管理',
    'advanced',
    '[
      {"type": "course", "name": "Design Systems Fundamentals"},
      {"type": "workshop", "name": "Building Design Systems"},
      {"type": "guide", "name": "Design Tokens"}
    ]'::jsonb,
    '["ui-design", "component-design"]'::jsonb,
    '["design-tokens", "documentation", "collaboration"]'::jsonb,
    '{"tools": ["Figma", "Storybook", "Zeroheight"]}'::jsonb
  ),
  (
    'Visual Design',
    'visual-design',
    'ビジュアルデザインの原則と実践',
    'intermediate',
    '[
      {"type": "course", "name": "Visual Design Principles"},
      {"type": "workshop", "name": "Color Theory"},
      {"type": "guide", "name": "Typography"}
    ]'::jsonb,
    '["color-theory", "typography"]'::jsonb,
    '["branding", "illustration", "iconography"]'::jsonb,
    '{"tools": ["Adobe Creative Suite", "Figma"]}'::jsonb
  ),
  (
    'Interaction Design',
    'interaction-design',
    'インタラクティブな体験のデザイン',
    'advanced',
    '[
      {"type": "course", "name": "Interaction Design"},
      {"type": "workshop", "name": "Motion Design"},
      {"type": "guide", "name": "Micro-interactions"}
    ]'::jsonb,
    '["ui-design", "animation"]'::jsonb,
    '["motion-design", "prototyping", "user-feedback"]'::jsonb,
    '{"tools": ["Principle", "Framer", "After Effects"]}'::jsonb
  ),
  (
    'Design Research',
    'design-research',
    'デザインリサーチと検証',
    'advanced',
    '[
      {"type": "course", "name": "Design Research Methods"},
      {"type": "workshop", "name": "User Interviews"},
      {"type": "guide", "name": "Research Analysis"}
    ]'::jsonb,
    '["user-research", "data-analysis"]'::jsonb,
    '["qualitative-research", "quantitative-research"]'::jsonb,
    '{"tools": ["Dovetail", "Miro", "UserZoom"]}'::jsonb
  ),
  (
    'Design Leadership',
    'design-leadership',
    'デザインチームのリーダーシップ',
    'expert',
    '[
      {"type": "course", "name": "Design Leadership"},
      {"type": "workshop", "name": "Design Strategy"},
      {"type": "guide", "name": "Team Management"}
    ]'::jsonb,
    '["design-systems", "team-management"]'::jsonb,
    '["design-ops", "strategy", "mentoring"]'::jsonb,
    '{"methodologies": ["Design Thinking", "Agile Design"]}'::jsonb
  ),
  (
    'Design Tools',
    'design-tools',
    'デザインツールの活用と管理',
    'intermediate',
    '[
      {"type": "course", "name": "Design Tools Mastery"},
      {"type": "workshop", "name": "Advanced Figma"},
      {"type": "guide", "name": "Tool Integration"}
    ]'::jsonb,
    '["ui-design", "collaboration"]'::jsonb,
    '["figma", "sketch", "adobe-creative-suite"]'::jsonb,
    '{"tools": ["Figma", "Sketch", "Adobe CC"]}'::jsonb
  ),
  (
    'Accessibility Design',
    'accessibility-design',
    'アクセシブルなデザインの実装',
    'advanced',
    '[
      {"type": "course", "name": "Accessibility Fundamentals"},
      {"type": "certification", "name": "IAAP Certification"},
      {"type": "guide", "name": "WCAG Guidelines"}
    ]'::jsonb,
    '["ui-design", "web-standards"]'::jsonb,
    '["wcag", "aria", "screen-readers"]'::jsonb,
    '{"standards": ["WCAG 2.1", "Section 508"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 