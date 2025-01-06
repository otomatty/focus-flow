-- プロジェクトマネジメントスキル
with project_management_category as (
  select id from ff_skills.skill_categories where slug = 'project-management'
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
    'Project Planning',
    'project-planning',
    'プロジェクト計画の立案と管理',
    'advanced',
    '[
      {"type": "certification", "name": "PMP"},
      {"type": "course", "name": "Project Management Professional"},
      {"type": "workshop", "name": "Project Planning"}
    ]'::jsonb,
    '["management", "planning"]'::jsonb,
    '["risk-management", "resource-planning"]'::jsonb,
    '{"frameworks": ["PMI", "PRINCE2"]}'::jsonb
  ),
  (
    'Agile Management',
    'agile-management',
    'アジャイル手法によるプロジェクト管理',
    'advanced',
    '[
      {"type": "certification", "name": "Scrum Master"},
      {"type": "course", "name": "Agile Project Management"},
      {"type": "workshop", "name": "Scrum Training"}
    ]'::jsonb,
    '["project-management", "team-leadership"]'::jsonb,
    '["scrum", "kanban", "lean"]'::jsonb,
    '{"frameworks": ["Scrum", "Kanban", "SAFe"]}'::jsonb
  ),
  (
    'Risk Management',
    'risk-management',
    'プロジェクトリスクの特定と管理',
    'advanced',
    '[
      {"type": "certification", "name": "Risk Management Professional"},
      {"type": "course", "name": "Project Risk Management"},
      {"type": "workshop", "name": "Risk Assessment"}
    ]'::jsonb,
    '["project-management", "analysis"]'::jsonb,
    '["risk-assessment", "mitigation-planning"]'::jsonb,
    '{"methodologies": ["PMBOK Risk", "ISO 31000"]}'::jsonb
  ),
  (
    'Stakeholder Management',
    'stakeholder-management',
    'ステークホルダーとの関係構築と管理',
    'advanced',
    '[
      {"type": "course", "name": "Stakeholder Engagement"},
      {"type": "workshop", "name": "Communication Strategy"},
      {"type": "guide", "name": "Stakeholder Analysis"}
    ]'::jsonb,
    '["communication", "relationship-management"]'::jsonb,
    '["negotiation", "influence"]'::jsonb,
    '{"tools": ["Stakeholder Matrix", "Communication Plan"]}'::jsonb
  ),
  (
    'Resource Management',
    'resource-management',
    'プロジェクトリソースの最適化',
    'advanced',
    '[
      {"type": "course", "name": "Resource Planning"},
      {"type": "workshop", "name": "Resource Optimization"},
      {"type": "guide", "name": "Capacity Planning"}
    ]'::jsonb,
    '["project-management", "planning"]'::jsonb,
    '["capacity-planning", "budget-management"]'::jsonb,
    '{"tools": ["Resource Planning Software", "Capacity Tools"]}'::jsonb
  ),
  (
    'Quality Management',
    'quality-management',
    'プロジェクト品質の保証と管理',
    'advanced',
    '[
      {"type": "certification", "name": "Quality Management Professional"},
      {"type": "course", "name": "Project Quality Management"},
      {"type": "workshop", "name": "Quality Assurance"}
    ]'::jsonb,
    '["project-management", "process-improvement"]'::jsonb,
    '["quality-assurance", "process-control"]'::jsonb,
    '{"frameworks": ["Six Sigma", "TQM"]}'::jsonb
  ),
  (
    'Change Management',
    'change-management',
    '組織変革の管理と実施',
    'expert',
    '[
      {"type": "certification", "name": "Change Management Professional"},
      {"type": "course", "name": "Organizational Change"},
      {"type": "workshop", "name": "Change Leadership"}
    ]'::jsonb,
    '["leadership", "organizational-development"]'::jsonb,
    '["organizational-change", "leadership"]'::jsonb,
    '{"models": ["Kotter", "ADKAR"]}'::jsonb
  ),
  (
    'Program Management',
    'program-management',
    '複数プロジェクトの統合管理',
    'expert',
    '[
      {"type": "certification", "name": "Program Management Professional"},
      {"type": "course", "name": "Program Management"},
      {"type": "workshop", "name": "Portfolio Management"}
    ]'::jsonb,
    '["project-management", "strategic-planning"]'::jsonb,
    '["portfolio-management", "strategic-alignment"]'::jsonb,
    '{"frameworks": ["MSP", "Program Management"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- ビジネス戦略スキル
