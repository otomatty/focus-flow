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
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";
import type { Task } from "@/types/task";

interface TaskListItemProps {
	task: Task;
}

export function TaskListItem({ task }: TaskListItemProps) {
	const [isHovered, setIsHovered] = useState(false);

	const handleStatusChange = async () => {
		// TODO: タスクのステータス更新
	};

	const handleDelete = async () => {
		// TODO: タスクの削除
	};

	const statusColor = task.status
		? {
				not_started: "bg-yellow-100 text-yellow-800",
				in_progress: "bg-blue-100 text-blue-800",
				completed: "bg-green-100 text-green-800",
			}[task.status]
		: "bg-gray-100 text-gray-800";

	return (
		<Card
			className={cn(
				"p-4 transition-all duration-200 hover:shadow-md",
				isHovered && "scale-[1.01]",
			)}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<div className="flex items-start gap-4">
				<Checkbox
					checked={task.status === "completed"}
					onCheckedChange={handleStatusChange}
					className="mt-1"
				/>
				<div className="flex-1 space-y-2">
					<div className="flex items-center gap-2 flex-wrap">
						<Link
							href={`/webapp/tasks/${task.id}`}
							className="font-medium hover:underline text-lg"
						>
							{task.title}
						</Link>
						<div className="flex gap-2 items-center">
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
							<span
								className={cn("px-2 py-1 rounded-full text-xs", statusColor)}
							>
								{task.status === "not_started"
									? "未着手"
									: task.status === "in_progress"
										? "進行中"
										: "完了"}
							</span>
						</div>
					</div>
					{task.description && (
						<motion.p
							initial={false}
							animate={{ height: isHovered ? "auto" : "1.5rem" }}
							className="text-sm text-muted-foreground overflow-hidden"
						>
							{task.description}
						</motion.p>
					)}
					<div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
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
					</div>
				</div>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="icon" className="h-8 w-8">
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
