-- スキル評価指標テーブル
create table if not exists ff_skills.skill_evaluation_metrics (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  description text,
  category text not null check (category in ('quality', 'growth', 'community', 'impact')),
  evaluation_type text not null check (evaluation_type in ('numeric', 'boolean', 'achievement', 'milestone')),
  weight numeric(3,2) not null default 1.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table ff_skills.skill_evaluation_metrics is 'スキル評価の指標を管理するテーブル';

-- 初期データ: 評価指標
insert into ff_skills.skill_evaluation_metrics (name, slug, description, category, evaluation_type, weight) values
-- 成果の質的評価 (quality)
('タスク完了品質', 'task-quality', 'AIによる成果物の品質評価スコア', 'quality', 'numeric', 1.00),
('期限遵守率', 'deadline-adherence', '期限内にタスクを完了できた割合', 'quality', 'numeric', 0.80),
('複雑タスク達成率', 'complex-task-completion', '高難度タスクの成功率', 'quality', 'numeric', 1.20),
('問題解決力', 'problem-solving', '課題解決時の独創性と効率性', 'quality', 'numeric', 1.00),

-- 継続的な成長指標 (growth)
('学習継続性', 'learning-consistency', '定期的な学習・活動の継続度', 'growth', 'numeric', 0.90),
('スキル適用範囲', 'skill-diversity', 'スキルを適用したプロジェクトの多様性', 'growth', 'numeric', 0.85),
('新技術習得', 'new-technology-adoption', '新しい技術やツールの習得度', 'growth', 'milestone', 1.10),
('自己改善活動', 'self-improvement', '自主的な学習と改善への取り組み', 'growth', 'numeric', 0.95),

-- コミュニティ貢献 (community)
('知識共有活動', 'knowledge-sharing', 'ドキュメント作成や知識共有の貢献度', 'community', 'numeric', 0.90),
('メンタリング実績', 'mentoring', '他メンバーへの指導・支援活動', 'community', 'numeric', 1.15),
('コードレビュー貢献', 'code-review', 'レビューでの建設的なフィードバック', 'community', 'numeric', 0.85),
('チーム貢献度', 'team-contribution', 'チーム内での役割と貢献', 'community', 'numeric', 1.00),

-- プロジェクトインパクト (impact)
('成果影響範囲', 'impact-scope', 'プロジェクトへの影響力の範囲', 'impact', 'numeric', 1.20),
('効率化貢献', 'efficiency-improvement', 'プロセス改善による効率化への貢献', 'impact', 'numeric', 1.10),
('イノベーション創出', 'innovation', '革新的なソリューションの提案と実装', 'impact', 'milestone', 1.30),
('ビジネス価値', 'business-value', 'ビジネス目標達成への貢献度', 'impact', 'numeric', 1.25)
on conflict (slug) do nothing;

-- ユーザースキル評価テーブル
create table if not exists ff_skills.user_skill_evaluations (
  id uuid primary key default uuid_generate_v4(),
  user_skill_id uuid references ff_skills.user_skills(id) not null,
  metric_id uuid references ff_skills.skill_evaluation_metrics(id) not null,
  evaluation_data jsonb not null default '{}'::jsonb,
  current_score numeric(5,2),
  last_updated timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_skill_id, metric_id)
);

comment on table ff_skills.user_skill_evaluations is 'ユーザーのスキル評価データを管理するテーブル';

-- ランク昇進の評価基準テーブル
create table if not exists ff_skills.rank_evaluation_criteria (
  id uuid primary key default uuid_generate_v4(),
  from_rank_id uuid references ff_skills.skill_ranks(id) not null,
  to_rank_id uuid references ff_skills.skill_ranks(id) not null,
  category_id uuid references ff_skills.skill_categories(id) not null,
  required_metrics jsonb not null,
  minimum_total_score numeric(5,2) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(from_rank_id, to_rank_id, category_id)
);

comment on table ff_skills.rank_evaluation_criteria is 'ランク昇進の評価基準を管理するテーブル';

-- 評価履歴テーブル
create table if not exists ff_skills.evaluation_history (
  id uuid primary key default uuid_generate_v4(),
  user_skill_id uuid references ff_skills.user_skills(id) not null,
  evaluation_type text not null,
  evaluation_data jsonb not null,
  evaluated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  evaluated_by uuid references auth.users(id),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

comment on table ff_skills.evaluation_history is 'スキル評価の履歴を管理するテーブル'; 