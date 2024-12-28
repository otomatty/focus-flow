"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock } from "lucide-react";
import { useTask } from "@/hooks/use-task";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface TaskDetailsProps {
	taskId: string;
}

export function TaskDetails({ taskId }: TaskDetailsProps) {
	const { task, isLoading } = useTask(taskId);

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>タスクの詳細</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="animate-pulse space-y-4">
						<div className="h-4 bg-muted rounded w-3/4" />
						<div className="h-4 bg-muted rounded w-1/2" />
						<div className="h-4 bg-muted rounded w-2/3" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!task) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>タスクの詳細</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground">
						タスクが見つかりませんでした。
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>タスクの詳細</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<h3 className="text-xl font-semibold">{task.title}</h3>
					{task.description && (
						<p className="mt-2 text-muted-foreground">{task.description}</p>
					)}
				</div>

				<div className="flex flex-wrap gap-4">
					<Badge
						variant={
							task.priority === "high"
								? "destructive"
								: task.priority === "medium"
									? "default"
									: "secondary"
						}
					>
						{task.priority === "high"
							? "最優先"
							: task.priority === "medium"
								? "通常"
								: "低"}
					</Badge>
					<Badge
						variant={
							task.status === "completed"
								? "default"
								: task.status === "in_progress"
									? "secondary"
									: "outline"
						}
					>
						{task.status === "completed"
							? "完了"
							: task.status === "in_progress"
								? "進行中"
								: "未着手"}
					</Badge>
					{task.category && <Badge variant="outline">{task.category}</Badge>}
					{task.ai_generated && (
						<Badge variant="secondary" className="gap-1">
							AI生成
						</Badge>
					)}
				</div>

				<div className="flex flex-wrap gap-6 text-sm text-muted-foreground">
					{task.due_date && (
						<div className="flex items-center gap-2">
							<Calendar className="h-4 w-4" />
							<span>
								期限:{" "}
								{formatDistanceToNow(new Date(task.due_date), {
									addSuffix: true,
									locale: ja,
								})}
							</span>
						</div>
					)}
					{task.estimated_duration && (
						<div className="flex items-center gap-2">
							<Clock className="h-4 w-4" />
							<span>予定時間: {task.estimated_duration as string}</span>
						</div>
					)}
				</div>

				{task.experience_points > 0 && (
					<div className="flex items-center gap-2">
						<Badge variant="secondary">+{task.experience_points} XP</Badge>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
