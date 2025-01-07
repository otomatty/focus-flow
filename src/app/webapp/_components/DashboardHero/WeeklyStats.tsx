import { Timer, CheckCircle2, Trophy, BarChart3 } from "lucide-react";
import type { WeeklyStatsData } from "./types";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface WeeklyStatsProps {
	stats: WeeklyStatsData;
}

export function WeeklyStats({ stats }: WeeklyStatsProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center space-x-2">
				<BarChart3 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
				<h2 className="text-lg font-bold text-slate-900 dark:text-white">
					今週の統計
				</h2>
			</div>
			<div className="grid grid-cols-3 gap-4">
				{[
					{
						icon: Timer,
						label: "集中時間",
						value: `${stats.focusTime}時間`,
						gradient:
							"from-yellow-300 to-yellow-500 dark:from-yellow-400 dark:to-yellow-600",
						iconColor: "text-yellow-500 dark:text-yellow-400",
					},
					{
						icon: CheckCircle2,
						label: "完了タスク",
						value: `${stats.completedTasks}個`,
						gradient:
							"from-green-300 to-green-500 dark:from-green-400 dark:to-green-600",
						iconColor: "text-green-500 dark:text-green-400",
					},
					{
						icon: Trophy,
						label: "習慣実施",
						value: `${stats.completedHabits}回`,
						gradient:
							"from-blue-300 to-blue-500 dark:from-blue-400 dark:to-blue-600",
						iconColor: "text-blue-500 dark:text-blue-400",
					},
				].map((item, index) => (
					<motion.div
						key={item.label}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.5, delay: index * 0.1 }}
						className="relative group"
					>
						<motion.div
							whileHover={{ scale: 1.05 }}
							className="space-y-2 p-4 rounded-xl bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm border border-slate-200/50 dark:border-slate-700/50 shadow-md hover:shadow-lg transition-all duration-300"
						>
							<div
								className={cn(
									"w-12 h-12 rounded-xl bg-gradient-to-br p-0.5",
									item.gradient,
								)}
							>
								<div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center relative overflow-hidden">
									<motion.div
										className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-transparent via-white/10 to-transparent"
										animate={{
											x: ["0%", "200%"],
										}}
										transition={{
											duration: 1.5,
											repeat: Number.POSITIVE_INFINITY,
											ease: "linear",
										}}
									/>
									<item.icon className={cn("w-6 h-6", item.iconColor)} />
								</div>
							</div>
							<div>
								<motion.div
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									className="text-sm font-medium text-slate-500 dark:text-slate-400"
								>
									{item.label}
								</motion.div>
								<motion.div
									initial={{ scale: 0.5 }}
									animate={{ scale: 1 }}
									className="text-xl font-bold text-slate-900 dark:text-white"
								>
									{item.value}
								</motion.div>
							</div>
						</motion.div>
					</motion.div>
				))}
			</div>
		</div>
	);
}
