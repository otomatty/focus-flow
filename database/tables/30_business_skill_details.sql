-- インフラストラクチャスキル
with infrastructure_category as (
  select id from skill_categories where slug = 'infrastructure'
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
  infrastructure_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from infrastructure_category,
(values
  (
    'Cloud Architecture',
    'cloud-architecture',
    'クラウドインフラストラクチャの設計と実装',
    'expert',
    '[
      {"type": "certification", "name": "AWS Solutions Architect"},
      {"type": "course", "name": "Cloud Architecture Design"},
      {"type": "workshop", "name": "Multi-cloud Strategy"}
    ]'::jsonb,
    '["networking", "security"]'::jsonb,
    '["aws", "azure", "gcp"]'::jsonb,
    '{"platforms": ["AWS", "Azure", "GCP"]}'::jsonb
  ),
  (
    'DevOps',
    'devops',
    'DevOpsプラクティスと自動化',
    'advanced',
    '[
      {"type": "certification", "name": "DevOps Engineer"},
      {"type": "course", "name": "DevOps Practices"},
      {"type": "workshop", "name": "CI/CD Pipeline"}
    ]'::jsonb,
    '["linux", "scripting"]'::jsonb,
    '["ci-cd", "infrastructure-as-code"]'::jsonb,
    '{"tools": ["Jenkins", "GitLab", "GitHub Actions"]}'::jsonb
  ),
  (
    'Container Orchestration',
    'container-orchestration',
    'コンテナオーケストレーションと管理',
    'advanced',
    '[
      {"type": "certification", "name": "Kubernetes Administrator"},
      {"type": "course", "name": "Container Orchestration"},
      {"type": "workshop", "name": "Kubernetes in Production"}
    ]'::jsonb,
    '["docker", "linux"]'::jsonb,
    '["kubernetes", "docker-swarm"]'::jsonb,
    '{"tools": ["Kubernetes", "Docker", "Helm"]}'::jsonb
  ),
  (
    'Network Security',
    'network-security',
    'ネットワークセキュリティの実装',
    'expert',
    '[
      {"type": "certification", "name": "Network Security Expert"},
      {"type": "course", "name": "Security Architecture"},
      {"type": "workshop", "name": "Threat Detection"}
    ]'::jsonb,
    '["networking", "cryptography"]'::jsonb,
    '["firewall", "ids-ips", "vpn"]'::jsonb,
    '{"tools": ["Wireshark", "Nmap", "Snort"]}'::jsonb
  ),
  (
    'Infrastructure Monitoring',
    'infrastructure-monitoring',
    'インフラストラクチャの監視と分析',
    'advanced',
    '[
      {"type": "course", "name": "Monitoring Systems"},
      {"type": "certification", "name": "Prometheus Certified"},
      {"type": "workshop", "name": "Observability"}
    ]'::jsonb,
    '["linux", "networking"]'::jsonb,
    '["prometheus", "grafana", "elk-stack"]'::jsonb,
    '{"tools": ["Prometheus", "Grafana", "ELK Stack"]}'::jsonb
  ),
  (
    'Site Reliability Engineering',
    'sre',
    'サイト信頼性エンジニアリング',
    'expert',
    '[
      {"type": "course", "name": "SRE Fundamentals"},
      {"type": "certification", "name": "Google SRE"},
      {"type": "book", "name": "Site Reliability Engineering"}
    ]'::jsonb,
    '["devops", "programming"]'::jsonb,
    '["automation", "incident-management"]'::jsonb,
    '{"methodologies": ["SLO", "Error Budgets"]}'::jsonb
  ),
  (
    'Infrastructure as Code',
    'infrastructure-as-code',
    'インフラストラクチャのコード化',
    'advanced',
    '[
      {"type": "course", "name": "IaC with Terraform"},
      {"type": "certification", "name": "HashiCorp Certified"},
      {"type": "workshop", "name": "Cloud Formation"}
    ]'::jsonb,
    '["cloud-platforms", "scripting"]'::jsonb,
    '["terraform", "ansible", "cloudformation"]'::jsonb,
    '{"tools": ["Terraform", "Ansible", "CloudFormation"]}'::jsonb
  ),
  (
    'Cloud Security',
    'cloud-security',
    'クラウドセキュリティの実装',
    'expert',
    '[
      {"type": "certification", "name": "Cloud Security Professional"},
      {"type": "course", "name": "Cloud Security Architecture"},
      {"type": "workshop", "name": "Security Controls"}
    ]'::jsonb,
    '["security", "cloud-platforms"]'::jsonb,
    '["identity-management", "encryption"]'::jsonb,
    '{"frameworks": ["CSA", "ISO 27017"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- プロジェクトマネジメントスキル