with business_strategy_category as (
  select id from ff_skills.skill_categories where slug = 'business-strategy'
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
      {"type": "certification", "name": "Strategic Management Professional"},
      {"type": "course", "name": "Business Strategy"},
      {"type": "workshop", "name": "Strategic Planning"}
    ]'::jsonb,
    '["business-analysis", "market-research"]'::jsonb,
    '["strategic-analysis", "business-development"]'::jsonb,
    '{"frameworks": ["Porter Five Forces", "SWOT"]}'::jsonb
  ),
  (
    'Business Analysis',
    'business-analysis',
    'ビジネス分析と意思決定',
    'advanced',
    '[
      {"type": "certification", "name": "Business Analysis Professional"},
      {"type": "course", "name": "Business Analytics"},
      {"type": "workshop", "name": "Data-Driven Decision Making"}
    ]'::jsonb,
    '["data-analysis", "business-knowledge"]'::jsonb,
    '["data-analytics", "process-analysis"]'::jsonb,
    '{"tools": ["Business Intelligence", "Analytics Software"]}'::jsonb
  ),
  (
    'Market Research',
    'market-research',
    '市場調査と分析',
    'advanced',
    '[
      {"type": "course", "name": "Market Research Methods"},
      {"type": "workshop", "name": "Consumer Insights"},
      {"type": "guide", "name": "Market Analysis"}
    ]'::jsonb,
    '["research-methods", "data-analysis"]'::jsonb,
    '["consumer-behavior", "market-analysis"]'::jsonb,
    '{"methodologies": ["Qualitative", "Quantitative"]}'::jsonb
  ),
  (
    'Innovation Management',
    'innovation-management',
    'イノベーション戦略の立案と実行',
    'expert',
    '[
      {"type": "certification", "name": "Innovation Management"},
      {"type": "course", "name": "Innovation Strategy"},
      {"type": "workshop", "name": "Design Thinking"}
    ]'::jsonb,
    '["strategic-thinking", "creativity"]'::jsonb,
    '["design-thinking", "product-innovation"]'::jsonb,
    '{"frameworks": ["Design Thinking", "Open Innovation"]}'::jsonb
  ),
  (
    'Digital Transformation',
    'digital-transformation',
    'デジタル変革の推進',
    'expert',
    '[
      {"type": "certification", "name": "Digital Transformation"},
      {"type": "course", "name": "Digital Strategy"},
      {"type": "workshop", "name": "Digital Leadership"}
    ]'::jsonb,
    '["technology", "change-management"]'::jsonb,
    '["digital-strategy", "technology-adoption"]'::jsonb,
    '{"frameworks": ["Digital Maturity", "Technology Adoption"]}'::jsonb
  ),
  (
    'Business Development',
    'business-development',
    '事業開発と成長戦略',
    'expert',
    '[
      {"type": "course", "name": "Business Development"},
      {"type": "workshop", "name": "Growth Strategy"},
      {"type": "guide", "name": "Partnership Development"}
    ]'::jsonb,
    '["strategic-planning", "relationship-management"]'::jsonb,
    '["partnership-development", "market-expansion"]'::jsonb,
    '{"frameworks": ["Growth Strategy", "Partnership Models"]}'::jsonb
  ),
  (
    'Financial Strategy',
    'financial-strategy',
    '財務戦略の立案と実行',
    'expert',
    '[
      {"type": "certification", "name": "Financial Strategy"},
      {"type": "course", "name": "Corporate Finance"},
      {"type": "workshop", "name": "Financial Planning"}
    ]'::jsonb,
    '["finance", "strategic-planning"]'::jsonb,
    '["financial-planning", "investment-strategy"]'::jsonb,
    '{"frameworks": ["Financial Planning", "Investment Analysis"]}'::jsonb
  ),
  (
    'Organizational Development',
    'organizational-development',
    '組織開発と文化変革',
    'expert',
    '[
      {"type": "certification", "name": "Organization Development"},
      {"type": "course", "name": "Culture Change"},
      {"type": "workshop", "name": "Organizational Design"}
    ]'::jsonb,
    '["leadership", "change-management"]'::jsonb,
    '["culture-change", "organizational-design"]'::jsonb,
    '{"frameworks": ["Organization Design", "Culture Change"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 