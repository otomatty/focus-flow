"use client";

import { useTask } from "@/hooks/use-task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronRight } from "lucide-react";

interface TaskDependenciesProps {
	taskId: string;
}

export function TaskDependencies({ taskId }: TaskDependenciesProps) {
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

	if (!task?.dependencies || task.dependencies.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>依存関係</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-4">
					{task.dependencies.map((dep) => (
						<div
							key={`${dep.prerequisite_task_id}-${dep.dependency_type}`}
							className="flex items-center gap-2"
						>
							<Badge
								variant={
									dep.dependency_type === "required" ? "default" : "secondary"
								}
								className="flex items-center gap-1"
							>
								<ChevronRight className="h-3 w-3" />
								{dep.prerequisite_task_id}
							</Badge>
							<span className="text-sm text-muted-foreground">
								{dep.link_type === "finish_to_start"
									? "完了後に開始"
									: dep.link_type === "start_to_start"
										? "同時に開始"
										: dep.link_type === "finish_to_finish"
											? "同時に完了"
											: "開始後に完了"}
							</span>
							<Badge variant="outline" className="ml-auto">
								{dep.status === "pending"
									? "待機中"
									: dep.status === "satisfied"
										? "満たされている"
										: dep.status === "blocked"
											? "ブロック中"
											: "スキップ"}
							</Badge>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
