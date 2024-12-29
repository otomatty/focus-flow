-- 教育・指導スキル
with education_category as (
  select id from skill_categories where slug = 'education'
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
  education_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from education_category,
(values
  (
    'Instructional Design',
    'instructional-design',
    '教育コンテンツの設計と開発',
    'advanced',
    '[
      {"type": "certification", "name": "Instructional Design Professional"},
      {"type": "course", "name": "Learning Experience Design"},
      {"type": "workshop", "name": "Curriculum Development"}
    ]'::jsonb,
    '["education-theory", "content-development"]'::jsonb,
    '["curriculum-design", "learning-assessment"]'::jsonb,
    '{"frameworks": ["ADDIE", "SAM"]}'::jsonb
  ),
  (
    'Online Learning',
    'online-learning',
    'オンライン学習環境の設計と運営',
    'advanced',
    '[
      {"type": "certification", "name": "Online Learning Specialist"},
      {"type": "course", "name": "E-Learning Development"},
      {"type": "workshop", "name": "Virtual Classroom"}
    ]'::jsonb,
    '["instructional-design", "digital-tools"]'::jsonb,
    '["lms-management", "virtual-facilitation"]'::jsonb,
    '{"tools": ["LMS", "Virtual Classroom", "Authoring Tools"]}'::jsonb
  ),
  (
    'Educational Technology',
    'educational-technology',
    '教育テクノロジーの活用',
    'intermediate',
    '[
      {"type": "course", "name": "EdTech Integration"},
      {"type": "certification", "name": "Educational Technology"},
      {"type": "workshop", "name": "Digital Learning Tools"}
    ]'::jsonb,
    '["technology", "pedagogy"]'::jsonb,
    '["digital-tools", "learning-analytics"]'::jsonb,
    '{"tools": ["Learning Apps", "Assessment Tools"]}'::jsonb
  ),
  (
    'Learning Assessment',
    'learning-assessment',
    '学習評価とフィードバック',
    'advanced',
    '[
      {"type": "course", "name": "Assessment Design"},
      {"type": "certification", "name": "Assessment Specialist"},
      {"type": "workshop", "name": "Formative Assessment"}
    ]'::jsonb,
    '["education-theory", "data-analysis"]'::jsonb,
    '["assessment-design", "feedback-methods"]'::jsonb,
    '{"methodologies": ["Formative", "Summative"]}'::jsonb
  ),
  (
    'Mentoring',
    'mentoring',
    'メンタリングとコーチング',
    'advanced',
    '[
      {"type": "certification", "name": "Professional Mentor"},
      {"type": "course", "name": "Coaching Skills"},
      {"type": "workshop", "name": "Mentorship Program"}
    ]'::jsonb,
    '["communication", "leadership"]'::jsonb,
    '["coaching", "career-development"]'::jsonb,
    '{"frameworks": ["GROW Model", "Mentoring Best Practices"]}'::jsonb
  ),
  (
    'Curriculum Development',
    'curriculum-development',
    'カリキュラムの設計と開発',
    'expert',
    '[
      {"type": "certification", "name": "Curriculum Developer"},
      {"type": "course", "name": "Curriculum Design"},
      {"type": "workshop", "name": "Learning Objectives"}
    ]'::jsonb,
    '["instructional-design", "subject-expertise"]'::jsonb,
    '["learning-objectives", "content-sequencing"]'::jsonb,
    '{"frameworks": ["Backward Design", "Understanding by Design"]}'::jsonb
  ),
  (
    'Adult Learning',
    'adult-learning',
    '成人学習理論と実践',
    'advanced',
    '[
      {"type": "course", "name": "Adult Learning Theory"},
      {"type": "certification", "name": "Adult Education"},
      {"type": "workshop", "name": "Andragogy"}
    ]'::jsonb,
    '["education-theory", "psychology"]'::jsonb,
    '["andragogy", "experiential-learning"]'::jsonb,
    '{"theories": ["Andragogy", "Experiential Learning"]}'::jsonb
  ),
  (
    'Educational Leadership',
    'educational-leadership',
    '教育リーダーシップ',
    'expert',
    '[
      {"type": "certification", "name": "Educational Leader"},
      {"type": "course", "name": "Educational Administration"},
      {"type": "workshop", "name": "Program Management"}
    ]'::jsonb,
    '["leadership", "education-management"]'::jsonb,
    '["program-management", "staff-development"]'::jsonb,
    '{"frameworks": ["Educational Leadership", "Change Management"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- 研究・分析スキル
