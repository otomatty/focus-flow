"use client";

import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import {
	Play,
	PlusCircle,
	ListTodo,
	Trophy,
	Timer,
	ChevronRight,
} from "lucide-react";

interface QuickAction {
	id: string;
	label: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	onClick: () => void;
}

interface QuickActionsProps {
	actions?: QuickAction[];
}

const defaultActions: QuickAction[] = [
	{
		id: "start-focus",
		label: "フォーカスを開始",
		description: "25分のフォーカスセッションを開始",
		icon: <Play className="w-6 h-6 text-green-500 dark:text-green-400" />,
		color: "from-green-300 to-green-500 dark:from-green-400 dark:to-green-600",
		onClick: () => console.log("Start focus"),
	},
	{
		id: "add-task",
		label: "タスクを追加",
		description: "新しいタスクを作成",
		icon: <PlusCircle className="w-6 h-6 text-blue-500 dark:text-blue-400" />,
		color: "from-blue-300 to-blue-500 dark:from-blue-400 dark:to-blue-600",
		onClick: () => console.log("Add task"),
	},
	{
		id: "view-tasks",
		label: "タスク一覧",
		description: "すべてのタスクを表示",
		icon: <ListTodo className="w-6 h-6 text-purple-500 dark:text-purple-400" />,
		color:
			"from-purple-300 to-purple-500 dark:from-purple-400 dark:to-purple-600",
		onClick: () => console.log("View tasks"),
	},
	{
		id: "view-stats",
		label: "統計を表示",
		description: "詳細な統計を確認",
		icon: <Trophy className="w-6 h-6 text-amber-500 dark:text-amber-400" />,
		color: "from-amber-300 to-amber-500 dark:from-amber-400 dark:to-amber-600",
		onClick: () => console.log("View stats"),
	},
];

export function QuickActions({ actions = defaultActions }: QuickActionsProps) {
	return (
		<Card className="bg-gradient-to-br from-slate-50/50 to-white dark:from-slate-900/50 dark:to-slate-800/50 border-slate-200/50 dark:border-slate-700/50">
			<CardContent className="p-4">
				<div className="flex flex-col space-y-2">
					{actions.map((action) => (
						<motion.div
							key={action.id}
							whileHover={{ scale: 1.01 }}
							whileTap={{ scale: 0.99 }}
						>
							<button
								type="button"
								onClick={action.onClick}
								className="w-full p-3 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-slate-200 dark:border-slate-700 shadow-sm rounded-lg group transition-colors"
							>
								<div className="flex items-center w-full">
									<div
										className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.color} p-0.5 group-hover:scale-105 transition-transform shrink-0`}
									>
										<div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center">
											{action.icon}
										</div>
									</div>
									<div className="ml-3 text-left flex-1 min-w-0">
										<div className="font-bold text-sm text-slate-900 dark:text-white truncate">
											{action.label}
										</div>
										<div className="text-xs text-slate-500 dark:text-slate-400 truncate">
											{action.description}
										</div>
									</div>
									<div className="ml-2 text-slate-400 dark:text-slate-500">
										<ChevronRight className="w-4 h-4" />
									</div>
								</div>
							</button>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
