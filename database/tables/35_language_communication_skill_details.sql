-- 言語スキル
with language_category as (
  select id from skill_categories where slug = 'language'
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
  language_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from language_category,
(values
  (
    'Business English',
    'business-english',
    'ビジネス英語とコミュニケーション',
    'advanced',
    '[
      {"type": "certification", "name": "Business English Certificate"},
      {"type": "course", "name": "Professional English"},
      {"type": "workshop", "name": "Business Communication"}
    ]'::jsonb,
    '["english-intermediate", "business-basics"]'::jsonb,
    '["business-writing", "presentation-skills"]'::jsonb,
    '{"certifications": ["TOEIC", "BEC"]}'::jsonb
  ),
  (
    'Technical Writing',
    'technical-writing',
    '技術文書の作成',
    'advanced',
    '[
      {"type": "certification", "name": "Technical Writing"},
      {"type": "course", "name": "Documentation"},
      {"type": "workshop", "name": "API Documentation"}
    ]'::jsonb,
    '["writing", "technical-knowledge"]'::jsonb,
    '["documentation", "information-architecture"]'::jsonb,
    '{"tools": ["Documentation Tools", "Markdown"]}'::jsonb
  ),
  (
    'Professional Writing',
    'professional-writing',
    'ビジネス文書の作成',
    'intermediate',
    '[
      {"type": "course", "name": "Business Writing"},
      {"type": "workshop", "name": "Report Writing"},
      {"type": "guide", "name": "Professional Communication"}
    ]'::jsonb,
    '["writing", "business-communication"]'::jsonb,
    '["business-writing", "report-writing"]'::jsonb,
    '{"styles": ["Business Style", "Report Format"]}'::jsonb
  ),
  (
    'Public Speaking',
    'public-speaking',
    'プレゼンテーションとスピーチ',
    'advanced',
    '[
      {"type": "course", "name": "Public Speaking"},
      {"type": "workshop", "name": "Presentation Skills"},
      {"type": "guide", "name": "Speech Delivery"}
    ]'::jsonb,
    '["communication", "confidence"]'::jsonb,
    '["presentation", "speech-writing"]'::jsonb,
    '{"techniques": ["Speech Structure", "Delivery Methods"]}'::jsonb
  ),
  (
    'Cross-cultural Communication',
    'cross-cultural-communication',
    '異文化コミュニケーション',
    'advanced',
    '[
      {"type": "course", "name": "Cultural Intelligence"},
      {"type": "workshop", "name": "Global Communication"},
      {"type": "guide", "name": "Cultural Awareness"}
    ]'::jsonb,
    '["communication", "cultural-awareness"]'::jsonb,
    '["cultural-intelligence", "global-mindset"]'::jsonb,
    '{"frameworks": ["Cultural Dimensions", "Communication Styles"]}'::jsonb
  ),
  (
    'Translation',
    'translation',
    '翻訳とローカライゼーション',
    'advanced',
    '[
      {"type": "certification", "name": "Professional Translator"},
      {"type": "course", "name": "Translation Studies"},
      {"type": "workshop", "name": "Localization"}
    ]'::jsonb,
    '["language-proficiency", "cultural-knowledge"]'::jsonb,
    '["localization", "cultural-adaptation"]'::jsonb,
    '{"tools": ["CAT Tools", "Translation Memory"]}'::jsonb
  ),
  (
    'Interpretation',
    'interpretation',
    '通訳とリアルタイム翻訳',
    'expert',
    '[
      {"type": "certification", "name": "Professional Interpreter"},
      {"type": "course", "name": "Interpretation Skills"},
      {"type": "workshop", "name": "Simultaneous Interpretation"}
    ]'::jsonb,
    '["language-proficiency", "quick-thinking"]'::jsonb,
    '["simultaneous-interpretation", "consecutive-interpretation"]'::jsonb,
    '{"types": ["Simultaneous", "Consecutive"]}'::jsonb
  ),
  (
    'Language Teaching',
    'language-teaching',
    '言語教育と指導',
    'advanced',
    '[
      {"type": "certification", "name": "Language Teacher"},
      {"type": "course", "name": "Teaching Methodology"},
      {"type": "workshop", "name": "Language Instruction"}
    ]'::jsonb,
    '["language-proficiency", "teaching-skills"]'::jsonb,
    '["teaching-methodology", "curriculum-design"]'::jsonb,
    '{"methodologies": ["Communicative", "Task-based"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- コミュニケーションスキル
