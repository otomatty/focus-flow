"use client";

import { useState, useEffect } from "react";
import { getTask } from "@/app/_actions/task.action";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export function useTask(id: string) {
	const [task, setTask] = useState<Task | null>(null);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		async function loadTask() {
			try {
				const taskData = await getTask(id);
				setTask(taskData);
			} catch (error) {
				console.error("タスクの取得に失敗しました:", error);
			} finally {
				setIsLoading(false);
			}
		}

		void loadTask();
	}, [id]);

	return { task, setTask, isLoading };
}
