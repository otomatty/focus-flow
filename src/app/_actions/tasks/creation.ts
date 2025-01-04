"use server";
import { processTaskDecomposition, processTaskAnalysis } from "./processor";
import type {
	AIAnalysis,
	StandardTaskFormData,
	AITaskFormData,
} from "@/types/task";
import { createClient } from "@/lib/supabase/server";
import { convertToCamelCase } from "@/utils/caseConverter";
import { generateResponse } from "@/lib/gemini/client";

async function generateTaskMetadata(task: StandardTaskFormData) {
	const prompt = `
タスクの詳細から以下の情報を推測してください。
タイトル: ${task.title}
説明: ${task.description}

必要な情報：
1. 予想所要時間（分単位の数値）
2. カテゴリ（1つの文字列）
3. スタイル（アイコン名とカラーコード）

以下のJSON形式で返答してください。他の説明は一切不要です：
{
  "estimated_duration": number,
  "category": string,
  "style": {
    "icon": string,
    "color": string
  }
}`;

	try {
		const response = await generateResponse(prompt, "");
		// JSONの部分を抽出
		const jsonMatch = response.match(/{[\s\S]*}/);
		if (!jsonMatch) {
			console.error("AIレスポンスにJSONが含まれていません:", response);
			throw new Error("Invalid response format");
		}
		const metadata = JSON.parse(jsonMatch[0]);
		return metadata;
	} catch (error) {
		console.error("タスクメタデータの生成に失敗しました:", error);
		// デフォルト値を返す
		return {
			estimated_duration: 30,
			category: "その他",
			style: {
				icon: "task",
				color: "#808080",
			},
		};
	}
}

export async function analyzeTaskAction(task: AITaskFormData) {
	console.log("=== analyzeTaskAction開始 ===");
	console.log("入力タスク:", task);

	try {
		console.log("processTaskAnalysis呼び出し");
		const analysis = await processTaskAnalysis(task);
		console.log("分析結果:", analysis);

		return {
			success: true,
			data: analysis,
		};
	} catch (error) {
		console.error("タスク分析アクションでエラーが発生しました:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "タスクの分析に失敗しました",
		};
	}
}

export async function breakdownTaskAction(
	task: AITaskFormData & { analysis: AIAnalysis },
) {
	console.log("=== breakdownTaskAction開始 ===");
	console.log("入力タスク:", task);

	try {
		console.log("processTaskDecomposition呼び出し");
		const decomposedTasks = await processTaskDecomposition(task, task.analysis);
		console.log("分解結果:", decomposedTasks);

		return {
			success: true,
			data: decomposedTasks,
		};
	} catch (error) {
		console.error("タスク分解アクションでエラーが発生しました:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "タスクの分解に失敗しました",
		};
	}
}

export async function createTaskAction(data: StandardTaskFormData) {
	try {
		const supabase = await createClient();

		// ユーザー認証の確認
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("認証されていません");

		// プロジェクトの所有権確認（プロジェクトIDが指定された場合のみ）
		if (data.project_id) {
			const { data: project, error: projectError } = await supabase
				.schema("ff_tasks")
				.from("projects")
				.select("user_id")
				.eq("id", data.project_id)
				.single();

			if (projectError || !project) {
				throw new Error("プロジェクトが見つかりません");
			}

			if (project.user_id !== user.id) {
				throw new Error("このプロジェクトにタスクを作成する権限がありません");
			}
		}

		// 未入力のメタデータがある場合、AIで自動生成
		const taskData = { ...data };
		if (!taskData.estimated_duration || !taskData.category || !taskData.style) {
			const metadata = await generateTaskMetadata(taskData);
			taskData.estimated_duration =
				taskData.estimated_duration || metadata.estimated_duration;
			taskData.category = taskData.category || metadata.category;
			taskData.style = taskData.style || metadata.style;
		}

		const { data: task, error } = await supabase
			.schema("ff_tasks")
			.from("tasks")
			.insert([
				{
					title: taskData.title,
					description: taskData.description,
					priority: taskData.priority,
					project_id: taskData.project_id || null,
					start_date: taskData.start_date,
					due_date: taskData.due_date,
					is_recurring: taskData.is_recurring,
					recurring_pattern: taskData.recurring_pattern,
					category: taskData.category,
					style: taskData.style,
					estimated_duration: taskData.estimated_duration,
					status: "not_started",
					progress_percentage: 0,
					user_id: user.id,
				},
			])
			.select()
			.single();

		if (error) {
			console.error("タスク作成エラー:", error);
			return { success: false, error: error.message };
		}

		return {
			success: true,
			data: convertToCamelCase(task),
		};
	} catch (error) {
		console.error("タスク作成エラー:", error);
		return {
			success: false,
			error:
				error instanceof Error
					? error.message
					: "タスクの作成中にエラーが発生しました",
		};
	}
}
