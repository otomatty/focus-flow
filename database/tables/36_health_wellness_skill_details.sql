-- 健康管理スキル
with health_management_category as (
  select id from skill_categories where slug = 'health-management'
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
  health_management_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from health_management_category,
(values
  (
    'Stress Management',
    'stress-management',
    'ストレス管理と対処法',
    'intermediate',
    '[
      {"type": "course", "name": "Stress Management"},
      {"type": "workshop", "name": "Stress Reduction"},
      {"type": "guide", "name": "Coping Strategies"}
    ]'::jsonb,
    '["self-awareness", "emotional-intelligence"]'::jsonb,
    '["relaxation-techniques", "mindfulness"]'::jsonb,
    '{"techniques": ["Meditation", "Deep Breathing"]}'::jsonb
  ),
  (
    'Work-Life Balance',
    'work-life-balance',
    'ワークライフバランスの管理',
    'intermediate',
    '[
      {"type": "course", "name": "Life Balance"},
      {"type": "workshop", "name": "Time Management"},
      {"type": "guide", "name": "Productivity"}
    ]'::jsonb,
    '["time-management", "self-awareness"]'::jsonb,
    '["boundary-setting", "productivity"]'::jsonb,
    '{"tools": ["Time Management", "Goal Setting"]}'::jsonb
  ),
  (
    'Physical Wellness',
    'physical-wellness',
    '身体的健康管理',
    'intermediate',
    '[
      {"type": "course", "name": "Physical Health"},
      {"type": "workshop", "name": "Exercise Basics"},
      {"type": "guide", "name": "Nutrition"}
    ]'::jsonb,
    '["health-awareness", "self-care"]'::jsonb,
    '["exercise", "nutrition"]'::jsonb,
    '{"areas": ["Exercise", "Nutrition", "Sleep"]}'::jsonb
  ),
  (
    'Mental Health',
    'mental-health',
    'メンタルヘルスケア',
    'intermediate',
    '[
      {"type": "course", "name": "Mental Wellness"},
      {"type": "workshop", "name": "Emotional Health"},
      {"type": "guide", "name": "Self-Care"}
    ]'::jsonb,
    '["self-awareness", "emotional-intelligence"]'::jsonb,
    '["emotional-regulation", "resilience"]'::jsonb,
    '{"practices": ["Self-Care", "Support Systems"]}'::jsonb
  ),
  (
    'Mindfulness',
    'mindfulness',
    'マインドフルネスと瞑想',
    'intermediate',
    '[
      {"type": "course", "name": "Mindfulness Practice"},
      {"type": "workshop", "name": "Meditation"},
      {"type": "guide", "name": "Present Awareness"}
    ]'::jsonb,
    '["self-awareness", "concentration"]'::jsonb,
    '["meditation", "present-awareness"]'::jsonb,
    '{"techniques": ["Meditation", "Breathing Exercises"]}'::jsonb
  ),
  (
    'Sleep Management',
    'sleep-management',
    '睡眠の質の向上',
    'intermediate',
    '[
      {"type": "course", "name": "Sleep Science"},
      {"type": "workshop", "name": "Sleep Hygiene"},
      {"type": "guide", "name": "Rest Optimization"}
    ]'::jsonb,
    '["health-awareness", "self-care"]'::jsonb,
    '["sleep-hygiene", "circadian-rhythm"]'::jsonb,
    '{"practices": ["Sleep Hygiene", "Circadian Rhythm"]}'::jsonb
  ),
  (
    'Ergonomics',
    'ergonomics',
    '人間工学とワークスペース最適化',
    'intermediate',
    '[
      {"type": "course", "name": "Workplace Ergonomics"},
      {"type": "workshop", "name": "Office Setup"},
      {"type": "guide", "name": "Posture Health"}
    ]'::jsonb,
    '["health-awareness", "body-awareness"]'::jsonb,
    '["posture", "workspace-design"]'::jsonb,
    '{"areas": ["Workspace Setup", "Posture", "Movement"]}'::jsonb
  ),
  (
    'Digital Wellness',
    'digital-wellness',
    'デジタルウェルネス',
    'intermediate',
    '[
      {"type": "course", "name": "Digital Health"},
      {"type": "workshop", "name": "Screen Time"},
      {"type": "guide", "name": "Tech Balance"}
    ]'::jsonb,
    '["self-awareness", "technology-use"]'::jsonb,
    '["digital-boundaries", "screen-management"]'::jsonb,
    '{"practices": ["Digital Detox", "Screen Breaks"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- ウェルネススキル
