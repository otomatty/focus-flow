"use client";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Calendar, Clock } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskListItemProps {
	task: Task;
}

export function TaskListItem({ task }: TaskListItemProps) {
	const handleStatusChange = async () => {
		// TODO: タスクのステータス更新
	};

	const handleDelete = async () => {
		// TODO: タスクの削除
	};

	return (
		<Card className="p-4">
			<div className="flex items-start gap-4">
				<Checkbox
					checked={task.status === "completed"}
					onCheckedChange={handleStatusChange}
				/>
				<div className="flex-1 space-y-1">
					<div className="flex items-center gap-2">
						<Link
							href={`/webapp/tasks/${task.id}`}
							className="font-medium hover:underline"
						>
							{task.title}
						</Link>
						{task.ai_generated && (
							<Badge variant="secondary" className="text-xs">
								AI
							</Badge>
						)}
						<Badge
							variant={
								task.priority === "high"
									? "destructive"
									: task.priority === "medium"
										? "default"
										: "secondary"
							}
							className="text-xs"
						>
							{task.priority === "high"
								? "高"
								: task.priority === "medium"
									? "中"
									: "低"}
						</Badge>
					</div>
					{task.description && (
						<p className="text-sm text-muted-foreground line-clamp-2">
							{task.description}
						</p>
					)}
					<div className="flex items-center gap-4 text-sm text-muted-foreground">
						{task.due_date && (
							<div className="flex items-center gap-1">
								<Calendar className="h-4 w-4" />
								<span>
									{formatDistanceToNow(new Date(task.due_date), {
										addSuffix: true,
										locale: ja,
									})}
								</span>
							</div>
						)}
						{task.estimated_duration && (
							<div className="flex items-center gap-1">
								<Clock className="h-4 w-4" />
								<span>{task.estimated_duration}</span>
							</div>
						)}
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon">
							<MoreHorizontal className="h-4 w-4" />
							<span className="sr-only">アクション</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem asChild>
							<Link href={`/webapp/tasks/${task.id}`}>詳細を表示</Link>
						</DropdownMenuItem>
						<DropdownMenuItem
							className="text-destructive"
							onClick={handleDelete}
						>
							削除
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</Card>
	);
}
