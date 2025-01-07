-- トランザクションを開始
BEGIN;

-- 最初のユーザーを取得
WITH first_user AS (
  SELECT id
  FROM auth.users
  ORDER BY created_at ASC
  LIMIT 1
)
-- レベル情報が存在しない場合のみ作成
INSERT INTO ff_gamification.user_levels (
  user_id,
  current_level,
  current_exp,
  total_exp,
  created_at,
  updated_at
)
SELECT
  first_user.id,
  1, -- 初期レベル
  0, -- 現在の経験値
  0, -- 累計経験値
  CURRENT_TIMESTAMP,
  CURRENT_TIMESTAMP
FROM first_user
WHERE NOT EXISTS (
  SELECT 1
  FROM ff_gamification.user_levels l
  WHERE l.user_id = first_user.id
);

-- トランザクションをコミット
COMMIT; 