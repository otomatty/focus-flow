-- コンテンツ制作スキル
with content_category as (
  select id from ff_skills.skill_categories where slug = 'content-creation'
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
  content_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from content_category,
(values
  (
    'Video Production',
    'video-production',
    '動画企画から編集までの総合的な制作スキル',
    'advanced',
    '[
      {"type": "course", "name": "Complete Video Production"},
      {"type": "certification", "name": "Adobe Certified Professional"},
      {"type": "workshop", "name": "Professional Video Editing"}
    ]'::jsonb,
    '["basic-photography", "storytelling"]'::jsonb,
    '["video-editing", "color-grading", "motion-graphics"]'::jsonb,
    '{"recommended_tools": ["Adobe Premiere Pro", "DaVinci Resolve"]}'::jsonb
  ),
  (
    'Video Editing',
    'video-editing',
    '動画編集の専門的なスキル',
    'intermediate',
    '[
      {"type": "course", "name": "Advanced Video Editing"},
      {"type": "tutorial", "name": "Premiere Pro Masterclass"}
    ]'::jsonb,
    '["basic-video-production"]'::jsonb,
    '["audio-editing", "visual-effects"]'::jsonb,
    '{"software": {"premiere": "2023", "finalcut": "10.6.5"}}'::jsonb
  ),
  (
    'Motion Graphics',
    'motion-graphics',
    'アニメーションとグラフィックデザインの融合',
    'advanced',
    '[
      {"type": "course", "name": "After Effects Complete"},
      {"type": "tutorial", "name": "Motion Graphics Fundamentals"}
    ]'::jsonb,
    '["graphic-design", "animation-basics"]'::jsonb,
    '["3d-animation", "visual-effects"]'::jsonb,
    '{"software": {"after-effects": "2023", "cinema4d": "R25"}}'::jsonb
  ),
  (
    'Content Writing',
    'content-writing',
    'デジタルコンテンツのライティング',
    'intermediate',
    '[
      {"type": "course", "name": "Digital Content Writing"},
      {"type": "guide", "name": "SEO Writing Guide"}
    ]'::jsonb,
    '["basic-writing", "research-skills"]'::jsonb,
    '["seo-optimization", "copywriting"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Technical Writing',
    'technical-writing',
    '技術文書の作成と管理',
    'advanced',
    '[
      {"type": "certification", "name": "Certified Professional Technical Communicator"},
      {"type": "course", "name": "Technical Documentation"}
    ]'::jsonb,
    '["content-writing", "technical-knowledge"]'::jsonb,
    '["api-documentation", "user-guides"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Illustration',
    'illustration',
    'デジタルイラストレーション',
    'advanced',
    '[
      {"type": "course", "name": "Digital Illustration Mastery"},
      {"type": "workshop", "name": "Character Design"}
    ]'::jsonb,
    '["drawing-basics", "color-theory"]'::jsonb,
    '["concept-art", "character-design"]'::jsonb,
    '{"software": {"photoshop": "2023", "procreate": "5.3"}}'::jsonb
  ),
  (
    'Photography',
    'photography',
    'デジタル写真撮影と編集',
    'intermediate',
    '[
      {"type": "course", "name": "Digital Photography"},
      {"type": "workshop", "name": "Lightroom Editing"}
    ]'::jsonb,
    '["composition", "lighting-basics"]'::jsonb,
    '["photo-editing", "studio-photography"]'::jsonb,
    '{"equipment": ["DSLR", "Mirrorless"], "software": {"lightroom": "2023"}}'::jsonb
  ),
  (
    'Content Strategy',
    'content-strategy',
    'コンテンツ戦略の立案と実行',
    'expert',
    '[
      {"type": "course", "name": "Content Strategy for Professionals"},
      {"type": "certification", "name": "Content Marketing Institute Certification"}
    ]'::jsonb,
    '["content-writing", "marketing-basics"]'::jsonb,
    '["content-marketing", "audience-analysis"]'::jsonb,
    '{}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- 音楽・オーディオスキル
with audio_category as (
  select id from ff_skills.skill_categories where slug = 'music-audio'
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
  audio_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from audio_category,
(values
  (
    'Music Production',
    'music-production',
    '音楽制作の総合的なスキル',
    'advanced',
    '[
      {"type": "course", "name": "Music Production Masterclass"},
      {"type": "certification", "name": "Ableton Certified Trainer"}
    ]'::jsonb,
    '["music-theory", "audio-basics"]'::jsonb,
    '["mixing", "mastering", "sound-design"]'::jsonb,
    '{"software": {"ableton": "11", "logic-pro": "10.7"}}'::jsonb
  ),
  (
    'Audio Engineering',
    'audio-engineering',
    'オーディオの録音と編集',
    'advanced',
    '[
      {"type": "course", "name": "Professional Audio Engineering"},
      {"type": "certification", "name": "Pro Tools Certified Operator"}
    ]'::jsonb,
    '["audio-basics", "acoustics"]'::jsonb,
    '["studio-recording", "live-sound"]'::jsonb,
    '{"software": {"pro-tools": "2023", "studio-one": "6"}}'::jsonb
  ),
  (
    'Sound Design',
    'sound-design',
    '音響効果とサウンドデザイン',
    'advanced',
    '[
      {"type": "course", "name": "Sound Design for Media"},
      {"type": "workshop", "name": "Synthesis Masterclass"}
    ]'::jsonb,
    '["audio-engineering", "synthesis-basics"]'::jsonb,
    '["foley-art", "synthesis", "game-audio"]'::jsonb,
    '{"software": {"massive": "2.0", "serum": "1.3"}}'::jsonb
  ),
  (
    'Podcast Production',
    'podcast-production',
    'ポッドキャストの企画と制作',
    'intermediate',
    '[
      {"type": "course", "name": "Podcast Production Essentials"},
      {"type": "guide", "name": "Podcast Marketing Guide"}
    ]'::jsonb,
    '["audio-basics", "content-planning"]'::jsonb,
    '["audio-editing", "content-marketing"]'::jsonb,
    '{"software": {"audition": "2023", "garageband": "10.4"}}'::jsonb
  ),
  (
    'Voice Acting',
    'voice-acting',
    '声優・ナレーション',
    'advanced',
    '[
      {"type": "workshop", "name": "Voice Acting Fundamentals"},
      {"type": "course", "name": "Character Voice Development"}
    ]'::jsonb,
    '["vocal-training", "acting-basics"]'::jsonb,
    '["character-development", "voice-direction"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Live Sound',
    'live-sound',
    'ライブ音響の設営と運営',
    'expert',
    '[
      {"type": "certification", "name": "Live Sound Engineer"},
      {"type": "workshop", "name": "Live Audio Production"}
    ]'::jsonb,
    '["audio-engineering", "equipment-knowledge"]'::jsonb,
    '["sound-system-design", "mixing-console"]'::jsonb,
    '{"equipment": ["Digital Mixers", "PA Systems"]}'::jsonb
  ),
  (
    'Music Composition',
    'music-composition',
    '作曲と編曲',
    'advanced',
    '[
      {"type": "course", "name": "Modern Music Composition"},
      {"type": "workshop", "name": "Film Scoring"}
    ]'::jsonb,
    '["music-theory", "piano-basics"]'::jsonb,
    '["orchestration", "film-scoring"]'::jsonb,
    '{"software": {"sibelius": "2023", "finale": "27"}}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- マーケティング・広報スキル
