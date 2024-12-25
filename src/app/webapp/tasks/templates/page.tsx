"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskTemplateList } from "./_components/TaskTemplateList";
import { TaskTemplateFilters } from "./_components/TaskTemplateFilters";
import { TaskTemplateCreate } from "./_components/TaskTemplateCreate";

export default function TaskTemplatesPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスクテンプレート"
				description="よく使うタスクのテンプレートを管理できます。"
			/>
			<div className="flex gap-6">
				<div className="flex-1 space-y-4">
					<TaskTemplateFilters />
					<TaskTemplateList />
				</div>
				<TaskTemplateCreate />
			</div>
		</div>
	);
}
