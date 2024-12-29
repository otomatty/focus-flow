"use server";

import { generateResponse } from "@/lib/gemini/client";

type DecomposedTask = {
	title: string;
	description: string;
	estimated_duration: string;
	priority: "high" | "medium" | "low";
};

export type AnalyzedTask = DecomposedTask & {
	category?: string;
	skill_category?: string;
	experience_points?: number;
};

type TaskBreakdown = {
	title: string;
	description?: string;
	estimated_duration: string;
	experience_points: number;
	skill_category: string;
};

export async function processTaskDecomposition(
	taskTitle: string,
): Promise<DecomposedTask[]> {
	const prompt = `
タスク「${taskTitle}」を複数の具体的なタスクに分解してください。
以下の形式で出力してください。他の説明は不要です：

[
	{
		"title": "タスクのタイトル",
		"description": "タスクの詳細な説明",
		"estimated_duration": "PT2H30M",
		"priority": "high"
	}
]`;

	try {
		const response = await generateResponse(prompt, "");
		// JSONの部分だけを抽出して解析
		const jsonMatch = response.match(/\[[\s\S]*\]/);
		if (!jsonMatch) {
			throw new Error("Invalid response format");
		}
		return JSON.parse(jsonMatch[0]) as DecomposedTask[];
	} catch (error) {
		console.error("タスク分解処理でエラーが発生しました:", error);
		throw new Error("タスクの分解に失敗しました");
	}
}

export async function processTaskAnalysis(
	task: DecomposedTask,
): Promise<AnalyzedTask> {
	const prompt = `
タスクを分析し、カテゴリと獲得可能な経験値、必要なスキルを提案してください。
タスク情報：
- タイトル: "${task.title}"
- 説明: "${task.description}"
- 予想所要時間: ${task.estimated_duration}
- 優先度: ${task.priority}

以下の形式で出力してください。他の説明は不要です：

{
	"title": "${task.title}",
	"description": "${task.description}",
	"estimated_duration": "${task.estimated_duration}",
	"priority": "${task.priority}",
	"category": "開発",
	"skill_category": "フロントエンド",
	"experience_points": 100
}`;

	try {
		const response = await generateResponse(prompt, "");
		const jsonMatch = response.match(/{[\s\S]*}/);
		if (!jsonMatch) {
			throw new Error("Invalid response format");
		}
		return JSON.parse(jsonMatch[0]) as AnalyzedTask;
	} catch (error) {
		console.error("タスク分析処理でエラーが発生しました:", error);
		throw new Error("タスクの分析に失敗しました");
	}
}

export async function processTaskBreakdown(
	task: AnalyzedTask,
): Promise<TaskBreakdown[]> {
	const prompt = `
タスクを具体的なステップに分解してください。
タスク情報：
- タイトル: "${task.title}"
- 説明: "${task.description}"
- 予想所要時間: ${task.estimated_duration}
- 優先度: ${task.priority}
- カテゴリ: ${task.category}
- スキルカテゴリ: ${task.skill_category}
- 経験値: ${task.experience_points}

以下の形式で出力してください。ステップ番号は含めず、具体的な動作を表すタイトルにしてください。他の説明は不要です：

[
	{
		"title": "具体的な作業内容を表すタイトル",
		"description": "作業の詳細な説明",
		"estimated_duration": "PT1H",
		"experience_points": 30,
		"skill_category": "フロントエンド"
	}
]`;

	try {
		const response = await generateResponse(prompt, "");
		const jsonMatch = response.match(/\[[\s\S]*\]/);
		if (!jsonMatch) {
			throw new Error("Invalid response format");
		}
		return JSON.parse(jsonMatch[0]) as TaskBreakdown[];
	} catch (error) {
		console.error("タスク細分化処理でエラーが発生しました:", error);
		throw new Error("タスクの細分化に失敗しました");
	}
}
