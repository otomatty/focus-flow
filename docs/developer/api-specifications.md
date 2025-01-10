# API仕様書

## 概要

Focus FlowのAPIは、RESTful原則に従い、JSON形式でデータを送受信します。
すべてのエンドポイントは、`/api/v1`をベースパスとして使用します。

## 認証

- Bearer Token認証を使用
- トークンは認証エンドポイントで取得
- トークンの有効期限は24時間

## エンドポイント一覧

### 認証関連 API

#### POST /api/v1/auth/login
ユーザーログイン

リクエスト:
```json
{
  "email": "string",
  "password": "string"
}
```

レスポンス:
```json
{
  "token": "string",
  "user": {
    "id": "uuid",
    "email": "string",
    "username": "string"
  }
}
```

#### POST /api/v1/auth/register
新規ユーザー登録

リクエスト:
```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "fullName": "string"
}
```

### タスク管理 API

#### GET /api/v1/tasks
タスク一覧取得

クエリパラメータ:
- status: string (optional)
- priority: number (optional)
- due_date: string (optional)
- page: number (optional)
- limit: number (optional)

レスポンス:
```json
{
  "tasks": [
    {
      "id": "uuid",
      "title": "string",
      "description": "string",
      "status": "string",
      "priority": "number",
      "due_date": "string"
    }
  ],
  "pagination": {
    "total": "number",
    "page": "number",
    "limit": "number"
  }
}
```

#### POST /api/v1/tasks
新規タスク作成

リクエスト:
```json
{
  "title": "string",
  "description": "string",
  "status": "string",
  "priority": "number",
  "due_date": "string",
  "project_id": "uuid"
}
```

### フォーカスセッション API

#### POST /api/v1/focus/sessions/start
フォーカスセッション開始

リクエスト:
```json
{
  "task_id": "uuid",
  "duration": "number"
}
```

#### POST /api/v1/focus/sessions/{session_id}/end
フォーカスセッション終了

### ノート管理 API

#### GET /api/v1/notes
ノート一覧取得

クエリパラメータ:
- tags: string[] (optional)
- search: string (optional)
- page: number (optional)
- limit: number (optional)

#### POST /api/v1/notes
新規ノート作成

リクエスト:
```json
{
  "title": "string",
  "content": "string",
  "tags": "string[]",
  "format": "string"
}
```

### 習慣トラッキング API

#### GET /api/v1/habits
習慣一覧取得

#### POST /api/v1/habits
新規習慣作成

リクエスト:
```json
{
  "name": "string",
  "description": "string",
  "frequency": {
    "type": "string",
    "value": "number"
  }
}
```

### ゲーミフィケーション API

#### GET /api/v1/gamification/achievements
実績一覧取得

#### GET /api/v1/gamification/experience
経験値情報取得

### 通知 API

#### GET /api/v1/notifications
通知一覧取得

#### POST /api/v1/notifications/settings
通知設定更新

## エラーレスポンス

すべてのエラーレスポンスは以下の形式で返されます：

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": "object (optional)"
  }
}
```

### エラーコード一覧

- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 409: Conflict
- 422: Unprocessable Entity
- 429: Too Many Requests
- 500: Internal Server Error

## レート制限

- 認証済みユーザー: 1000 requests/hour
- 未認証ユーザー: 100 requests/hour

## バージョニング

- URLベースのバージョニング（/api/v1/）
- 後方互換性の維持
- 重要な変更時は新バージョンをリリース

## セキュリティ

- すべてのエンドポイントはHTTPS経由でアクセス
- Bearer Token認証
- CORS設定
- レート制限の実装
- 入力値のバリデーション

## キャッシュ戦略

- GET要求に対するレスポンスキャッシュ
- Cache-Control ヘッダーの使用
- ETags の実装

## ドキュメント

- OpenAPI (Swagger) 形式でのAPI仕様書提供
- エンドポイントごとの詳細なドキュメント
- サンプルリクエスト/レスポンスの提供 