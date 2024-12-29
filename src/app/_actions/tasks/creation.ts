"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import {
	processTaskDecomposition,
	processTaskAnalysis,
	processTaskBreakdown,
} from "./processor";
import type { TaskFormData } from "@/app/_components/task/TaskForm";

export async function decomposeTaskAction(taskTitle: string) {
	try {
		const decomposedTasks = await processTaskDecomposition(taskTitle);
		return { success: true, data: decomposedTasks };
	} catch (error) {
		console.error("タスク分解アクションでエラーが発生しました:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "不明なエラーが発生しました",
		};
	}
}

export async function analyzeTaskAction(taskData: TaskFormData) {
	try {
		const analyzedTask = await processTaskAnalysis({
			title: taskData.title,
			description: taskData.description || "",
			estimated_duration: taskData.estimated_duration || "PT1H",
			priority: taskData.priority,
		});
		return { success: true, data: analyzedTask };
	} catch (error) {
		console.error("タスク分析アクションでエラーが発生しました:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "不明なエラーが発生しました",
		};
	}
}

export async function breakdownTaskAction(taskData: TaskFormData) {
	try {
		const taskBreakdowns = await processTaskBreakdown({
			...taskData,
			description: taskData.description || "",
			estimated_duration: taskData.estimated_duration || "PT1H",
		});
		return { success: true, data: taskBreakdowns };
	} catch (error) {
		console.error("タスク細分化アクションでエラーが発生しました:", error);
		return {
			success: false,
			error:
				error instanceof Error ? error.message : "不明なエラーが発生しました",
		};
	}
}
