"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskDetails } from "./_components/TaskDetails";
import { TaskBreakdowns } from "./_components/TaskBreakdowns";
import { TaskProgress } from "./_components/TaskProgress";
import { TaskActions } from "./_components/TaskActions";

export default function TaskDetailPage({
	params,
}: {
	params: { id: string };
}) {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスクの詳細"
				description="タスクの詳細情報と進捗を確認できます。"
			/>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				<div className="lg:col-span-2 space-y-6">
					<TaskDetails id={params.id} />
					<TaskBreakdowns id={params.id} />
				</div>
				<div className="space-y-6">
					<TaskProgress id={params.id} />
					<TaskActions id={params.id} />
				</div>
			</div>
		</div>
	);
}
