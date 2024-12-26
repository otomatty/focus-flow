"use client";

import { useTask } from "@/hooks/use-task";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";

interface TaskBreakdownsProps {
	taskId: string;
}

export function TaskBreakdowns({ taskId }: TaskBreakdownsProps) {
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
						<Skeleton className="h-4 w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!task?.ai_analysis?.breakdowns) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>タスクの分解</CardTitle>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>順序</TableHead>
							<TableHead>タイトル</TableHead>
							<TableHead>予想時間</TableHead>
							<TableHead>経験値</TableHead>
							<TableHead>スキルカテゴリー</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{task.ai_analysis.breakdowns.map((breakdown) => (
							<TableRow key={breakdown.orderIndex}>
								<TableCell>{breakdown.orderIndex}</TableCell>
								<TableCell>{breakdown.title}</TableCell>
								<TableCell>
									{formatDuration(breakdown.estimatedDuration)}
								</TableCell>
								<TableCell>{breakdown.experiencePoints}</TableCell>
								<TableCell>{breakdown.skillCategory}</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
