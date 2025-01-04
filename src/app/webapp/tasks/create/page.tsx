import { PageHeader } from "@/components/custom/PageHeader";
import { DecomposedTaskList } from "./_components/DecomposedTaskList";
import { TaskCreationTabs } from "./_components/TaskCreationTabs";

export default function CreateTaskPage() {
	return (
		<div className="container mx-auto py-8">
			<PageHeader
				title="タスクの作成"
				description="タスクのタイトルを入力し、AIに分析させることで、タスクの詳細を自動的に設定できます。"
				backHref="/webapp/tasks"
			/>
			<div className="space-y-8">
				<TaskCreationTabs />
				<DecomposedTaskList />
			</div>
		</div>
	);
}
