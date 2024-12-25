"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskList } from "./_components/TaskList";
import { TaskFilters } from "./_components/TaskFilters";
import { useState } from "react";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export default function TasksPage() {
	const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);

	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスク"
				description="タスクの作成、管理、進捗の追跡ができます。"
				action={{
					label: "タスクを作成",
					href: "/webapp/tasks/create",
				}}
			/>
			<div className="flex flex-col gap-4">
				<TaskFilters onTasksChange={setFilteredTasks} />
				<TaskList tasks={filteredTasks} />
			</div>
		</div>
	);
}
