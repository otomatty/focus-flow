import { Calendar, Trophy, BarChart2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import type { Habit } from "@/types/dashboard";

interface HabitDetailDialogProps {
	habit: Habit;
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

export function HabitDetailDialog({
	habit,
	open,
	onOpenChange,
}: HabitDetailDialogProps) {
	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={onOpenChange}
			title={habit.title}
			description={habit.description}
			trigger={null}
		>
			<div className="p-4 space-y-6 overflow-y-auto">
				<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
					{habit.startDate && (
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<Calendar className="w-4 h-4" />
							<span>
								開始日: {new Date(habit.startDate).toLocaleDateString()}
							</span>
						</div>
					)}
					{habit.bestStreak !== undefined && (
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<Trophy className="w-4 h-4" />
							<span>最高連続記録: {habit.bestStreak}日</span>
						</div>
					)}
					{habit.category && (
						<div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
							<BarChart2 className="w-4 h-4" />
							<span>カテゴリー: {habit.category}</span>
						</div>
					)}
				</div>

				<div className="space-y-2">
					<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
						進捗状況
					</h4>
					<div className="flex items-center gap-4">
						<div className="flex -space-x-1">
							{Array.from({ length: habit.targetCount }).map((_, i) => (
								<div
									key={`progress-${habit.id}-${i}`}
									className={`w-6 h-6 rounded-full border-2 ${
										i < habit.currentCount
											? "bg-green-500 border-green-500"
											: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
									}`}
								/>
							))}
						</div>
						<span className="text-sm text-gray-500 dark:text-gray-400">
							{habit.currentCount}/{habit.targetCount}
						</span>
					</div>
				</div>

				{habit.completionHistory && habit.completionHistory.length > 0 && (
					<div className="space-y-2">
						<h4 className="text-sm font-medium text-gray-900 dark:text-gray-100">
							最近の記録
						</h4>
						<div className="flex flex-wrap gap-1">
							{habit.completionHistory.map((record) => (
								<div
									key={record.date}
									className={`w-8 h-8 rounded-lg border-2 flex items-center justify-center ${
										record.completed
											? "bg-green-500 border-green-500 text-white"
											: "bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700"
									}`}
									title={new Date(record.date).toLocaleDateString()}
								>
									{record.completed ? "✓" : "×"}
								</div>
							))}
						</div>
					</div>
				)}

				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						size="sm"
						className="text-red-500 hover:text-red-600"
					>
						削除
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
