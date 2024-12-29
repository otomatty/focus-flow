-- コンテンツ制作スキル
with content_creation_category as (
  select id from skill_categories where slug = 'content-creation'
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
  content_creation_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from content_creation_category,
(values
  (
    'Content Strategy',
    'content-strategy',
    'コンテンツ戦略の立案と実行',
    'advanced',
    '[
      {"type": "certification", "name": "Content Strategy Professional"},
      {"type": "course", "name": "Strategic Content Marketing"},
      {"type": "workshop", "name": "Content Planning"}
    ]'::jsonb,
    '["marketing", "content-creation"]'::jsonb,
    '["content-planning", "audience-analysis"]'::jsonb,
    '{"frameworks": ["Content Strategy", "Editorial Planning"]}'::jsonb
  ),
  (
    'Content Writing',
    'content-writing',
    'デジタルコンテンツの執筆',
    'intermediate',
    '[
      {"type": "course", "name": "Digital Content Writing"},
      {"type": "workshop", "name": "Copywriting"},
      {"type": "guide", "name": "SEO Writing"}
    ]'::jsonb,
    '["writing", "communication"]'::jsonb,
    '["copywriting", "seo-writing"]'::jsonb,
    '{"tools": ["Writing Tools", "SEO Tools"]}'::jsonb
  ),
  (
    'Visual Content',
    'visual-content',
    'ビジュアルコンテンツの制作',
    'intermediate',
    '[
      {"type": "course", "name": "Visual Content Design"},
      {"type": "workshop", "name": "Graphic Design"},
      {"type": "guide", "name": "Visual Storytelling"}
    ]'::jsonb,
    '["design", "visual-communication"]'::jsonb,
    '["graphic-design", "photography"]'::jsonb,
    '{"tools": ["Adobe Creative Suite", "Canva"]}'::jsonb
  ),
  (
    'Video Production',
    'video-production',
    '動画コンテンツの企画と制作',
    'advanced',
    '[
      {"type": "course", "name": "Video Production"},
      {"type": "workshop", "name": "Video Editing"},
      {"type": "guide", "name": "Video Storytelling"}
    ]'::jsonb,
    '["visual-content", "storytelling"]'::jsonb,
    '["video-editing", "motion-graphics"]'::jsonb,
    '{"tools": ["Premiere Pro", "After Effects"]}'::jsonb
  ),
  (
    'Podcast Production',
    'podcast-production',
    'ポッドキャストの企画と制作',
    'intermediate',
    '[
      {"type": "course", "name": "Podcast Creation"},
      {"type": "workshop", "name": "Audio Production"},
      {"type": "guide", "name": "Podcast Strategy"}
    ]'::jsonb,
    '["audio-production", "content-strategy"]'::jsonb,
    '["audio-editing", "storytelling"]'::jsonb,
    '{"tools": ["Audio Software", "Recording Equipment"]}'::jsonb
  ),
  (
    'Social Media Content',
    'social-media-content',
    'ソーシャルメディアコンテンツの制作',
    'intermediate',
    '[
      {"type": "course", "name": "Social Media Content"},
      {"type": "workshop", "name": "Social Strategy"},
      {"type": "guide", "name": "Platform Best Practices"}
    ]'::jsonb,
    '["content-creation", "social-media"]'::jsonb,
    '["platform-strategy", "community-management"]'::jsonb,
    '{"platforms": ["Instagram", "Twitter", "LinkedIn"]}'::jsonb
  ),
  (
    'Interactive Content',
    'interactive-content',
    'インタラクティブコンテンツの制作',
    'advanced',
    '[
      {"type": "course", "name": "Interactive Design"},
      {"type": "workshop", "name": "User Experience"},
      {"type": "guide", "name": "Interactive Storytelling"}
    ]'::jsonb,
    '["web-development", "user-experience"]'::jsonb,
    '["interactive-design", "web-animation"]'::jsonb,
    '{"tools": ["Web Technologies", "Animation Tools"]}'::jsonb
  ),
  (
    'Content Analytics',
    'content-analytics',
    'コンテンツ分析と最適化',
    'advanced',
    '[
      {"type": "course", "name": "Content Analytics"},
      {"type": "workshop", "name": "Data Analysis"},
      {"type": "guide", "name": "Performance Optimization"}
    ]'::jsonb,
    '["analytics", "content-strategy"]'::jsonb,
    '["data-analysis", "content-optimization"]'::jsonb,
    '{"tools": ["Analytics Tools", "SEO Tools"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing;

