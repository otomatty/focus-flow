"use server";

import type { Task, TaskStyleJson } from "@/types/task";
import type { TaskRow } from "@/types/task";

export async function convertToTask(row: TaskRow): Promise<Task> {
	const { estimated_duration, actual_duration, style, ...rest } = row;
	const taskStyle = style
		? (style as TaskStyleJson)
		: { color: null, icon: null };
	return {
		...rest,
		estimated_duration: estimated_duration?.toString() ?? null,
		actual_duration: actual_duration?.toString() ?? null,
		style: taskStyle,
		ai_analysis: null,
	};
}