with project_management_category as (
  select id from skill_categories where slug = 'project-management'
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
  project_management_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from project_management_category,
(values
  (
    'Agile Project Management',
    'agile-project-management',
    'アジャイル手法によるプロジェクト管理',
    'advanced',
    '[
      {"type": "certification", "name": "PMI-ACP"},
      {"type": "course", "name": "Agile Methodologies"},
      {"type": "workshop", "name": "Scrum Master"}
    ]'::jsonb,
    '["project-basics", "team-management"]'::jsonb,
    '["scrum", "kanban", "lean"]'::jsonb,
    '{"frameworks": ["Scrum", "Kanban", "SAFe"]}'::jsonb
  ),
  (
    'Risk Management',
    'risk-management',
    'プロジェクトリスクの管理',
    'advanced',
    '[
      {"type": "certification", "name": "Risk Management Professional"},
      {"type": "course", "name": "Project Risk Management"},
      {"type": "workshop", "name": "Risk Analysis"}
    ]'::jsonb,
    '["project-management", "analytics"]'::jsonb,
    '["risk-analysis", "mitigation-planning"]'::jsonb,
    '{"methodologies": ["PMBOK", "ISO 31000"]}'::jsonb
  ),
  (
    'Stakeholder Management',
    'stakeholder-management',
    'ステークホルダーとの関係管理',
    'advanced',
    '[
      {"type": "course", "name": "Stakeholder Engagement"},
      {"type": "workshop", "name": "Communication Strategy"},
      {"type": "guide", "name": "Influence Management"}
    ]'::jsonb,
    '["communication", "leadership"]'::jsonb,
    '["negotiation", "conflict-resolution"]'::jsonb,
    '{"frameworks": ["Stakeholder Analysis", "Power/Interest Grid"]}'::jsonb
  ),
  (
    'Program Management',
    'program-management',
    '複数プロジェクトの統合管理',
    'expert',
    '[
      {"type": "certification", "name": "PgMP"},
      {"type": "course", "name": "Program Management"},
      {"type": "workshop", "name": "Portfolio Strategy"}
    ]'::jsonb,
    '["project-management", "strategy"]'::jsonb,
    '["portfolio-management", "resource-optimization"]'::jsonb,
    '{"methodologies": ["MSP", "PgMP Framework"]}'::jsonb
  ),
  (
    'Change Management',
    'change-management',
    '組織変革の管理',
    'expert',
    '[
      {"type": "certification", "name": "Change Management Professional"},
      {"type": "course", "name": "Organizational Change"},
      {"type": "workshop", "name": "Change Leadership"}
    ]'::jsonb,
    '["leadership", "organizational-behavior"]'::jsonb,
    '["change-strategy", "resistance-management"]'::jsonb,
    '{"frameworks": ["ADKAR", "Kotter 8-Step"]}'::jsonb
  ),
  (
    'Quality Management',
    'quality-management',
    'プロジェクト品質の管理',
    'advanced',
    '[
      {"type": "certification", "name": "Quality Management Professional"},
      {"type": "course", "name": "Quality Assurance"},
      {"type": "workshop", "name": "Process Improvement"}
    ]'::jsonb,
    '["process-management", "statistics"]'::jsonb,
    '["quality-assurance", "process-optimization"]'::jsonb,
    '{"methodologies": ["Six Sigma", "TQM"]}'::jsonb
  ),
  (
    'Resource Management',
    'resource-management',
    'プロジェクトリソースの最適化',
    'advanced',
    '[
      {"type": "course", "name": "Resource Optimization"},
      {"type": "workshop", "name": "Capacity Planning"},
      {"type": "guide", "name": "Resource Allocation"}
    ]'::jsonb,
    '["project-management", "analytics"]'::jsonb,
    '["capacity-planning", "resource-forecasting"]'::jsonb,
    '{"tools": ["Resource Management Software"]}'::jsonb
  ),
  (
    'Project Leadership',
    'project-leadership',
    'プロジェクトリーダーシップ',
    'expert',
    '[
      {"type": "course", "name": "Project Leadership"},
      {"type": "workshop", "name": "Team Building"},
      {"type": "certification", "name": "Leadership Professional"}
    ]'::jsonb,
    '["management", "communication"]'::jsonb,
    '["team-building", "motivation", "coaching"]'::jsonb,
    '{"frameworks": ["Situational Leadership", "Emotional Intelligence"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 