with wellness_category as (
  select id from skill_categories where slug = 'wellness'
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
  wellness_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from wellness_category,
(values
  (
    'Emotional Intelligence',
    'emotional-intelligence',
    '感情知性の向上',
    'advanced',
    '[
      {"type": "course", "name": "Emotional Intelligence"},
      {"type": "workshop", "name": "EQ Development"},
      {"type": "guide", "name": "Emotional Awareness"}
    ]'::jsonb,
    '["self-awareness", "empathy"]'::jsonb,
    '["emotional-awareness", "relationship-management"]'::jsonb,
    '{"components": ["Self-Awareness", "Social Skills"]}'::jsonb
  ),
  (
    'Resilience',
    'resilience',
    'レジリエンスの構築',
    'advanced',
    '[
      {"type": "course", "name": "Building Resilience"},
      {"type": "workshop", "name": "Mental Toughness"},
      {"type": "guide", "name": "Adaptability"}
    ]'::jsonb,
    '["emotional-intelligence", "self-awareness"]'::jsonb,
    '["adaptability", "stress-management"]'::jsonb,
    '{"skills": ["Adaptability", "Problem Solving"]}'::jsonb
  ),
  (
    'Personal Growth',
    'personal-growth',
    '個人の成長と発達',
    'intermediate',
    '[
      {"type": "course", "name": "Personal Development"},
      {"type": "workshop", "name": "Self-Improvement"},
      {"type": "guide", "name": "Growth Mindset"}
    ]'::jsonb,
    '["self-awareness", "learning-ability"]'::jsonb,
    '["self-development", "goal-setting"]'::jsonb,
    '{"areas": ["Self-Development", "Goal Achievement"]}'::jsonb
  ),
  (
    'Habit Formation',
    'habit-formation',
    '習慣形成と行動変容',
    'intermediate',
    '[
      {"type": "course", "name": "Habit Building"},
      {"type": "workshop", "name": "Behavior Change"},
      {"type": "guide", "name": "Routine Development"}
    ]'::jsonb,
    '["self-awareness", "discipline"]'::jsonb,
    '["behavior-change", "routine-building"]'::jsonb,
    '{"frameworks": ["Habit Loop", "Behavior Design"]}'::jsonb
  ),
  (
    'Life Purpose',
    'life-purpose',
    '人生の目的と意味の探求',
    'advanced',
    '[
      {"type": "course", "name": "Purpose Finding"},
      {"type": "workshop", "name": "Life Vision"},
      {"type": "guide", "name": "Meaning Discovery"}
    ]'::jsonb,
    '["self-awareness", "reflection"]'::jsonb,
    '["vision-setting", "value-alignment"]'::jsonb,
    '{"practices": ["Vision Setting", "Value Discovery"]}'::jsonb
  ),
  (
    'Relationship Building',
    'relationship-building',
    '人間関係の構築と維持',
    'advanced',
    '[
      {"type": "course", "name": "Relationship Skills"},
      {"type": "workshop", "name": "Connection Building"},
      {"type": "guide", "name": "Social Intelligence"}
    ]'::jsonb,
    '["emotional-intelligence", "communication"]'::jsonb,
    '["social-skills", "empathy"]'::jsonb,
    '{"skills": ["Active Listening", "Empathy"]}'::jsonb
  ),
  (
    'Financial Wellness',
    'financial-wellness',
    '財務的健康管理',
    'intermediate',
    '[
      {"type": "course", "name": "Financial Health"},
      {"type": "workshop", "name": "Money Management"},
      {"type": "guide", "name": "Financial Planning"}
    ]'::jsonb,
    '["financial-literacy", "planning"]'::jsonb,
    '["budgeting", "investment"]'::jsonb,
    '{"areas": ["Budgeting", "Investing", "Planning"]}'::jsonb
  ),
  (
    'Environmental Wellness',
    'environmental-wellness',
    '環境との調和',
    'intermediate',
    '[
      {"type": "course", "name": "Environmental Health"},
      {"type": "workshop", "name": "Sustainable Living"},
      {"type": "guide", "name": "Eco-Friendly Practices"}
    ]'::jsonb,
    '["environmental-awareness", "sustainability"]'::jsonb,
    '["sustainable-living", "eco-consciousness"]'::jsonb,
    '{"practices": ["Sustainable Living", "Environmental Care"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 