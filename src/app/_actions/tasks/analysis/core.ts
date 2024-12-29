import type {
	TaskFormData,
	TaskAnalysisContext,
	EnhancedAIAnalysis,
	TaskRecommendation,
} from "@/types/task";
import { generateResponse } from "@/lib/gemini/client";
import {
	evaluateComplexity,
	analyzeRisks,
	calculateQualityMetrics,
} from "./utils";

function generateTaskPrompt(
	task: TaskFormData,
	context?: TaskAnalysisContext,
): string {
	return `
以下のタスクを分析し、最適な分解方法を提案してください。

# タスク情報
${task.title ? `- タイトル: "${task.title}"` : ""}
- タスク内容: "${task.description}"
- 優先度: ${task.priority}
${task.category ? `- カテゴリ: ${task.category}` : ""}
${task.skill_category ? `- スキルカテゴリ: ${task.skill_category}` : ""}

${
	context?.projectContext
		? `
# プロジェクト情報
- プロジェクト名: ${context.projectContext.projectName}
- プロジェクト説明: ${context.projectContext.projectDescription}
- 関連タスク数: ${context.projectContext.relatedTasks.length}
`
		: ""
}

${
	context?.teamContext
		? `
# チーム情報
- チームサイズ: ${context.teamContext.teamSize}
- 利用可能なスキル: ${context.teamContext.availableSkills.join(", ")}
- 作業時間: ${context.teamContext.workingHours.start} - ${
				context.teamContext.workingHours.end
			} (${context.teamContext.workingHours.timezone})
`
		: ""
}

タスクを以下の条件に従って分解し、JSON形式で出力してください：

1. タスクの内容を理解し、適切な粒度のサブタスクに分解してください
2. 各サブタスクには具体的なタイトルと説明を付けてください
3. 各サブタスクの所要時間は2-8時間を目安にしてください
4. スキルカテゴリは具体的に指定してください
5. 経験値は作業の複雑さと時間に応じて設定してください

出力形式：
{
  "breakdowns": [{
    "title": "具体的なサブタスク名",
    "description": "詳細な説明",
    "estimated_duration": "PT2H",
    "experience_points": 100,
    "skill_category": "frontend"
  }],
  "category": "開発",
  "skill_category": "フロントエンド",
  "experience_points": 100
}`;
}

async function generateRecommendations(
	task: TaskFormData,
	context?: TaskAnalysisContext,
): Promise<TaskRecommendation> {
	const complexity = evaluateComplexity(task, context);
	const risks = analyzeRisks(task, context);

	// 分解戦略の決定
	const breakdownStrategy =
		complexity.level === "high"
			? "top-down"
			: complexity.level === "medium"
				? "middle-out"
				: "bottom-up";

	// 推奨スキルの決定
	const suggestedSkills = task.skill_category
		? [task.skill_category]
		: context?.teamContext?.availableSkills.slice(0, 3) || [];

	// 工数見積もりの計算
	const baseHours = task.estimated_duration
		? Number.parseInt(task.estimated_duration.match(/PT(\d+)H/)?.[1] || "0")
		: 0;
	const estimatedEffort = {
		optimistic: `PT${Math.max(1, Math.floor(baseHours * 0.7))}H`,
		realistic: `PT${baseHours}H`,
		pessimistic: `PT${Math.ceil(baseHours * 1.5)}H`,
	};

	// 並列化の可能性を評価
	const parallelizationPotential =
		complexity.level === "high" && baseHours > 8 ? 0.8 : 0.3;

	// 推奨チームサイズの決定
	const suggestedTeamSize = Math.min(
		Math.ceil(baseHours / 16),
		context?.teamContext?.teamSize || 1,
	);

	return {
		breakdownStrategy,
		suggestedSkills,
		estimatedEffort,
		parallelizationPotential,
		suggestedTeamSize,
	};
}

export async function enhancedTaskAnalysis(
	task: TaskFormData,
	context?: TaskAnalysisContext,
): Promise<EnhancedAIAnalysis> {
	try {
		// 1. 基本的なAI分析の実行
		const prompt = generateTaskPrompt(task, context);
		const response = await generateResponse(prompt, "");
		const jsonMatch = response.match(/{[\s\S]*}/);
		if (!jsonMatch) {
			throw new Error("Invalid response format");
		}
		const baseAnalysis = JSON.parse(jsonMatch[0]);

		// 2. 拡張分析の実行
		const complexity = evaluateComplexity(task, context);
		const risks = analyzeRisks(task, context);
		const recommendations = await generateRecommendations(task, context);
		const qualityMetrics = calculateQualityMetrics(task, context);

		// 3. 分析結果の結合
		return {
			...baseAnalysis,
			complexity,
			risks,
			recommendations,
			qualityMetrics,
		};
	} catch (error) {
		console.error("タスク分析処理でエラーが発生しました:", error);
		throw new Error("タスクの分析に失敗しました");
	}
}
