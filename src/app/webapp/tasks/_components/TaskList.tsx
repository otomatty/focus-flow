"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskListItem } from "./TaskListItem";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskListProps {
	tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
	if (tasks.length === 0) {
		return (
			<Card className="p-8 flex flex-col items-center justify-center text-center">
				<p className="text-muted-foreground">タスクがありません</p>
				<p className="text-sm text-muted-foreground">
					新しいタスクを作成して始めましょう
				</p>
			</Card>
		);
	}

	return (
		<ScrollArea className="h-[calc(100vh-13rem)]">
			<div className="space-y-4">
				{tasks.map((task) => (
					<TaskListItem key={task.id} task={task} />
				))}
			</div>
		</ScrollArea>
	);
}
