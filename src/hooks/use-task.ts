"use client";

import { useEffect, useState } from "react";
import type { Task, AIAnalysis } from "@/types/task";
import { getTask } from "@/app/_actions/tasks/core";

export function useTask(taskId: string) {
	const [task, setTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function fetchTask() {
			try {
				const data = await getTask(taskId);
				setTask({
					...data,
					estimated_duration: data.estimated_duration?.toString() ?? null,
					ai_analysis: data.ai_analysis
						? JSON.parse(JSON.stringify(data.ai_analysis))
						: null,
					experience_points: Number(data.experience_points ?? 0),
				});
			} catch (error) {
				console.error("タスクの取得に失敗しました:", error);
				setTask(null);
			} finally {
				setIsLoading(false);
			}
		}

		void fetchTask();
	}, [taskId]);

	return { task, setTask, isLoading };
}
