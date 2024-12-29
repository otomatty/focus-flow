import { PageHeader } from "@/components/custom/PageHeader";
import { CreateTaskForm } from "./_components/CreateTaskForm";
import { DecomposedTaskList } from "./_components/DecomposedTaskList";

export default function CreateTaskPage() {
	return (
		<div className="container mx-auto py-8">
			<PageHeader
				title="タスクの作成"
				description="タスクのタイトルを入力し、AIに分析させることで、タスクの詳細を自動的に設定できます。"
			/>
			<div className="space-y-8">
				<CreateTaskForm />
				<DecomposedTaskList />
			</div>
		</div>
	);
}
