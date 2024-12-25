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
import { Plus } from "lucide-react";
import Link from "next/link";
import { useCallback, useState, useEffect } from "react";
import { useDebounce } from "@/hooks/use-debounce";
import { getFilteredTasks, searchTasks } from "@/app/_actions/task.action";
import type { Database } from "@/types/supabase";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

interface TaskFiltersProps {
	onTasksChange: (tasks: Task[]) => void;
}

export function TaskFilters({ onTasksChange }: TaskFiltersProps) {
	const [searchQuery, setSearchQuery] = useState("");
	const [status, setStatus] = useState<Task["status"] | "all">("all");
	const [priority, setPriority] = useState<Task["priority"] | "all">("all");

	const debouncedSearch = useDebounce(searchQuery, 300);

	const handleSearch = useCallback(async () => {
		if (!debouncedSearch.trim()) {
			const tasks = await getFilteredTasks({ status, priority });
			onTasksChange(tasks);
			return;
		}

		const tasks = await searchTasks(debouncedSearch);
		onTasksChange(tasks);
	}, [debouncedSearch, status, priority, onTasksChange]);

	const handleFilter = useCallback(async () => {
		const tasks = await getFilteredTasks({ status, priority });
		onTasksChange(tasks);
	}, [status, priority, onTasksChange]);

	useEffect(() => {
		handleSearch();
	}, [handleSearch]);

	useEffect(() => {
		handleFilter();
	}, [handleFilter]);

	return (
		<div className="flex items-center gap-4">
			<Input
				placeholder="タスクを検索..."
				className="max-w-sm"
				value={searchQuery}
				onChange={(e) => setSearchQuery(e.target.value)}
			/>
			<Select
				value={status}
				onValueChange={(value: Task["status"] | "all") => setStatus(value)}
			>
				<SelectTrigger className="w-[180px]">
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
				value={priority}
				onValueChange={(value: Task["priority"] | "all") => setPriority(value)}
			>
				<SelectTrigger className="w-[180px]">
					<SelectValue placeholder="優先度" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">すべて</SelectItem>
					<SelectItem value="high">高</SelectItem>
					<SelectItem value="medium">中</SelectItem>
					<SelectItem value="low">低</SelectItem>
				</SelectContent>
			</Select>
			<div className="ml-auto">
				<Button asChild>
					<Link href="/webapp/tasks/create">
						<Plus className="mr-2 h-4 w-4" />
						タスクを作成
					</Link>
				</Button>
			</div>
		</div>
	);
}
