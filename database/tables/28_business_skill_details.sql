-- アジャイル開発管理スキル
with agile_category as (
  select id from skill_categories where slug = 'agile-management'
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
  agile_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
from agile_category,
(values
  (
    'Scrum Master',
    'scrum-master',
    'スクラムチームのファシリテーターとして機能',
    'advanced',
    '[
      {"type": "certification", "name": "Professional Scrum Master"},
      {"type": "course", "name": "Advanced Scrum Master"}
    ]'::jsonb,
    '["agile-basics", "team-management"]'::jsonb,
    '["kanban", "lean-principles", "team-coaching"]'::jsonb
  ),
  (
    'Product Owner',
    'product-owner',
    'プロダクトバックログの管理とステークホルダー調整',
    'advanced',
    '[
      {"type": "certification", "name": "Professional Product Owner"},
      {"type": "course", "name": "Product Owner Fundamentals"}
    ]'::jsonb,
    '["agile-basics", "stakeholder-management"]'::jsonb,
    '["product-management", "user-story-mapping"]'::jsonb
  ),
  (
    'Agile Coaching',
    'agile-coaching',
    'アジャイルチームのコーチングとメンタリング',
    'expert',
    '[
      {"type": "certification", "name": "ICAgile Certified Professional"},
      {"type": "workshop", "name": "Agile Team Coaching"}
    ]'::jsonb,
    '["scrum-master", "team-leadership"]'::jsonb,
    '["organizational-change", "agile-scaling"]'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills)
on conflict (slug) do nothing;

-- リスク管理スキル
with risk_category as (
  select id from skill_categories where slug = 'risk-management'
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
  risk_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
from risk_category,
(values
  (
    'Risk Assessment',
    'risk-assessment',
    'プロジェクトリスクの特定と評価',
    'advanced',
    '[
      {"type": "certification", "name": "PMI-RMP"},
      {"type": "course", "name": "Project Risk Management"}
    ]'::jsonb,
    '["project-management-basics", "analytical-thinking"]'::jsonb,
    '["risk-mitigation", "risk-monitoring"]'::jsonb
  ),
  (
    'Crisis Management',
    'crisis-management',
    '危機的状況への対応と管理',
    'expert',
    '[
      {"type": "course", "name": "Crisis Management Essentials"},
      {"type": "workshop", "name": "Crisis Response Planning"}
    ]'::jsonb,
    '["risk-assessment", "leadership"]'::jsonb,
    '["emergency-response", "stakeholder-communication"]'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills)
on conflict (slug) do nothing;

-- マーケティング戦略スキル
with marketing_strategy_category as (
  select id from skill_categories where slug = 'marketing-strategy'
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
  marketing_strategy_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
from marketing_strategy_category,
(values
  (
    'Market Analysis',
    'market-analysis',
    '市場動向と競合分析',
    'advanced',
    '[
      {"type": "course", "name": "Strategic Market Analysis"},
      {"type": "guide", "name": "Competitive Intelligence"}
    ]'::jsonb,
    '["marketing-basics", "data-analysis"]'::jsonb,
    '["market-research", "competitive-analysis"]'::jsonb
  ),
  (
    'Growth Strategy',
    'growth-strategy',
    '事業成長戦略の立案と実行',
    'expert',
    '[
      {"type": "course", "name": "Business Growth Strategies"},
      {"type": "book", "name": "Strategic Growth Management"}
    ]'::jsonb,
    '["market-analysis", "business-development"]'::jsonb,
    '["market-expansion", "product-development"]'::jsonb
  ),
  (
    'Brand Strategy',
    'brand-strategy',
    'ブランド価値の構築と管理',
    'advanced',
    '[
      {"type": "course", "name": "Strategic Brand Management"},
      {"type": "workshop", "name": "Brand Building Workshop"}
    ]'::jsonb,
    '["marketing-basics", "consumer-behavior"]'::jsonb,
    '["brand-identity", "brand-positioning"]'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills)
on conflict (slug) do nothing;

-- 財務管理スキル
with financial_category as (
  select id from skill_categories where slug = 'financial-management'
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
  financial_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills
from financial_category,
(values
  (
    'Financial Planning',
    'financial-planning',
    '事業計画と予算管理',
    'advanced',
    '[
      {"type": "course", "name": "Business Financial Planning"},
      {"type": "certification", "name": "Financial Planning Professional"}
    ]'::jsonb,
    '["accounting-basics", "business-math"]'::jsonb,
    '["budgeting", "forecasting"]'::jsonb
  ),
  (
    'Investment Analysis',
    'investment-analysis',
    '投資判断と収益性分析',
    'expert',
    '[
      {"type": "course", "name": "Investment Analysis"},
      {"type": "certification", "name": "CFA"}
    ]'::jsonb,
    '["financial-planning", "statistics"]'::jsonb,
    '["portfolio-management", "risk-analysis"]'::jsonb
  ),
  (
    'Cost Management',
    'cost-management',
    'コスト最適化と効率化',
    'advanced',
    '[
      {"type": "course", "name": "Strategic Cost Management"},
      {"type": "guide", "name": "Cost Optimization Techniques"}
    ]'::jsonb,
    '["accounting-basics", "business-operations"]'::jsonb,
    '["process-optimization", "resource-allocation"]'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills)
on conflict (slug) do nothing; 