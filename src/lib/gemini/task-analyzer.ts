import { GoogleGenerativeAI } from "@google/generative-ai";
import type { AIAnalysis, TaskType, TaskPriority } from "@/types/task";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeTask(
	title: string,
	taskType: TaskType,
	priority: TaskPriority,
	description?: string,
): Promise<AIAnalysis> {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const prompt = `
あなたはタスク分析の専門家です。以下のタスクを分析し、実行可能性と改善点を評価してください。

タイトル: ${title}
タスクタイプ: ${taskType}
優先度: ${priority}
説明: ${description || "なし"}

以下の観点で分析を行い、JSON形式で結果を返してください：

1. 実行可能性の分析
- タスクの具体性 (0-100)
- 時間的制約の明確さ (0-100)
- スキル要件の明確さ (0-100)
- 依存関係の明確さ (0-100)
- リソースの明確さ (0-100)

2. 改善が必要な点
3. 改善のための提案
4. 推奨される優先度、カテゴリ、期限

レスポンスの形式：
{
  "feasibilityAnalysis": {
    "isExecutable": boolean,
    "evaluationDetails": {
      "specificity": { "score": number, "comments": string[] },
      "timeConstraints": { "score": number, "comments": string[] },
      "skillRequirements": { "score": number, "comments": string[] },
      "dependencies": { "score": number, "comments": string[] },
      "resources": { "score": number, "comments": string[] }
    },
    "reasonsIfNotExecutable": string[],
    "suggestedImprovements": string[]
  },
  "suggestedPriority": "high" | "medium" | "low",
  "suggestedCategory": string,
  "suggestedDueDate": string,
  "totalEstimatedDuration": string,
  "totalExperiencePoints": number,
  "skillDistribution": { [key: string]: number },
  "breakdowns": []
}`;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	const text = response.text();

	try {
		const analysis = JSON.parse(text) as AIAnalysis;
		return analysis;
	} catch (error) {
		console.error("Failed to parse AI response:", error);
		throw new Error("タスクの分析に失敗しました");
	}
}
