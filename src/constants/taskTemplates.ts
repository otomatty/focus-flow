import type { TaskTemplate } from "@/types/task";

export const TASK_TEMPLATES: Record<string, TaskTemplate[]> = {
	development: [
		{
			title: "新機能開発",
			description: `## 目的
- 新機能の実装による製品価値の向上

## 実装内容
1. 要件定義とスコープの確認
2. 技術設計の作成
3. 実装とユニットテスト
4. コードレビュー
5. 結合テスト
6. ドキュメント作成

## 成功基準
- [ ] 要件を満たす機能が実装されている
- [ ] テストが全て通過している
- [ ] コードレビューが完了している
- [ ] ドキュメントが更新されている`,
			estimatedDuration: "3d",
			priority: "medium",
			category: "development",
			skillCategory: "programming",
			experiencePoints: 100,
		},
		{
			title: "バグ修正",
			description: `## 問題の概要
- バグの内容と影響範囲

## 修正手順
1. バグの再現手順の確認
2. 原因の特定
3. 修正案の検討
4. 修正の実装
5. テストケースの追加
6. 修正の検証

## 成功基準
- [ ] バグが修正されている
- [ ] 新しいテストケースが追加されている
- [ ] 他の機能に影響がないことを確認している`,
			estimatedDuration: "1d",
			priority: "high",
			category: "bug",
			skillCategory: "debugging",
			experiencePoints: 50,
		},
	],
	learning: [
		{
			title: "新技術の学習",
			description: `## 学習目標
- 新技術の基本概念と実践的な使用方法の習得

## 学習計画
1. 公式ドキュメントの読解
2. チュートリアルの実施
3. サンプルプロジェクトの作成
4. ベストプラクティスの調査
5. 学習内容のまとめ

## 成功基準
- [ ] 基本概念を理解している
- [ ] サンプルプロジェクトが完成している
- [ ] 学習内容をドキュメント化している`,
			estimatedDuration: "5d",
			priority: "medium",
			category: "learning",
			skillCategory: "research",
			experiencePoints: 150,
		},
	],
	project_management: [
		{
			title: "スプリント計画",
			description: `## 目的
- 次期スプリントの効果的な計画立案

## 実施内容
1. バックログの優先順位付け
2. チーム能力の評価
3. スプリントゴールの設定
4. タスクの見積もり
5. スプリントバックログの作成

## 成功基準
- [ ] スプリントゴールが明確に定義されている
- [ ] タスクが適切に見積もられている
- [ ] チームが計画に合意している`,
			estimatedDuration: "4h",
			priority: "high",
			category: "planning",
			skillCategory: "project_management",
			experiencePoints: 80,
		},
	],
	review: [
		{
			title: "コードレビュー",
			description: `## レビュー観点
1. コードの品質
   - 可読性
   - メンテナンス性
   - パフォーマンス
2. セキュリティ
3. テストの網羅性
4. ドキュメントの整備

## フィードバック方法
- 具体的な改善提案を含める
- 良い点も指摘する
- 建設的な表現を使用する

## 成功基準
- [ ] すべての変更箇所を確認している
- [ ] 重要な問題点を指摘している
- [ ] 改善提案を行っている`,
			estimatedDuration: "2h",
			priority: "medium",
			category: "review",
			skillCategory: "code_review",
			experiencePoints: 30,
		},
	],
	documentation: [
		{
			title: "技術文書作成",
			description: `## ドキュメントの目的
- 技術的な意思決定や実装の記録
- チームの知識共有
- 将来のメンテナンス性の向上

## 記載内容
1. 背景と目的
2. 技術選定の理由
3. システム構成
4. 実装の詳細
5. 注意点と制約事項

## 成功基準
- [ ] 必要な情報が漏れなく記載されている
- [ ] 図表を効果的に使用している
- [ ] わかりやすい表現で記述されている`,
			estimatedDuration: "1d",
			priority: "medium",
			category: "documentation",
			skillCategory: "technical_writing",
			experiencePoints: 60,
		},
	],
};

export const DEFAULT_TEMPLATES = TASK_TEMPLATES.development;
