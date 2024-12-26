import { TaskDetails } from "@/app/webapp/tasks/[id]/_components/TaskDetails";
import { TaskBreakdowns } from "@/app/webapp/tasks/[id]/_components/TaskBreakdowns";
import { TaskProgress } from "@/app/webapp/tasks/[id]/_components/TaskProgress";
import { TaskActions } from "@/app/webapp/tasks/[id]/_components/TaskActions";

interface TasksPageProps {
	params: {
		id: string;
	};
}

export default function TasksPage({ params }: TasksPageProps) {
	return (
		<div className="container py-6 space-y-6">
			<TaskDetails taskId={params.id} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<TaskProgress taskId={params.id} />
				<TaskActions taskId={params.id} />
			</div>
			<TaskBreakdowns taskId={params.id} />
		</div>
	);
}
