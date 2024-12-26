"use client";

import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TaskListItem } from "./TaskListItem";
import type { Database } from "@/types/supabase";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskListProps {
	tasks: Task[];
}

export function TaskList({ tasks }: TaskListProps) {
	if (tasks.length === 0) {
		return (
			<Card className="p-8 flex flex-col items-center justify-center text-center min-h-[300px]">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.3 }}
					className="flex flex-col items-center gap-4"
				>
					<PlusCircle className="h-12 w-12 text-muted-foreground" />
					<div>
						<p className="text-lg font-medium">タスクがありません</p>
						<p className="text-sm text-muted-foreground mt-1">
							新しいタスクを作成して始めましょう
						</p>
					</div>
					<Button asChild>
						<Link href="/webapp/tasks/create">タスクを作成</Link>
					</Button>
				</motion.div>
			</Card>
		);
	}

	return (
		<ScrollArea className="h-[calc(100vh-13rem)]">
			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ duration: 0.3 }}
				className="grid gap-4"
			>
				{tasks.map((task, index) => (
					<motion.div
						key={task.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.3, delay: index * 0.1 }}
					>
						<TaskListItem task={task} />
					</motion.div>
				))}
			</motion.div>
		</ScrollArea>
	);
}