with research_category as (
  select id from skill_categories where slug = 'research'
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
  research_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from research_category,
(values
  (
    'Research Methodology',
    'research-methodology',
    '研究方法論と実験計画',
    'advanced',
    '[
      {"type": "course", "name": "Research Methods"},
      {"type": "certification", "name": "Research Professional"},
      {"type": "workshop", "name": "Research Design"}
    ]'::jsonb,
    '["statistics", "data-analysis"]'::jsonb,
    '["experimental-design", "data-collection"]'::jsonb,
    '{"methodologies": ["Quantitative", "Qualitative"]}'::jsonb
  ),
  (
    'Data Analysis',
    'research-data-analysis',
    '研究データの分析と解釈',
    'advanced',
    '[
      {"type": "course", "name": "Advanced Statistics"},
      {"type": "certification", "name": "Data Analysis"},
      {"type": "workshop", "name": "Statistical Methods"}
    ]'::jsonb,
    '["statistics", "research-methods"]'::jsonb,
    '["statistical-analysis", "data-visualization"]'::jsonb,
    '{"tools": ["R", "SPSS", "Python"]}'::jsonb
  ),
  (
    'Academic Writing',
    'academic-writing',
    '学術論文の執筆',
    'advanced',
    '[
      {"type": "course", "name": "Academic Writing"},
      {"type": "workshop", "name": "Research Publication"},
      {"type": "guide", "name": "Scientific Writing"}
    ]'::jsonb,
    '["writing", "research-methods"]'::jsonb,
    '["scientific-writing", "peer-review"]'::jsonb,
    '{"styles": ["APA", "MLA", "Chicago"]}'::jsonb
  ),
  (
    'Literature Review',
    'literature-review',
    '文献レビューと分析',
    'advanced',
    '[
      {"type": "course", "name": "Systematic Review"},
      {"type": "workshop", "name": "Literature Analysis"},
      {"type": "guide", "name": "Research Synthesis"}
    ]'::jsonb,
    '["research-methods", "academic-writing"]'::jsonb,
    '["systematic-review", "meta-analysis"]'::jsonb,
    '{"tools": ["Reference Managers", "Review Software"]}'::jsonb
  ),
  (
    'Research Ethics',
    'research-ethics',
    '研究倫理とコンプライアンス',
    'advanced',
    '[
      {"type": "certification", "name": "Research Ethics"},
      {"type": "course", "name": "Ethics in Research"},
      {"type": "workshop", "name": "Ethical Compliance"}
    ]'::jsonb,
    '["research-methods", "ethics"]'::jsonb,
    '["ethical-guidelines", "compliance"]'::jsonb,
    '{"frameworks": ["IRB", "Research Ethics Guidelines"]}'::jsonb
  ),
  (
    'Grant Writing',
    'grant-writing',
    '研究助成金の申請',
    'expert',
    '[
      {"type": "course", "name": "Grant Writing"},
      {"type": "workshop", "name": "Proposal Development"},
      {"type": "guide", "name": "Funding Applications"}
    ]'::jsonb,
    '["academic-writing", "project-planning"]'::jsonb,
    '["proposal-writing", "budget-planning"]'::jsonb,
    '{"templates": ["Grant Proposals", "Budget Templates"]}'::jsonb
  ),
  (
    'Research Project Management',
    'research-project-management',
    '研究プロジェクトの管理',
    'expert',
    '[
      {"type": "course", "name": "Research Management"},
      {"type": "certification", "name": "Project Management"},
      {"type": "workshop", "name": "Research Leadership"}
    ]'::jsonb,
    '["project-management", "research-methods"]'::jsonb,
    '["team-management", "resource-planning"]'::jsonb,
    '{"tools": ["Project Management Software", "Research Tools"]}'::jsonb
  ),
  (
    'Research Communication',
    'research-communication',
    '研究成果の発信',
    'advanced',
    '[
      {"type": "course", "name": "Science Communication"},
      {"type": "workshop", "name": "Research Presentation"},
      {"type": "guide", "name": "Public Engagement"}
    ]'::jsonb,
    '["communication", "research-methods"]'::jsonb,
    '["presentation-skills", "public-speaking"]'::jsonb,
    '{"platforms": ["Academic Conferences", "Research Networks"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 