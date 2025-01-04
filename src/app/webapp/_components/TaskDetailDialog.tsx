import { Calendar, BarChart2, CheckCircle2, Circle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import type { Task } from "@/types/dashboard";

interface TaskDetailDialogProps {
	task: Task;
	open: boolean;
	onOpenChange: (open: boolean) => void;
	onComplete?: (subtaskId: string) => void;
}

export function TaskDetailDialog({
	task,
	open,
	onOpenChange,
	onComplete,
}: TaskDetailDialogProps) {
	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={onOpenChange}
			title={task.title}
			description={task.description || "タスクの詳細"}
			trigger={null}
		>
			<div className="p-4 space-y-6 overflow-y-auto">
				{task.description && (
					<p className="text-sm text-gray-600 dark:text-gray-300">
						{task.description}
					</p>
				)}

				<div className="flex flex-wrap gap-4 text-sm">
					{task.dueDate && (
						<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
							<Calendar className="w-4 h-4" />
							<span>{new Date(task.dueDate).toLocaleDateString()}</span>
						</div>
					)}
					<div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
						<BarChart2 className="w-4 h-4" />
						<span>難易度: {task.difficulty}</span>
					</div>
				</div>

				{task.tags && task.tags.length > 0 && (
					<div className="flex flex-wrap gap-2">
						{task.tags.map((tag) => (
							<Badge
								key={tag}
								variant="secondary"
								className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300"
							>
								#{tag}
							</Badge>
						))}
					</div>
				)}

				{task.subtasks && task.subtasks.length > 0 && (
					<div className="space-y-2">
						<h4 className="font-medium text-gray-900 dark:text-gray-100">
							サブタスク
						</h4>
						<div className="space-y-2">
							{task.subtasks.map((subtask) => (
								<div
									key={subtask.id}
									className="flex items-center gap-2 text-sm"
								>
									<Button
										variant="ghost"
										size="icon"
										className={
											subtask.isCompleted
												? "text-green-500"
												: "text-gray-400 hover:text-gray-500"
										}
										onClick={() => onComplete?.(subtask.id)}
									>
										{subtask.isCompleted ? (
											<CheckCircle2 className="w-4 h-4" />
										) : (
											<Circle className="w-4 h-4" />
										)}
									</Button>
									<span
										className={`${
											subtask.isCompleted
												? "text-gray-400 line-through"
												: "text-gray-600 dark:text-gray-300"
										}`}
									>
										{subtask.title}
									</span>
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						className="text-red-500 hover:text-red-600"
					>
						削除
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