with marketing_pr_category as (
  select id from ff_skills.skill_categories where slug = 'marketing-pr'
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
  marketing_pr_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from marketing_pr_category,
(values
  (
    'Digital Marketing',
    'digital-marketing',
    'オンラインマーケティングの総合的なスキル',
    'advanced',
    '[
      {"type": "certification", "name": "Google Digital Marketing Certification"},
      {"type": "course", "name": "Digital Marketing Strategy"}
    ]'::jsonb,
    '["marketing-basics", "analytics"]'::jsonb,
    '["seo", "social-media", "email-marketing"]'::jsonb,
    '{"tools": ["Google Analytics", "Google Ads"]}'::jsonb
  ),
  (
    'Social Media Marketing',
    'social-media-marketing',
    'ソーシャルメディアを活用したマーケティング',
    'intermediate',
    '[
      {"type": "course", "name": "Social Media Strategy"},
      {"type": "certification", "name": "Meta Blueprint"}
    ]'::jsonb,
    '["digital-marketing-basics", "content-creation"]'::jsonb,
    '["community-management", "paid-social"]'::jsonb,
    '{"platforms": ["Instagram", "Twitter", "LinkedIn", "TikTok"]}'::jsonb
  ),
  (
    'PR Strategy',
    'pr-strategy',
    '広報戦略の立案と実行',
    'expert',
    '[
      {"type": "course", "name": "Strategic Public Relations"},
      {"type": "certification", "name": "Accredited in Public Relations"}
    ]'::jsonb,
    '["communication-basics", "media-relations"]'::jsonb,
    '["crisis-communication", "brand-management"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Brand Management',
    'brand-management',
    'ブランド価値の構築と管理',
    'advanced',
    '[
      {"type": "course", "name": "Strategic Brand Management"},
      {"type": "workshop", "name": "Brand Identity Workshop"}
    ]'::jsonb,
    '["marketing-basics", "design-thinking"]'::jsonb,
    '["brand-strategy", "visual-identity"]'::jsonb,
    '{}'::jsonb
  ),
  (
    'Content Marketing',
    'content-marketing',
    'コンテンツを活用したマーケティング戦略',
    'advanced',
    '[
      {"type": "certification", "name": "Content Marketing Institute Certification"},
      {"type": "course", "name": "Strategic Content Marketing"}
    ]'::jsonb,
    '["content-writing", "marketing-basics"]'::jsonb,
    '["seo", "social-media-strategy"]'::jsonb,
    '{"tools": ["SEMrush", "Ahrefs"]}'::jsonb
  ),
  (
    'Event Planning',
    'event-planning',
    'イベントの企画と運営',
    'advanced',
    '[
      {"type": "certification", "name": "Certified Meeting Professional"},
      {"type": "course", "name": "Event Management Essentials"}
    ]'::jsonb,
    '["project-management", "marketing-basics"]'::jsonb,
    '["vendor-management", "budget-management"]'::jsonb,
    '{"tools": ["Event Management Software"]}'::jsonb
  ),
  (
    'Influencer Marketing',
    'influencer-marketing',
    'インフルエンサーを活用したマーケティング',
    'intermediate',
    '[
      {"type": "course", "name": "Influencer Marketing Strategy"},
      {"type": "guide", "name": "Influencer Collaboration Guide"}
    ]'::jsonb,
    '["social-media-marketing", "brand-management"]'::jsonb,
    '["campaign-management", "roi-analysis"]'::jsonb,
    '{"platforms": ["Instagram", "YouTube", "TikTok"]}'::jsonb
  ),
  (
    'Marketing Analytics',
    'marketing-analytics',
    'マーケティングデータの分析と活用',
    'advanced',
    '[
      {"type": "certification", "name": "Google Analytics Certification"},
      {"type": "course", "name": "Marketing Data Analysis"}
    ]'::jsonb,
    '["data-analysis", "marketing-basics"]'::jsonb,
    '["data-visualization", "predictive-analytics"]'::jsonb,
    '{"tools": ["Google Analytics", "Tableau", "Power BI"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 