-- ビジネス戦略スキル
with business_strategy_category as (
  select id from skill_categories where slug = 'business-strategy'
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
  business_strategy_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from business_strategy_category,
(values
  (
    'Strategic Planning',
    'strategic-planning',
    '事業戦略の立案と実行',
    'expert',
    '[
      {"type": "course", "name": "Strategic Management"},
      {"type": "certification", "name": "Strategic Planning Professional"},
      {"type": "workshop", "name": "Business Strategy"}
    ]'::jsonb,
    '["business-analysis", "market-research"]'::jsonb,
    '["business-model-design", "strategic-analysis"]'::jsonb,
    '{"frameworks": ["SWOT", "Porter Five Forces"]}'::jsonb
  ),
  (
    'Market Analysis',
    'market-analysis',
    '市場分析と競合調査',
    'advanced',
    '[
      {"type": "course", "name": "Market Research Methods"},
      {"type": "certification", "name": "Market Research Professional"},
      {"type": "workshop", "name": "Competitive Analysis"}
    ]'::jsonb,
    '["data-analysis", "industry-knowledge"]'::jsonb,
    '["market-research", "competitor-analysis"]'::jsonb,
    '{"tools": ["Market Research Tools", "Analytics Platforms"]}'::jsonb
  ),
  (
    'Financial Strategy',
    'financial-strategy',
    '財務戦略の立案と実行',
    'expert',
    '[
      {"type": "certification", "name": "Financial Strategy Professional"},
      {"type": "course", "name": "Corporate Finance"},
      {"type": "workshop", "name": "Financial Planning"}
    ]'::jsonb,
    '["finance", "accounting"]'::jsonb,
    '["financial-planning", "investment-analysis"]'::jsonb,
    '{"frameworks": ["Financial Modeling", "Valuation"]}'::jsonb
  ),
  (
    'Business Development',
    'business-development',
    '事業開発と成長戦略',
    'advanced',
    '[
      {"type": "course", "name": "Business Development Strategy"},
      {"type": "workshop", "name": "Growth Hacking"},
      {"type": "guide", "name": "Partnership Development"}
    ]'::jsonb,
    '["sales", "marketing"]'::jsonb,
    '["partnership-development", "market-expansion"]'::jsonb,
    '{"methodologies": ["Growth Hacking", "Lean Startup"]}'::jsonb
  ),
  (
    'Innovation Management',
    'innovation-management',
    'イノベーション戦略の管理',
    'expert',
    '[
      {"type": "course", "name": "Innovation Strategy"},
      {"type": "certification", "name": "Innovation Management"},
      {"type": "workshop", "name": "Design Thinking"}
    ]'::jsonb,
    '["strategy", "creativity"]'::jsonb,
    '["design-thinking", "innovation-process"]'::jsonb,
    '{"frameworks": ["Design Thinking", "Blue Ocean Strategy"]}'::jsonb
  ),
  (
    'Digital Transformation',
    'digital-transformation',
    'デジタル変革の戦略と実行',
    'expert',
    '[
      {"type": "course", "name": "Digital Transformation Strategy"},
      {"type": "certification", "name": "Digital Business"},
      {"type": "workshop", "name": "Change Management"}
    ]'::jsonb,
    '["technology", "change-management"]'::jsonb,
    '["digital-strategy", "technology-adoption"]'::jsonb,
    '{"frameworks": ["Digital Maturity Model", "Technology Adoption"]}'::jsonb
  ),
  (
    'Corporate Strategy',
    'corporate-strategy',
    '企業戦略の立案と実行',
    'expert',
    '[
      {"type": "course", "name": "Corporate Strategy"},
      {"type": "certification", "name": "Strategic Management"},
      {"type": "workshop", "name": "Portfolio Strategy"}
    ]'::jsonb,
    '["business-strategy", "finance"]'::jsonb,
    '["portfolio-management", "mergers-acquisitions"]'::jsonb,
    '{"frameworks": ["BCG Matrix", "Ansoff Matrix"]}'::jsonb
  ),
  (
    'Sustainability Strategy',
    'sustainability-strategy',
    'サステナビリティ戦略の立案',
    'advanced',
    '[
      {"type": "course", "name": "Sustainable Business Strategy"},
      {"type": "certification", "name": "ESG Professional"},
      {"type": "workshop", "name": "Sustainable Innovation"}
    ]'::jsonb,
    '["sustainability", "business-strategy"]'::jsonb,
    '["esg-management", "sustainable-innovation"]'::jsonb,
    '{"frameworks": ["ESG", "SDGs"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- 製品開発スキル
