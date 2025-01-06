"use server";

import { createClient } from "@/lib/supabase/server";
import { generateResponse } from "@/lib/gemini/client";
import type { TaskFormData, Task, TaskInsert } from "@/types/task";

async function generateTaskMetadata(task: TaskFormData) {
	const prompt = `
タスクの詳細から以下の情報を推測してください。
タイトル: ${task.title}
説明: ${task.description}

必要な情報：
1. 予想所要時間（分単位の数値）
2. カテゴリ
3. スキルカテゴリ

以下のJSON形式で返答してください：
{
  "estimated_duration": string,
  "category": string,
  "skill_category": string
}`;

	try {
		const response = await generateResponse(prompt, "");
		const jsonMatch = response.match(/{[\s\S]*}/);
		if (!jsonMatch) {
			throw new Error("Invalid response format");
		}
		return JSON.parse(jsonMatch[0]);
	} catch (error) {
		console.error("タスクメタデータの生成に失敗しました:", error);
		return {
			estimated_duration: "PT30M",
			category: "その他",
			skill_category: "general",
		};
	}
}

export async function createTaskAction(data: TaskFormData) {
	try {
		const supabase = await createClient();

		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("認証されていません");

		// プロジェクトの所有権確認
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
		}

		// メタデータの自動生成
		const metadata = await generateTaskMetadata(data);

		const taskData: TaskInsert = {
			title: data.title,
			description: data.description,
			status: "not_started",
			project_id: data.project_id,
			start_date: data.start_date,
			due_date: data.due_date,
			estimated_duration:
				data.estimated_duration || metadata.estimated_duration,
			category: metadata.category,
			user_id: user.id,
		};

		const { data: task, error } = await supabase
			.schema("ff_tasks")
			.from("tasks")
			.insert(taskData)
			.select()
			.single();

		if (error) {
			console.error("タスク作成エラー:", error);
			return { success: false, error: error.message };
		}

		return {
			success: true,
			data: task as Task,
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
