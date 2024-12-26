import { PageHeader } from "@/components/custom/PageHeader";
import { TasksClient } from "./_components/TasksClient";

export default function TasksPage() {
	return (
		<div className="container max-w-4xl space-y-8">
			<PageHeader
				title="タスク"
				description="タスクの作成、管理、進捗の追跡ができます。"
				action={{
					label: "タスクを作成",
					href: "/webapp/tasks/create",
				}}
			/>
			<TasksClient />
		</div>
	);
}
