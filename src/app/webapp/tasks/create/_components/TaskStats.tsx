"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, Trophy, ListTodo } from "lucide-react";
import type { TaskWithParent } from "@/types/task";
import { formatDuration, parseDuration } from "@/utils/time";

interface TaskStatsProps {
	tasks: TaskWithParent[];
}

export function TaskStats({ tasks }: TaskStatsProps) {
	// 合計時間の計算
	const totalMinutes = tasks.reduce(
		(total, task) => total + parseDuration(task.estimated_duration),
		0,
	);

	// 合計経験値の計算
	const totalXP = tasks.reduce(
		(total, task) => total + (task.experience_points || 0),
		0,
	);

	return (
		<div className="grid gap-4 md:grid-cols-3">
			<Card>
				<CardContent className="flex items-center gap-4 p-4">
					<ListTodo className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium leading-none">タスク数</p>
						<p className="text-2xl font-bold">{tasks.length}</p>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="flex items-center gap-4 p-4">
					<Trophy className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium leading-none">合計経験値</p>
						<p className="text-2xl font-bold">{totalXP} XP</p>
					</div>
				</CardContent>
			</Card>
			<Card>
				<CardContent className="flex items-center gap-4 p-4">
					<Clock className="h-5 w-5 text-muted-foreground" />
					<div>
						<p className="text-sm font-medium leading-none">合計時間</p>
						<p className="text-2xl font-bold">{formatDuration(totalMinutes)}</p>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