with communication_category as (
  select id from skill_categories where slug = 'communication'
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
  communication_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from communication_category,
(values
  (
    'Interpersonal Communication',
    'interpersonal-communication',
    '対人コミュニケーション',
    'intermediate',
    '[
      {"type": "course", "name": "Interpersonal Skills"},
      {"type": "workshop", "name": "Communication Skills"},
      {"type": "guide", "name": "Effective Communication"}
    ]'::jsonb,
    '["communication-basics", "emotional-intelligence"]'::jsonb,
    '["active-listening", "nonverbal-communication"]'::jsonb,
    '{"skills": ["Active Listening", "Empathy"]}'::jsonb
  ),
  (
    'Team Communication',
    'team-communication',
    'チームコミュニケーション',
    'intermediate',
    '[
      {"type": "course", "name": "Team Dynamics"},
      {"type": "workshop", "name": "Group Communication"},
      {"type": "guide", "name": "Team Collaboration"}
    ]'::jsonb,
    '["interpersonal-communication", "team-work"]'::jsonb,
    '["collaboration", "conflict-resolution"]'::jsonb,
    '{"tools": ["Collaboration Tools", "Communication Platforms"]}'::jsonb
  ),
  (
    'Leadership Communication',
    'leadership-communication',
    'リーダーシップコミュニケーション',
    'advanced',
    '[
      {"type": "course", "name": "Leadership Communication"},
      {"type": "workshop", "name": "Executive Presence"},
      {"type": "guide", "name": "Influential Communication"}
    ]'::jsonb,
    '["communication", "leadership"]'::jsonb,
    '["influence", "executive-presence"]'::jsonb,
    '{"frameworks": ["Leadership Styles", "Communication Strategy"]}'::jsonb
  ),
  (
    'Crisis Communication',
    'crisis-communication',
    '危機管理コミュニケーション',
    'expert',
    '[
      {"type": "course", "name": "Crisis Management"},
      {"type": "workshop", "name": "Emergency Response"},
      {"type": "guide", "name": "Crisis Planning"}
    ]'::jsonb,
    '["communication", "risk-management"]'::jsonb,
    '["crisis-management", "media-relations"]'::jsonb,
    '{"frameworks": ["Crisis Response", "Communication Protocol"]}'::jsonb
  ),
  (
    'Digital Communication',
    'digital-communication',
    'デジタルコミュニケーション',
    'intermediate',
    '[
      {"type": "course", "name": "Digital Communication"},
      {"type": "workshop", "name": "Online Presence"},
      {"type": "guide", "name": "Digital Etiquette"}
    ]'::jsonb,
    '["communication", "digital-literacy"]'::jsonb,
    '["online-communication", "social-media"]'::jsonb,
    '{"platforms": ["Email", "Social Media", "Messaging"]}'::jsonb
  ),
  (
    'Negotiation',
    'negotiation',
    '交渉とコンフリクト解決',
    'advanced',
    '[
      {"type": "course", "name": "Negotiation Skills"},
      {"type": "workshop", "name": "Conflict Resolution"},
      {"type": "guide", "name": "Deal Making"}
    ]'::jsonb,
    '["communication", "problem-solving"]'::jsonb,
    '["conflict-resolution", "persuasion"]'::jsonb,
    '{"techniques": ["Win-Win", "BATNA"]}'::jsonb
  ),
  (
    'Facilitation',
    'facilitation',
    'ファシリテーションとグループ進行',
    'advanced',
    '[
      {"type": "course", "name": "Facilitation Skills"},
      {"type": "workshop", "name": "Group Dynamics"},
      {"type": "guide", "name": "Meeting Management"}
    ]'::jsonb,
    '["communication", "group-dynamics"]'::jsonb,
    '["meeting-management", "group-facilitation"]'::jsonb,
    '{"techniques": ["Group Process", "Decision Making"]}'::jsonb
  ),
  (
    'Storytelling',
    'storytelling',
    'ストーリーテリングと説得力',
    'advanced',
    '[
      {"type": "course", "name": "Business Storytelling"},
      {"type": "workshop", "name": "Narrative Skills"},
      {"type": "guide", "name": "Story Structure"}
    ]'::jsonb,
    '["communication", "creativity"]'::jsonb,
    '["narrative-design", "presentation"]'::jsonb,
    '{"frameworks": ["Story Arc", "Narrative Elements"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 