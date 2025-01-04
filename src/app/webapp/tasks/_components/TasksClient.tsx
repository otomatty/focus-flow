"use client";

import { TaskList } from "./TaskList";
import { TaskFilters } from "./TaskFilters";
import { filteredTasksAtom, loadTasksAtom } from "@/store/tasks";
import { useAtom, useAtomValue } from "jotai";
import { useEffect } from "react";

export function TasksClient() {
	const [, loadTasks] = useAtom(loadTasksAtom);
	const filteredTasks = useAtomValue(filteredTasksAtom);

	useEffect(() => {
		void loadTasks();
	}, [loadTasks]);

	return (
		<div className="flex flex-col gap-4">
			<TaskFilters />
			<TaskList tasks={filteredTasks} />
		</div>
	);
}
