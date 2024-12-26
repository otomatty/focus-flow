"use client";

import { TaskList } from "./TaskList";
import { TaskFilters } from "./TaskFilters";
import type { Database } from "@/types/supabase";
import { tasksAtom } from "@/store/tasks";
import { useAtom } from "jotai";

export function TasksClient() {
	const [tasks] = useAtom(tasksAtom);

	return (
		<div className="flex flex-col gap-4">
			<TaskFilters />
			<TaskList tasks={tasks} />
		</div>
	);
}
