"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import type { Database } from "@/types/supabase";
import { useAtom } from "jotai";
import {
	searchQueryAtom,
	statusFilterAtom,
	priorityFilterAtom,
	searchTasksAtom,
	filterTasksAtom,
} from "@/store/tasks";

type Task = Database["public"]["Tables"]["tasks"]["Row"];
type TaskStatus = NonNullable<Task["status"]>;
type TaskPriority = NonNullable<Task["priority"]>;

export function TaskFilters() {
	const [searchQuery, setSearchQuery] = useAtom(searchQueryAtom);
	const [status, setStatus] = useAtom(statusFilterAtom);
	const [priority, setPriority] = useAtom(priorityFilterAtom);
	const [, searchTasks] = useAtom(searchTasksAtom);
	const [, filterTasks] = useAtom(filterTasksAtom);

	useEffect(() => {
		void searchTasks();
	}, [searchTasks]);

	useEffect(() => {
		void filterTasks();
	}, [filterTasks]);

	return (
		<div className="space-y-4 sm:space-y-0 sm:flex sm:items-center sm:gap-4">
			<div className="relative flex-1">
				<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="タスクを検索..."
					className="pl-9"
					value={searchQuery}
					onChange={(e) => setSearchQuery(e.target.value)}
				/>
			</div>
			<div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
				<Select
					value={status ?? "all"}
					onValueChange={(value: TaskStatus | "all") => setStatus(value)}
				>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="ステータス" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">すべて</SelectItem>
						<SelectItem value="not_started">未着手</SelectItem>
						<SelectItem value="in_progress">進行中</SelectItem>
						<SelectItem value="completed">完了</SelectItem>
					</SelectContent>
				</Select>
				<Select
					value={priority ?? "all"}
					onValueChange={(value: TaskPriority | "all") => setPriority(value)}
				>
					<SelectTrigger className="w-full sm:w-[180px]">
						<SelectValue placeholder="優先度" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">すべて</SelectItem>
						<SelectItem value="high">高</SelectItem>
						<SelectItem value="medium">中</SelectItem>
						<SelectItem value="low">低</SelectItem>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
