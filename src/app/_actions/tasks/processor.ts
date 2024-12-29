"use server";

import { generateResponse } from "@/lib/gemini/client";
import type {
	TaskFormData,
	AIAnalysis,
	AnalyzedTask,
	TaskBreakdown,
} from "@/types/task";
import { enhancedTaskAnalysis } from "./analysis/core";
import type { TaskAnalysisContext } from "@/types/task";
import { createClient } from "@/lib/supabase/server";
import { parseDuration, formatToDuration } from "@/utils/time";

export interface DecomposedTask {
	title: string;
	description: string;
	estimated_duration: string;
	type: "task";
	priority: "high" | "medium" | "low";
	status: "not_started";
	progress_percentage: 0;
	category?: string;
	skill_category?: string;
	experience_points: number;
	difficulty_level: number;
	style: {
		color: string | null;
		icon: string | null;
	};
	dependencies?: {
		prerequisite_task_title: string;
		dependency_type: "required" | "optional" | "conditional";
		link_type:
			| "finish_to_start"
			| "start_to_start"
			| "finish_to_finish"
			| "start_to_finish";
	}[];
}

export async function processTaskDecomposition(
	task: TaskFormData,
	analysis: AIAnalysis,
): Promise<DecomposedTask[]> {
	// 分解されたタスクに自動入力する情報を追加
	return analysis.breakdowns.map((breakdown, index, array) => {
		// 依存関係の設定（前のタスクに依存）
		const dependencies =
			index > 0
				? [
						{
							prerequisite_task_title: array[index - 1].title,
							dependency_type: "required" as const,
							link_type: "finish_to_start" as const,
						},
					]
				: [];

		// 時間の計算（一人で行うことを前提に設定）
		const baseMinutes = parseDuration(breakdown.estimated_duration);
		const adjustedMinutes = Math.ceil(baseMinutes * 1.2); // 20%のバッファを追加

		// 難易度の計算（一人で行うことを前提に設定）
		const difficulty_level = calculateDifficultyLevel(
			breakdown.experience_points,
			breakdown.skill_category,
		);

		// スタイルの設定（カテゴリに基づく色とアイコン）
		const style = generateTaskStyle(breakdown.skill_category);

		return {
			title: breakdown.title,
			description: breakdown.description || "",
			estimated_duration: formatToDuration(adjustedMinutes),
			type: "task" as const,
			priority: task.priority,
			status: "not_started" as const,
			progress_percentage: 0,
			category: task.category,
			skill_category: breakdown.skill_category,
			experience_points: breakdown.experience_points,
			difficulty_level,
			style,
			dependencies,
		};
	});
}

// 難易度レベルを計算する関数（一人で行うことを前提に修正）
function calculateDifficultyLevel(
	experiencePoints: number,
	skillCategory?: string,
): number {
	// 基本難易度（経験値に基づく）
	const baseLevel = Math.ceil(experiencePoints / 50); // 一人で行うため、より細かい単位で難易度を設定

	// スキルカテゴリによる補正
	const categoryMultiplier = skillCategory ? 1.5 : 1; // 一人で行うため、スキル要件をより重視

	// 最終難易度を1-5の範囲に収める
	return Math.max(1, Math.min(5, Math.round(baseLevel * categoryMultiplier)));
}

// タスクのスタイルを生成する関数
function generateTaskStyle(skillCategory?: string): {
	color: string | null;
	icon: string | null;
} {
	if (!skillCategory) {
		return { color: null, icon: null };
	}

	// スキルカテゴリに基づく色のマッピング
	const colorMap: Record<string, string> = {
		frontend: "#3B82F6",
		backend: "#10B981",
		design: "#EC4899",
		devops: "#6366F1",
		testing: "#F59E0B",
		documentation: "#6B7280",
	};

	return {
		color: colorMap[skillCategory.toLowerCase()] || null,
		icon: null, // アイコンはlucide-reactから直接使用するため、nullを返す
	};
}

export async function processTaskAnalysis(task: TaskFormData) {
	// コンテキスト情報の収集
	const context: TaskAnalysisContext = {
		projectContext: await getProjectContext(task),
		userContext: await getUserContext(),
		teamContext: await getTeamContext(),
	};

	// 拡張タスク分析の実行
	const analysis = await enhancedTaskAnalysis(task, context);
	return analysis;
}

async function getProjectContext(task: TaskFormData) {
	if (!task.project_id) return undefined;

	const supabase = await createClient();
	const { data: project } = await supabase
		.schema("ff_tasks")
		.from("projects")
		.select("*")
		.eq("id", task.project_id)
		.single();

	if (!project) return undefined;

	const { data: relatedTasks } = await supabase
		.schema("ff_tasks")
		.from("tasks")
		.select("*")
		.eq("project_id", task.project_id);

	return {
		projectId: project.id,
		projectName: project.name,
		projectDescription: project.description || "",
		relatedTasks: relatedTasks || [],
	};
}

async function getUserContext() {
	// モックデータを返す
	return {
		skillLevels: {
			frontend: 3,
			backend: 2,
			design: 2,
			devops: 1,
			testing: 2,
			documentation: 3,
		},
		completedTasks: [],
		preferences: {
			workingHours: ["09:00", "17:00"],
			preferredTaskSize: "PT4H",
		},
	};
}

async function getTeamContext() {
	// モックデータを返す
	return {
		availableSkills: [
			"frontend",
			"backend",
			"design",
			"devops",
			"testing",
			"documentation",
		],
		teamSize: 5,
		workingHours: {
			start: "09:00",
			end: "17:00",
			timezone: "Asia/Tokyo",
		},
	};
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