with product_development_category as (
  select id from skill_categories where slug = 'product-development'
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
  product_development_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from product_development_category,
(values
  (
    'Product Strategy',
    'product-strategy',
    '製品戦略の立案と実行',
    'expert',
    '[
      {"type": "course", "name": "Product Strategy"},
      {"type": "certification", "name": "Product Management"},
      {"type": "workshop", "name": "Product Vision"}
    ]'::jsonb,
    '["market-research", "business-strategy"]'::jsonb,
    '["product-vision", "roadmap-planning"]'::jsonb,
    '{"frameworks": ["Product Vision Board", "Lean Canvas"]}'::jsonb
  ),
  (
    'Product Management',
    'product-management',
    '製品管理とライフサイクル',
    'advanced',
    '[
      {"type": "course", "name": "Product Management Fundamentals"},
      {"type": "certification", "name": "Product Owner"},
      {"type": "workshop", "name": "Product Discovery"}
    ]'::jsonb,
    '["agile", "user-research"]'::jsonb,
    '["product-discovery", "product-metrics"]'::jsonb,
    '{"methodologies": ["Agile", "Lean Product"]}'::jsonb
  ),
  (
    'User Research',
    'user-research',
    'ユーザー調査と分析',
    'intermediate',
    '[
      {"type": "course", "name": "User Research Methods"},
      {"type": "certification", "name": "UX Research"},
      {"type": "workshop", "name": "Customer Discovery"}
    ]'::jsonb,
    '["research-methods", "data-analysis"]'::jsonb,
    '["user-interviews", "usability-testing"]'::jsonb,
    '{"tools": ["UserTesting", "Maze", "Lookback"]}'::jsonb
  ),
  (
    'Product Design',
    'product-design',
    '製品デザインとプロトタイピング',
    'advanced',
    '[
      {"type": "course", "name": "Product Design Process"},
      {"type": "certification", "name": "Product Design"},
      {"type": "workshop", "name": "Design Sprint"}
    ]'::jsonb,
    '["design-thinking", "user-research"]'::jsonb,
    '["prototyping", "interaction-design"]'::jsonb,
    '{"methodologies": ["Design Sprint", "Double Diamond"]}'::jsonb
  ),
  (
    'Product Analytics',
    'product-analytics',
    '製品分析とメトリクス',
    'advanced',
    '[
      {"type": "course", "name": "Product Analytics"},
      {"type": "certification", "name": "Analytics Professional"},
      {"type": "workshop", "name": "Metrics Framework"}
    ]'::jsonb,
    '["data-analysis", "statistics"]'::jsonb,
    '["metrics-definition", "data-visualization"]'::jsonb,
    '{"tools": ["Amplitude", "Mixpanel", "Google Analytics"]}'::jsonb
  ),
  (
    'Product Marketing',
    'product-marketing',
    '製品マーケティングと市場投入',
    'advanced',
    '[
      {"type": "course", "name": "Product Marketing"},
      {"type": "certification", "name": "Product Marketing Manager"},
      {"type": "workshop", "name": "Go-to-Market Strategy"}
    ]'::jsonb,
    '["marketing", "product-management"]'::jsonb,
    '["go-to-market", "positioning"]'::jsonb,
    '{"frameworks": ["Positioning Canvas", "Value Proposition"]}'::jsonb
  ),
  (
    'Product Operations',
    'product-operations',
    '製品運用とスケーリング',
    'advanced',
    '[
      {"type": "course", "name": "Product Operations"},
      {"type": "workshop", "name": "Operational Excellence"},
      {"type": "guide", "name": "Scale Product Org"}
    ]'::jsonb,
    '["operations", "product-management"]'::jsonb,
    '["process-optimization", "team-coordination"]'::jsonb,
    '{"tools": ["Product Ops Tools", "Workflow Management"]}'::jsonb
  ),
  (
    'Technical Product Management',
    'technical-product-management',
    '技術的な製品管理',
    'expert',
    '[
      {"type": "course", "name": "Technical Product Management"},
      {"type": "certification", "name": "Technical Product Manager"},
      {"type": "workshop", "name": "Technical Discovery"}
    ]'::jsonb,
    '["product-management", "software-development"]'::jsonb,
    '["system-architecture", "api-design"]'::jsonb,
    '{"domains": ["API Products", "Developer Tools"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 