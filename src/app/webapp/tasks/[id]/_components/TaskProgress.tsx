"use client";

import { useTask } from "@/hooks/use-task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";

interface TaskProgressProps {
	taskId: string;
}

export function TaskProgress({ taskId }: TaskProgressProps) {
	const { task, isLoading } = useTask(taskId);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-6 w-32" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!task) {
		return null;
	}

	const progressPercentage = (() => {
		switch (task.status) {
			case "not_started":
				return 0;
			case "in_progress":
				return 50;
			case "completed":
				return 100;
			default:
				return 0;
		}
	})();

	return (
		<Card>
			<CardHeader>
				<CardTitle>タスクの進捗</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Progress value={progressPercentage} />
				<div className="flex justify-between text-sm text-muted-foreground">
					<div>経験値: {task.experience?.base_exp ?? 0} XP</div>
					<div>進捗: {progressPercentage}%</div>
				</div>
			</CardContent>
		</Card>
	);
}
