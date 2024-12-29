# 学習リソース管理システム 技術実装詳細

## 1. データベース設計

### 1.1 テーブル構成
- `learning_resources`: 学習リソースの基本情報
- `user_learning_progress`: ユーザーの学習進捗
- `learning_resource_reviews`: リソースのレビュー情報
- `learning_resource_recommendations`: リソースの推奨情報
- `learning_paths`: 学習パスの基本情報
- `learning_path_resources`: 学習パスのリソース構成
- `user_learning_paths`: ユーザーの学習パス進捗

### 1.2 データ型と制約
- ID: UUID v4を使用
- タイムスタンプ: `timestamp with time zone`を使用
- JSON データ: `jsonb`型で構造化データを格納
- 外部キー制約: `CASCADE`オプションは使用せず、アプリケーションで制御

### 1.3 インデックス戦略
- 主キーインデックス
- 外部キーインデックス
- 検索・フィルタリング用複合インデックス
- パフォーマンスチューニング用部分インデックス

## 2. APIエンドポイント設計

### 2.1 学習進捗管理API
```typescript
// 進捗の取得
GET /api/progress/:userId/:resourceId
// 進捗の更新
PATCH /api/progress/:userId/:resourceId
// 進捗の一括取得
GET /api/progress/:userId
// 学習時間の記録
POST /api/progress/:userId/:resourceId/time
```

### 2.2 レビュー管理API
```typescript
// レビューの投稿
POST /api/reviews
// レビューの取得
GET /api/reviews/:resourceId
// レビューの更新
PATCH /api/reviews/:reviewId
// 「参考になった」の更新
POST /api/reviews/:reviewId/helpful
```

### 2.3 リソース推奨API
```typescript
// 推奨リソースの取得
GET /api/recommendations/:userId
// 推奨の非表示設定
PATCH /api/recommendations/:userId/:resourceId/dismiss
// 推奨の更新トリガー
POST /api/recommendations/:userId/refresh
```

### 2.4 学習パス管理API
```typescript
// パスの作成
POST /api/learning-paths
// パスの取得
GET /api/learning-paths/:pathId
// パスの更新
PATCH /api/learning-paths/:pathId
// リソースの追加
POST /api/learning-paths/:pathId/resources
```

## 3. フロントエンド実装

### 3.1 状態管理（Jotai）
```typescript
// 学習進捗の状態管理
const userProgressAtom = atom({
  key: 'userProgress',
  default: {},
  effects: [persistAtom],
});

// 学習パスの状態管理
const learningPathAtom = atom({
  key: 'learningPath',
  default: null,
});

// 推奨リソースの状態管理
const recommendationsAtom = atom({
  key: 'recommendations',
  default: [],
});
```

### 3.2 コンポーネント構成
```typescript
// 学習進捗表示コンポーネント
const ProgressDisplay: React.FC<{
  userId: string;
  resourceId: string;
}> = ({ userId, resourceId }) => {
  // 実装詳細
};

// レビュー投稿フォーム
const ReviewForm: React.FC<{
  resourceId: string;
  onSubmit: (data: ReviewData) => void;
}> = ({ resourceId, onSubmit }) => {
  // 実装詳細
};

// 学習パス作成フォーム
const LearningPathForm: React.FC<{
  onSubmit: (data: LearningPathData) => void;
}> = ({ onSubmit }) => {
  // 実装詳細
};
```

## 4. バックエンド実装

### 4.1 進捗管理ロジック
```typescript
// 進捗更新処理
export async function updateProgress(
  userId: string,
  resourceId: string,
  data: ProgressUpdateData
): Promise<void> {
  // トランザクション処理
  // 進捗計算ロジック
  // イベント発行
}

// 進捗集計処理
export async function aggregateProgress(
  userId: string
): Promise<ProgressSummary> {
  // 集計ロジック
  // キャッシュ処理
}
```

### 4.2 推奨エンジン
```typescript
// 推奨スコア計算
export async function calculateRecommendationScore(
  userId: string,
  resourceId: string
): Promise<number> {
  // スキルベースのスコア
  // 学習パスベースのスコア
  // 類似ユーザーベースのスコア
  // 重み付け計算
}

// 推奨リソース取得
export async function getRecommendations(
  userId: string,
  limit: number
): Promise<Recommendation[]> {
  // フィルタリング
  // ソート
  // ページネーション
}
```

### 4.3 学習パス管理
```typescript
// パス作成処理
export async function createLearningPath(
  data: LearningPathCreateData
): Promise<LearningPath> {
  // バリデーション
  // リソース順序の最適化
  // メタデータ生成
}

// 進捗追跡処理
export async function trackPathProgress(
  userId: string,
  pathId: string
): Promise<PathProgress> {
  // リソース進捗の集約
  // 次のステップの決定
  // 通知生成
}
```

## 5. パフォーマンス最適化

### 5.1 キャッシュ戦略
```typescript
// Redis キャッシュ設定
const cacheConfig = {
  ttl: 3600, // 1時間
  maxItems: 10000,
  updateInterval: 300, // 5分
};

// キャッシュキー生成
const getCacheKey = (prefix: string, id: string): string => {
  return `${prefix}:${id}:${version}`;
};
```

### 5.2 クエリ最適化
```sql
-- 効率的な進捗取得クエリ
WITH user_progress AS (
  SELECT *
  FROM user_learning_progress
  WHERE user_id = :userId
  AND updated_at > :lastSync
),
resource_details AS (
  SELECT *
  FROM learning_resources
  WHERE id IN (SELECT resource_id FROM user_progress)
)
SELECT
  p.*,
  r.name,
  r.type
FROM user_progress p
JOIN resource_details r ON p.resource_id = r.id;
```

### 5.3 バッチ処理
```typescript
// 非同期バッチ処理
export async function processBatchUpdates(
  updates: ProgressUpdate[]
): Promise<void> {
  // チャンク分割
  // 並列処理
  // エラーハンドリング
}
```

## 6. 監視とロギング

### 6.1 ログ設定
```typescript
// ログレベル定義
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  debug: 3,
};

// ログフォーマット
const logFormat = {
  timestamp: true,
  level: true,
  userId: true,
  action: true,
  details: true,
};
```

### 6.2 メトリクス収集
```typescript
// パフォーマンスメトリクス
export const metrics = {
  requestDuration: new Histogram({
    name: 'request_duration_seconds',
    help: 'Request duration in seconds',
    labelNames: ['endpoint', 'method'],
  }),
  
  activeUsers: new Gauge({
    name: 'active_users',
    help: 'Number of active users',
  }),
};
```

### 6.3 エラー追跡
```typescript
// エラーハンドリング
export const errorHandler = (
  error: Error,
  context: ErrorContext
): void => {
  // エラーログ記録
  // メトリクス更新
  // 通知送信
};
``` 