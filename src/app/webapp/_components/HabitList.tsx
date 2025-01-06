"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { CheckCircle2, Circle, MoreVertical, Info, Trash } from "lucide-react";
import { useState } from "react";
import type { Habit } from "@/types/dashboard";
import { HabitDetailDialog } from "./HabitDetailDialog";

interface HabitListProps {
	habits: Habit[];
}

function HabitItem({
	habit,
	onComplete,
}: { habit: Habit; onComplete: () => void }) {
	const [showDetails, setShowDetails] = useState(false);

	const isCompletedToday = () => {
		if (!habit.lastCompletedAt) return false;
		const lastCompleted = new Date(habit.lastCompletedAt);
		const today = new Date();
		return (
			lastCompleted.getDate() === today.getDate() &&
			lastCompleted.getMonth() === today.getMonth() &&
			lastCompleted.getFullYear() === today.getFullYear()
		);
	};

	return (
		<div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
			<div className="flex items-start gap-4">
				<Button
					variant="ghost"
					size="icon"
					className={
						isCompletedToday()
							? "text-green-500"
							: "text-gray-400 hover:text-gray-500"
					}
					onClick={onComplete}
				>
					{isCompletedToday() ? (
						<CheckCircle2 className="w-6 h-6" />
					) : (
						<Circle className="w-6 h-6" />
					)}
				</Button>
				<div className="flex-1 space-y-1">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-gray-900 dark:text-gray-100">
								{habit.title}
							</h3>
						</div>
						<div className="flex items-center gap-2">
							<div className="text-sm">
								<span className="text-gray-500 dark:text-gray-400">
									{habit.currentCount}/{habit.targetCount}
								</span>
							</div>
							{habit.streak > 0 && (
								<div className="flex items-center gap-1 text-orange-500">
									<span className="text-lg">🔥</span>
									<span className="font-semibold">{habit.streak}</span>
								</div>
							)}
						</div>
					</div>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						{habit.description}
					</p>
					<div className="flex -space-x-1">
						{Array.from({ length: 7 }).map((_, i) => (
							<div
								key={`${habit.id}-day-${i}`}
								className={`w-6 h-6 rounded-full border-2 ${
									i < habit.currentCount
										? "bg-green-500 border-green-500"
										: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
								}`}
							/>
						))}
					</div>
				</div>
				<div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
								<MoreVertical className="h-4 w-4" />
								<span className="sr-only">習慣の操作メニューを開く</span>
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
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
			</div>
			<HabitDetailDialog
				habit={habit}
				open={showDetails}
				onOpenChange={setShowDetails}
			/>
		</div>
	);
}

export function HabitList({ habits }: HabitListProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
					習慣
				</h2>
				<Button variant="outline" size="sm">
					新規作成
				</Button>
			</div>
			<div className="grid gap-4">
				{habits.map((habit) => (
					<motion.div
						key={habit.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<HabitItem
							habit={habit}
							onComplete={() => {
								// 習慣の完了トグルロジックをここに追加
							}}
						/>
					</motion.div>
				))}
			</div>
		</div>
	);
}
