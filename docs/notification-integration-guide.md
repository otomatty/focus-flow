# 通知システム連携ガイドライン

## 概要

このドキュメントでは、新機能を追加する際の通知システムとの連携方法について説明します。通知システムは拡張性を考慮して設計されており、新しい機能やイベントを簡単に追加できます。

## 目次

1. [通知システムのアーキテクチャ](#通知システムのアーキテクチャ)
2. [新機能との連携手順](#新機能との連携手順)
3. [通知テンプレートの作成](#通知テンプレートの作成)
4. [実装例](#実装例)
5. [ベストプラクティス](#ベストプラクティス)

## 通知システムのアーキテクチャ

通知システムは以下のコンポーネントで構成されています：

### 1. カテゴリ管理
- 機能ごとに通知カテゴリを定義
- ユーザーごとの通知設定を管理
- 優先度やアイコンなどの表示設定

### 2. テンプレート管理
- カテゴリごとに複数のテンプレートを定義
- 動的なデータ埋め込みが可能
- アクションタイプとリンク先の設定

### 3. 配信管理
- メール、プッシュ通知、アプリ内通知をサポート
- 配信状態の追跡
- エラーハンドリングとリトライ

## 新機能との連携手順

新機能を通知システムと連携する際の基本的な手順は以下の通りです：

### 1. カテゴリの追加

```sql
-- カテゴリの追加例
insert into ff_notifications.categories (
    name,
    display_name,
    description,
    icon,
    color,
    priority
)
values (
    'new_feature',           -- カテゴリ名（英語、小文字、アンダースコア）
    '新機能名',              -- 表示名
    '新機能の通知説明',      -- 説明
    'feature-icon',         -- アイコン識別子
    '#FF5722',             -- カラーコード
    50                     -- 優先度
);
```

### 2. テンプレートの作成

```sql
-- テンプレートの追加例
insert into ff_notifications.templates (
    category_id,
    name,
    title_template,
    body_template,
    action_type,
    action_data
)
select
    c.id,
    'new_feature_event',    -- テンプレート名
    '{{event_name}}が発生しました', -- タイトル
    '{{event_description}}',       -- 本文
    'link',                       -- アクションタイプ
    '{"path": "/new-feature/{{event_id}}"}'::jsonb -- アクションデータ
from ff_notifications.categories c
where c.name = 'new_feature';
```

### 3. 通知トリガーの実装

```sql
-- ServerAction内での実装例
const notificationId = await supabase.rpc('create_notification', {
    p_user_id: userId,
    p_category_name: 'new_feature',
    p_template_name: 'new_feature_event',
    p_template_data: {
        event_name: '新しいイベント',
        event_description: 'イベントの詳細説明',
        event_id: 'xxx'
    }
});
```

## 通知テンプレートの作成

テンプレートを作成する際の注意点：

### 1. テンプレート変数
- 二重中括弧で囲む: `{{variable_name}}`
- わかりやすい変数名を使用
- 必要な変数を漏れなく定義

### 2. アクションタイプ
- `link`: 特定のページへの遷移
- `modal`: モーダルウィンドウの表示
- `toast`: トースト通知の表示
- `custom`: カスタムアクション

### 3. メタデータ
- 追加情報はmetadataフィールドに格納
- JSON形式で構造化されたデータを保存
- 将来の拡張性を考慮

## 実装例

### クエスト完了通知の例

```sql
-- カテゴリ定義
insert into ff_notifications.categories (name, display_name, description, icon, color, priority)
values ('quest', 'クエスト', 'クエスト関連の通知', 'task', '#2196F3', 90);

-- テンプレート定義
insert into ff_notifications.templates (
    category_id,
    name,
    title_template,
    body_template,
    action_type,
    action_data
)
select
    c.id,
    'quest_completed',
    'クエスト「{{quest_name}}」を完了しました！',
    '{{exp_gained}} EXPを獲得しました。次のクエストに挑戦しましょう！',
    'link',
    '{"path": "/quests/{{quest_id}}/complete"}'::jsonb
from ff_notifications.categories c
where c.name = 'quest';

-- 通知作成関数の呼び出し
select ff_notifications.create_notification(
    'user-uuid',
    'quest',
    'quest_completed',
    '{
        "quest_name": "初めての冒険",
        "exp_gained": "100",
        "quest_id": "quest-uuid"
    }'::jsonb
);
```

## ベストプラクティス

### 1. 命名規則
- カテゴリ名: 英語、小文字、アンダースコア区切り
- テンプレート名: カテゴリ名をプレフィックスとする
- 変数名: キャメルケースまたはスネークケース

### 2. エラーハンドリング
- 通知作成時のエラーを適切に処理
- ユーザー設定を考慮した配信制御
- 失敗時のフォールバック処理

### 3. パフォーマンス考慮
- バッチ処理での通知作成
- 適切なインデックス設計
- キャッシュの活用

### 4. セキュリティ
- ユーザー権限の確認
- センシティブな情報の扱い
- SQLインジェクション対策

### 5. 国際化対応
- テンプレートの多言語対応
- タイムゾーンの考慮
- 日時フォーマットの統一

## 注意事項

1. 通知の頻度
   - ユーザーへの通知頻度を適切に設定
   - 重要度に応じた優先度付け
   - おやすみ時間の考慮

2. データ容量
   - テンプレートデータのサイズ制限
   - メタデータの適切な設計
   - 古い通知の削除ポリシー

3. 監視とメンテナンス
   - 配信状況のモニタリング
   - エラーログの定期確認
   - パフォーマンスの監視

## 今後の拡張予定

1. プッシュ通知プロバイダーの追加
2. 通知グループ化機能
3. AIを活用した通知最適化
4. リアルタイム通知機能の強化

このガイドラインは随時更新されます。新機能の追加時には、このドキュメントを参照しながら、一貫性のある通知システムの実装を心がけてください。 