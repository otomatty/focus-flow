# ユーザーレベルとスキルランクの関係性

## 1. 概要

### 1.1 ユーザーレベルとは
- ユーザーの全体的な成長と活動を表す指標
- 複数のスキルの総合的な進捗から算出
- プラットフォーム全体での活動度を反映
- モチベーション維持のための要素として機能

### 1.2 スキルランクとは
- 個別のスキルにおける熟練度を表す指標
- 具体的な学習成果と実践経験を反映
- スキル固有の評価基準に基づく
- キャリアパスに直接関連する指標

## 2. レベルとランクの計算方法

### 2.1 ユーザーレベルの算出
```typescript
interface UserLevel {
  level: number;          // 現在のレベル
  totalExp: number;       // 累計経験値
  nextLevelExp: number;   // 次のレベルまでの必要経験値
  progress: number;       // 現在のレベルでの進捗率（0-100%）
}

// レベル算出の要素
- 完了した学習リソースの数と種類
- 獲得したスキルランクの数と種類
- プラットフォームでの活動実績
- 継続的な学習の記録
```

### 2.2 スキルランクの算出
```typescript
interface SkillRank {
  rank: string;          // ランク名（Novice, Apprentice, Practitioner, Expert, Master）
  skillId: string;       // スキルID
  experience: number;    // スキル固有の経験値
  achievements: string[]; // 達成した要件リスト
  lastPromotion: Date;   // 最後のランク昇格日
}

// ランク昇格の要件
- 必要経験値の達成
- 必須学習リソースの完了
- 実践的な課題の達成
- 継続的な活動実績
```

## 3. レベルとランクの関係性

### 3.1 相互作用
1. **経験値の共有**
   - スキルランクの上昇がユーザーレベルに貢献
   - ユーザーレベルの上昇でスキル習得ボーナスを獲得

2. **進捗の相乗効果**
   - 複数のスキルランクの向上で追加ボーナスを獲得
   - バランスの取れたスキル成長を促進

3. **要件の関連性**
   - 特定のユーザーレベルで新しいスキルランクの挑戦が解放
   - 高ランクのスキル獲得で特別なユーザーレベル報酬を獲得

### 3.2 バランス設計
```typescript
interface LevelRankBalance {
  levelRequirements: {
    [level: number]: {
      minSkillRanks: number;    // 必要最小ランク数
      minRankLevels: {          // 各ランクの最小必要数
        practitioner: number;
        expert: number;
        master: number;
      };
    };
  };
  rankRequirements: {
    [rank: string]: {
      minUserLevel: number;     // 必要最小ユーザーレベル
      prerequisites: string[];   // 前提条件
    };
  };
}
```

## 4. 実装における考慮事項

### 4.1 データ構造
```sql
-- ユーザーレベル管理テーブル
create table user_levels (
  user_id uuid primary key references auth.users(id),
  current_level integer not null default 1,
  total_exp integer not null default 0,
  level_progress jsonb not null default '{
    "milestones": [],
    "achievements": [],
    "bonus_factors": {}
  }'::jsonb,
  updated_at timestamp with time zone default now()
);

-- スキルランク管理テーブル
create table user_skill_ranks (
  user_id uuid references auth.users(id),
  skill_id uuid references skills(id),
  current_rank text not null,
  rank_exp integer not null default 0,
  rank_data jsonb not null default '{
    "completed_requirements": [],
    "active_challenges": [],
    "promotion_history": []
  }'::jsonb,
  primary key (user_id, skill_id)
);
```

### 4.2 更新ロジック
```typescript
// レベルとランクの同期更新
async function updateUserProgress(
  userId: string,
  skillId: string,
  expGained: number
): Promise<void> {
  // トランザクション開始
  await db.transaction(async (trx) => {
    // スキルランクの更新
    await updateSkillRank(userId, skillId, expGained);
    
    // ユーザーレベルの更新
    await updateUserLevel(userId, expGained);
    
    // 相互作用の処理
    await processInteractions(userId, skillId);
  });
}
```

## 5. UI/UX設計

### 5.1 表示要素
- レベルとランクの進捗バー
- 次の目標までの要件表示
- 獲得可能な報酬のプレビュー
- 達成履歴のタイムライン

### 5.2 インタラクション
- レベルアップ時の祝福演出
- ランク昇格時の認定証表示
- マイルストーン達成の通知
- 次の目標へのガイダンス

## 6. 拡張性と最適化

### 6.1 将来の拡張
- カスタムランク設定の導入
- コミュニティ評価の反映
- 業界認定との連携
- AIによる進捗予測

### 6.2 パフォーマンス考慮
- レベル計算の非同期処理
- ランク更新のバッチ処理
- キャッシュ戦略の実装
- 集計データの事前計算 