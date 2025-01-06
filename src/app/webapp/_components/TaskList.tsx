"use client";

import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { TaskDifficulty } from "@/types/dashboard";
import { Clock, Flame, MoreVertical, Play, Info, Trash } from "lucide-react";
import { useState } from "react";
import { TaskDetailDialog } from "./TaskDetailDialog";

interface Task {
	id: string;
	title: string;
	difficulty: TaskDifficulty;
	estimatedTime: number;
	progress: number;
	comboCount: number;
	description?: string;
	dueDate?: string;
	tags?: string[];
	subtasks?: {
		id: string;
		title: string;
		isCompleted: boolean;
	}[];
}

interface TaskListProps {
	tasks: Task[];
}

const getDifficultyColor = (difficulty: TaskDifficulty) => {
	switch (difficulty) {
		case "easy":
			return "text-green-500 dark:text-green-400";
		case "medium":
			return "text-yellow-500 dark:text-yellow-400";
		case "hard":
			return "text-red-500 dark:text-red-400";
	}
};

const getDifficultyBadgeColor = (difficulty: TaskDifficulty) => {
	switch (difficulty) {
		case "easy":
			return "bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300";
		case "medium":
			return "bg-yellow-100 dark:bg-yellow-900/50 text-yellow-700 dark:text-yellow-300";
		case "hard":
			return "bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-300";
	}
};

const getDifficultyLabel = (difficulty: TaskDifficulty) => {
	switch (difficulty) {
		case "easy":
			return "簡単";
		case "medium":
			return "普通";
		case "hard":
			return "難しい";
	}
};

const formatEstimatedTime = (minutes: number) => {
	if (minutes < 60) return `${minutes}分`;
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return remainingMinutes
		? `${hours}時間${remainingMinutes}分`
		: `${hours}時間`;
};

function TaskItem({ task, onStart }: { task: Task; onStart: () => void }) {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div className="relative bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
			<div className="space-y-3">
				<div className="flex items-start gap-4 pr-12">
					<div className="flex-1">
						<div className="flex items-center gap-2">
							<h3
								className={`font-semibold ${getDifficultyColor(task.difficulty)}`}
							>
								{task.title}
							</h3>
							<Badge
								variant="secondary"
								className={getDifficultyBadgeColor(task.difficulty)}
							>
								{getDifficultyLabel(task.difficulty)}
							</Badge>
						</div>
						<div className="flex items-center gap-4 mt-1 text-sm text-gray-500 dark:text-gray-400">
							<div className="flex items-center gap-1">
								<Clock className="w-4 h-4" />
								<span>{formatEstimatedTime(task.estimatedTime)}</span>
							</div>
							{task.comboCount > 0 && (
								<div className="flex items-center gap-1">
									<Flame className="w-4 h-4 text-orange-500" />
									<span className="text-orange-500">
										{task.comboCount} Combo!
									</span>
								</div>
							)}
						</div>
					</div>
				</div>
				<div className="flex items-center gap-2 text-sm">
					<Progress value={task.progress} className="flex-1" />
					<span className="text-gray-500 dark:text-gray-400">
						{task.progress}%
					</span>
				</div>
			</div>
			<div className="absolute top-4 right-4">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
							<MoreVertical className="h-4 w-4" />
							<span className="sr-only">タスクの操作メニューを開く</span>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={onStart}>
							<Play className="mr-2 h-4 w-4" />
							<span>開始</span>
						</DropdownMenuItem>
						<DropdownMenuItem onClick={() => setShowDetails(true)}>
							<Info className="mr-2 h-4 w-4" />
							<span>詳細を表示</span>
						</DropdownMenuItem>
						<DropdownMenuItem className="text-red-600 dark:text-red-400">
							<Trash className="mr-2 h-4 w-4" />
							<span>削除</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<TaskDetailDialog
				task={task}
				open={showDetails}
				onOpenChange={setShowDetails}
			/>
		</div>
	);
}

export function TaskList({ tasks }: TaskListProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
					タスク
				</h2>
				<Button variant="outline" size="sm">
					新規作成
				</Button>
			</div>
			<div className="grid gap-4">
				{tasks.map((task) => (
					<motion.div
						key={task.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<TaskItem
							task={task}
							onStart={() => {
								// タスク開始のロジックをここに追加
							}}
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
}
