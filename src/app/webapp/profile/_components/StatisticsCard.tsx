"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { Trophy, Target, Clock, CheckCircle2 } from "lucide-react";
import { ActivityHeatmap } from "./ActivityHeatmap";

interface Statistics {
	userId: string;
	focusStats: {
		totalSessions: number;
		totalTime: string;
		avgSessionLength: string;
	};
	taskStats: {
		totalTasks: number;
		completedTasks: number;
		completionRate: number;
	};
	streaks: {
		currentLoginStreak: number;
		longestLoginStreak: number;
	};
	level: {
		currentLevel: number;
		currentExp: number;
		nextLevelExp: number;
		progress: number;
	};
}

interface StatisticsCardProps {
	statistics: Statistics;
}

export function StatisticsCard({ statistics }: StatisticsCardProps) {
	return (
		<Card className="bg-card/50 backdrop-blur-sm border-border/50">
			<CardHeader>
				<CardTitle className="text-primary">統計情報</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-8">
					{/* レベル情報 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
						className="relative p-4 rounded-lg bg-gradient-to-b from-primary/20 to-primary/5"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-full bg-background/50">
								<Trophy className="w-5 h-5 text-primary" />
							</div>
							<h4 className="font-bold text-lg text-primary">
								レベル {statistics.level.currentLevel}
							</h4>
						</div>
						<Progress
							value={statistics.level.progress * 100}
							className="h-2 mb-2"
						/>
						<p className="text-sm text-muted-foreground">
							次のレベルまで:{" "}
							{statistics.level.nextLevelExp - statistics.level.currentExp} EXP
						</p>
					</motion.div>

					{/* フォーカス統計 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="relative p-4 rounded-lg bg-gradient-to-b from-blue-500/20 to-blue-500/5"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-full bg-background/50">
								<Clock className="w-5 h-5 text-blue-500" />
							</div>
							<h4 className="font-bold text-lg">フォーカス</h4>
						</div>
						<dl className="grid grid-cols-2 gap-3 text-sm">
							<div className="space-y-1">
								<dt className="text-muted-foreground">総セッション数</dt>
								<dd className="font-bold text-lg">
									{statistics.focusStats.totalSessions}
								</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-muted-foreground">総フォーカス時間</dt>
								<dd className="font-bold text-lg">
									{statistics.focusStats.totalTime}
								</dd>
							</div>
							<div className="col-span-2 space-y-1">
								<dt className="text-muted-foreground">平均セッション時間</dt>
								<dd className="font-bold text-lg">
									{statistics.focusStats.avgSessionLength}
								</dd>
							</div>
						</dl>
					</motion.div>

					{/* タスク統計 */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="relative p-4 rounded-lg bg-gradient-to-b from-emerald-500/20 to-emerald-500/5"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-full bg-background/50">
								<CheckCircle2 className="w-5 h-5 text-emerald-500" />
							</div>
							<h4 className="font-bold text-lg">タスク</h4>
						</div>
						<dl className="grid grid-cols-2 gap-3 text-sm">
							<div className="space-y-1">
								<dt className="text-muted-foreground">完了タスク</dt>
								<dd className="font-bold text-lg">
									{statistics.taskStats.completedTasks}/
									{statistics.taskStats.totalTasks}
								</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-muted-foreground">完了率</dt>
								<dd className="font-bold text-lg">
									{statistics.taskStats.completionRate}%
								</dd>
							</div>
						</dl>
					</motion.div>

					{/* ストリーク */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="relative p-4 rounded-lg bg-gradient-to-b from-purple-500/20 to-purple-500/5"
					>
						<div className="flex items-center gap-3 mb-3">
							<div className="p-2 rounded-full bg-background/50">
								<Target className="w-5 h-5 text-purple-500" />
							</div>
							<h4 className="font-bold text-lg">ストリーク</h4>
						</div>
						<dl className="grid grid-cols-2 gap-3 text-sm">
							<div className="space-y-1">
								<dt className="text-muted-foreground">現在のログイン</dt>
								<dd className="font-bold text-lg">
									{statistics.streaks.currentLoginStreak}日
								</dd>
							</div>
							<div className="space-y-1">
								<dt className="text-muted-foreground">最長ログイン</dt>
								<dd className="font-bold text-lg">
									{statistics.streaks.longestLoginStreak}日
								</dd>
							</div>
						</dl>
					</motion.div>

					{/* アクティビ�ィヒートマップ */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
						className="relative p-4 rounded-lg bg-gradient-to-b from-background/50 to-background/20"
					>
						<ActivityHeatmap userId={statistics.userId} />
					</motion.div>
				</div>
			</CardContent>
		</Card>
	);
}
