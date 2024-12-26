import { generateResponse } from "./client";
import type { AIAnalysis, TaskBreakdown } from "@/types/task";

const ANALYSIS_PROMPT = `
あなたはタスク分析AIアシスタントです。
以下のタスクを分析し、最適な分解と推奨設定を提案してください。

タイトル: {title}
説明: {description}

以下の形式で回答してください。マークダウン記法は使用せず、純粋なJSONのみを返してください：

{
  "breakdowns": [
    {
      "title": "サブタスクのタイトル",
      "description": "詳細な説明",
      "estimatedDuration": "予想所要時間（例: 30 minutes, 2 hours）",
      "orderIndex": 順序（1から始まる整数）,
      "experiencePoints": 経験値（難易度や時間に応じて30-100の範囲）,
      "skillCategory": "必要なスキルカテゴリー"
    }
  ],
  "suggestedPriority": "high/medium/low",
  "suggestedCategory": "タスクのカテゴリー",
  "suggestedDueDate": "推奨期限（ISO 8601形式）",
  "totalExperiencePoints": 合計経験値,
  "totalEstimatedDuration": "合計予想時間",
  "skillDistribution": {
    "スキルカテゴリー": 割合（0-100の数値、%記号なし）
  }
}

以下の点を考慮して分析してください：
1. タスクは適切なサイズに分解し、各サブタスクは2時間以内で完了できるようにする
2. 経験値は難易度と予想時間に応じて設定する
3. スキルカテゴリーは分析、設計、開発、テスト、文書化などから適切なものを選択する
4. 期限は現在時刻から適切な余裕を持って設定する
5. 優先度は緊急性と重要性から判断する
6. スキル分布の割合は合計が100になるようにする（%記号は不要）

注意：回答は純粋なJSONのみとし、マークダウン記法（\`\`\`json など）は使用しないでください。
数値を含む文字列（例：10.7%）は使用せず、純粋な数値（例：10.7）を使用してください。
`;

function cleanJsonResponse(response: string): string {
	// マークダウンのコードブロックを削除
	const cleanedResponse = response
		.replace(/```json\n?/g, "")
		.replace(/```\n?/g, "");

	// 最初の{から最後の}までを抽出
	const jsonStart = cleanedResponse.indexOf("{");
	const jsonEnd = cleanedResponse.lastIndexOf("}") + 1;
	if (jsonStart === -1 || jsonEnd === 0) {
		throw new Error("有効なJSONが見つかりません");
	}

	return cleanedResponse.slice(jsonStart, jsonEnd);
}

export async function analyzeTask(
	title: string,
	description?: string,
): Promise<AIAnalysis> {
	try {
		const prompt = ANALYSIS_PROMPT.replace("{title}", title).replace(
			"{description}",
			description || "説明なし",
		);

		const response = await generateResponse(prompt, "");

		const cleanedResponse = cleanJsonResponse(response);

		try {
			const analysis = JSON.parse(cleanedResponse) as AIAnalysis;

			// 日付のバリデーション
			const dueDate = new Date(analysis.suggestedDueDate);
			if (Number.isNaN(dueDate.getTime())) {
				analysis.suggestedDueDate = new Date(
					Date.now() + 24 * 60 * 60 * 1000,
				).toISOString();
			}

			return analysis;
		} catch (parseError) {
			throw new Error("AIの応答を解析できませんでした");
		}
	} catch (error) {
		throw new Error("タスクの分析に失敗しました");
	}
}
