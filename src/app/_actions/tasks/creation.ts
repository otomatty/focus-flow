"use server";
import { processTaskDecomposition, processTaskAnalysis } from "./processor";
import type { AIAnalysis, TaskFormData } from "@/types/task";

export async function analyzeTaskAction(task: TaskFormData) {
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
	task: TaskFormData & { analysis: AIAnalysis },
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
