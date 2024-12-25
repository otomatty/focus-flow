"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskBoard } from "./_components/TaskBoard";
import { TaskBoardFilters } from "./_components/TaskBoardFilters";

export default function TaskBoardPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスクボード"
				description="カンバンボード形式でタスクを管理できます。"
			/>
			<TaskBoardFilters />
			<TaskBoard />
		</div>
	);
}