-- 音楽・オーディオスキル
with music_audio_category as (
  select id from skill_categories where slug = 'music-audio'
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
  music_audio_category.id,
  name,
  slug,
  description,
  difficulty_level,
  learning_resources,
  prerequisites,
  related_skills,
  version_info
from music_audio_category,
(values
  (
    'Music Production',
    'music-production',
    '音楽制作と編集',
    'advanced',
    '[
      {"type": "course", "name": "Music Production"},
      {"type": "workshop", "name": "Audio Engineering"},
      {"type": "guide", "name": "Studio Production"}
    ]'::jsonb,
    '["audio-engineering", "music-theory"]'::jsonb,
    '["audio-editing", "mixing"]'::jsonb,
    '{"tools": ["DAW", "Audio Plugins"]}'::jsonb
  ),
  (
    'Sound Design',
    'sound-design',
    'サウンドデザインと効果音制作',
    'advanced',
    '[
      {"type": "course", "name": "Sound Design"},
      {"type": "workshop", "name": "Foley Art"},
      {"type": "guide", "name": "Audio Effects"}
    ]'::jsonb,
    '["audio-production", "creativity"]'::jsonb,
    '["audio-synthesis", "foley-art"]'::jsonb,
    '{"tools": ["Sound Design Software", "Synthesizers"]}'::jsonb
  ),
  (
    'Audio Engineering',
    'audio-engineering',
    'オーディオ信号処理と録音技術',
    'advanced',
    '[
      {"type": "certification", "name": "Audio Engineering"},
      {"type": "course", "name": "Sound Engineering"},
      {"type": "workshop", "name": "Studio Recording"}
    ]'::jsonb,
    '["acoustics", "signal-processing"]'::jsonb,
    '["recording", "mixing", "mastering"]'::jsonb,
    '{"equipment": ["Recording Gear", "Processing Tools"]}'::jsonb
  ),
  (
    'Music Composition',
    'music-composition',
    '音楽作曲と編曲',
    'advanced',
    '[
      {"type": "course", "name": "Music Composition"},
      {"type": "workshop", "name": "Songwriting"},
      {"type": "guide", "name": "Arrangement"}
    ]'::jsonb,
    '["music-theory", "instrument-skills"]'::jsonb,
    '["songwriting", "arranging"]'::jsonb,
    '{"tools": ["Notation Software", "MIDI Controllers"]}'::jsonb
  ),
  (
    'Audio Post-Production',
    'audio-post-production',
    '映像音声の後処理',
    'advanced',
    '[
      {"type": "course", "name": "Audio Post"},
      {"type": "workshop", "name": "Dialog Editing"},
      {"type": "guide", "name": "Sound Mixing"}
    ]'::jsonb,
    '["audio-engineering", "sound-design"]'::jsonb,
    '["dialog-editing", "surround-sound"]'::jsonb,
    '{"tools": ["Pro Tools", "Surround Sound Tools"]}'::jsonb
  ),
  (
    'Live Sound',
    'live-sound',
    'ライブ音響制作',
    'advanced',
    '[
      {"type": "course", "name": "Live Sound"},
      {"type": "workshop", "name": "Stage Sound"},
      {"type": "guide", "name": "Live Mixing"}
    ]'::jsonb,
    '["audio-engineering", "acoustics"]'::jsonb,
    '["live-mixing", "system-setup"]'::jsonb,
    '{"equipment": ["PA Systems", "Mixing Consoles"]}'::jsonb
  ),
  (
    'Music Technology',
    'music-technology',
    '音楽テクノロジーとデジタル制作',
    'advanced',
    '[
      {"type": "course", "name": "Music Technology"},
      {"type": "workshop", "name": "Digital Audio"},
      {"type": "guide", "name": "MIDI Production"}
    ]'::jsonb,
    '["audio-engineering", "digital-skills"]'::jsonb,
    '["midi-production", "virtual-instruments"]'::jsonb,
    '{"tools": ["DAW", "Virtual Instruments"]}'::jsonb
  ),
  (
    'Audio Programming',
    'audio-programming',
    'オーディオソフトウェア開発',
    'expert',
    '[
      {"type": "course", "name": "Audio Programming"},
      {"type": "workshop", "name": "DSP Development"},
      {"type": "guide", "name": "Plugin Development"}
    ]'::jsonb,
    '["programming", "audio-engineering"]'::jsonb,
    '["dsp", "plugin-development"]'::jsonb,
    '{"languages": ["C++", "Python"], "frameworks": ["JUCE", "VST SDK"]}'::jsonb
  )
) as data(name, slug, description, difficulty_level, learning_resources, prerequisites, related_skills, version_info)
on conflict (slug) do nothing; 