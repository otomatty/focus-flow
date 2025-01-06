"use server";

import { createClient } from "@/lib/supabase/server";
import { generateResponse } from "@/lib/gemini/client";
import type { TaskFormData, Task, TaskInsert } from "@/types/task";

interface AITaskAnalysisResult {
	breakdown_metadata: {
		title: string;
		description?: string;
		estimated_duration?: string;
		skill_category?: string;
	}[];
	category?: string;
	skill_category?: string;
}

async function generateTaskPrompt(task: TaskFormData): Promise<string> {
	return `
以下のタスクを分析し、最適な分解方法を提案してください。

# タスク情報
${task.title ? `- タイトル: "${task.title}"` : ""}
${task.description ? `- タスク内容: "${task.description}"` : ""}
${task.priority ? `- 優先度: ${task.priority}` : ""}
${task.estimated_duration ? `- 見積時間: ${task.estimated_duration}` : ""}

タスクを以下の条件に従って分解し、JSON形式で出力してください：

1. タスクの内容を理解し、適切な粒度のサブタスクに分解してください
2. 各サブタスクには具体的なタイトルと説明を付けてください
3. 各サブタスクの所要時間は2-8時間を目安にしてください
4. スキルカテゴリは具体的に指定してください
5. 経験値は作業の複雑さと時間に応じて設定してください

出力形式：
{
	"breakdown_metadata": [{
		"title": "具体的なサブタスク名",
		"description": "詳細な説明",
		"estimated_duration": "PT2H",
		"skill_category_id": "skill_id"
	}],
	"category_id": "category_id",
	"skill_category_id": "skill_id"
}`;
}

export async function analyzeTask(task: TaskFormData): Promise<Task> {
	const supabase = await createClient();

	try {
		// AIによるタスク分析
		const prompt = await generateTaskPrompt(task);
		const response = await generateResponse(prompt, "");
		const jsonMatch = response.match(/{[\s\S]*}/);
		if (!jsonMatch) {
			throw new Error("Invalid response format");
		}

		const analysis: AITaskAnalysisResult = JSON.parse(jsonMatch[0]);

		// タスクの作成
		const {
			data: { user },
		} = await supabase.auth.getUser();
		if (!user) throw new Error("認証されていません");

		const taskData: TaskInsert = {
			title: task.title,
			description: task.description,
			status: "not_started",
			ai_generated: true,
			category: analysis.category,
			user_id: user.id,
		};

		const { data: createdTask, error: taskError } = await supabase
			.schema("ff_tasks")
			.from("tasks")
			.insert(taskData)
			.select()
			.single();

		if (taskError) throw taskError;

		// 分解結果の作成
		const { error: breakdownError } = await supabase
			.schema("ff_tasks")
			.from("task_breakdown_results")
			.insert(
				analysis.breakdown_metadata.map((breakdown) => ({
					task_id: createdTask.id,
					breakdown_metadata: breakdown,
				})),
			);

		if (breakdownError) throw breakdownError;

		return createdTask as Task;
	} catch (error) {
		console.error("タスク分析処理でエラーが発生しました:", error);
		throw new Error("タスクの分析に失敗しました");
	}
}
