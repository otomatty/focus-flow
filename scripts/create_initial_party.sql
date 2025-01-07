-- トランザクションを開始
BEGIN;

-- 現在のユーザーIDを取得（最初のユーザーを想定）
WITH first_user AS (
  SELECT id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
)
-- 新しいパーティーを作成
, new_party AS (
  INSERT INTO ff_social.parties (
    quest_id,
    max_members,
    is_active,
    start_date,
    end_date
  )
  SELECT
    (SELECT id FROM ff_gamification.quests WHERE is_party_quest = true ORDER BY RANDOM() LIMIT 1),
    4,
    true,
    CURRENT_DATE,
    date_trunc('week', CURRENT_DATE + INTERVAL '1 week')::date - INTERVAL '1 day' -- 今週の日曜日
  RETURNING id
)
-- ユーザーをパーティーに追加
, add_user AS (
  INSERT INTO ff_social.party_members (
    party_id,
    user_id,
    joined_at,
    is_cpu
  )
  SELECT
    new_party.id,
    first_user.id,
    CURRENT_TIMESTAMP,
    false
  FROM new_party, first_user
)
-- CPUアカウントを取得（3つ必要）
, cpu_accounts AS (
  SELECT id
  FROM ff_social.cpu_accounts
  ORDER BY RANDOM()
  LIMIT 3
)
-- CPUアカウントをパーティーに追加
INSERT INTO ff_social.party_members (
  party_id,
  user_id,
  joined_at,
  is_cpu
)
SELECT
  new_party.id,
  cpu.id,
  CURRENT_TIMESTAMP,
  true
FROM new_party
CROSS JOIN cpu_accounts cpu;

-- トランザクションをコミット
COMMIT; 