"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
	Calendar,
	Target,
	TrendingUp,
	Medal,
	Crown,
	Swords,
} from "lucide-react";
import { RANK_DEFINITIONS, type RankTier } from "@/types/rank";

interface SeasonCardProps {
	seasonNumber: number;
	remainingDays: number;
	rank: {
		currentTier: RankTier;
		seasonHighestTier: RankTier;
		seasonHighestScore: number;
	};
	seasonStats: {
		totalFocusTime: number;
		completedTasks: number;
		averageTasksPerWeek: number;
		growthRate: number;
	};
}

export function SeasonCard({
	seasonNumber,
	remainingDays,
	rank,
	seasonStats,
}: SeasonCardProps) {
	const currentRank = RANK_DEFINITIONS[rank.currentTier];
	const highestRank = RANK_DEFINITIONS[rank.seasonHighestTier];

	return (
		<Card className="h-full bg-gradient-to-br from-slate-50 to-white dark:from-slate-900 dark:to-slate-800 border-2 border-slate-200 dark:border-slate-700 shadow-lg">
			<CardContent className="p-6 space-y-6">
				{/* シーズンヘッダー */}
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 dark:from-purple-500 dark:to-pink-500 p-1 animate-pulse">
							<div className="w-full h-full rounded-full bg-white dark:bg-slate-900 flex items-center justify-center">
								<Calendar className="w-6 h-6 text-purple-500 dark:text-purple-400" />
							</div>
						</div>
						<div>
							<h3 className="text-xl font-bold text-slate-900 dark:text-white">
								シーズン {seasonNumber}
							</h3>
							<div className="text-purple-500 dark:text-purple-400">
								残り {remainingDays} 日
							</div>
						</div>
					</div>
				</div>

				{/* ランク情報 */}
				<Card className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
					<CardContent className="p-4 space-y-4">
						<div className="flex items-center gap-4">
							<div className="w-16 h-16 rounded-lg bg-gradient-to-br from-yellow-300 to-yellow-500 dark:from-yellow-400 dark:to-yellow-600 p-0.5">
								<div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center">
									<Crown className="w-8 h-8 text-yellow-500 dark:text-yellow-400" />
								</div>
							</div>
							<div>
								<div className="text-sm text-yellow-500 dark:text-yellow-400">
									現在のランク
								</div>
								<div className="text-xl font-bold text-slate-900 dark:text-white">
									{currentRank.name}
								</div>
							</div>
						</div>
						<div className="relative">
							<div className="h-4 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 dark:from-yellow-500 dark:to-yellow-300 transition-all duration-500 relative"
									style={{
										width: `${
											(rank.seasonHighestScore /
												RANK_DEFINITIONS[rank.seasonHighestTier]
													.requiredScore) *
											100
										}%`,
									}}
								>
									<div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_25%,rgba(255,255,255,0.2)_50%,transparent_50%,transparent_75%,rgba(255,255,255,0.2)_75%,rgba(255,255,255,0.2))] bg-[length:24px_24px] animate-[shine_1s_linear_infinite]" />
								</div>
							</div>
							<div className="flex items-center justify-between mt-2 text-sm text-slate-600 dark:text-slate-300">
								<span>最高スコア: {rank.seasonHighestScore}</span>
								<span>
									最高ランク:{" "}
									<span className={`${highestRank.color}`}>
										{highestRank.name}
									</span>
								</span>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* シーズン統計 */}
				<div className="grid grid-cols-2 gap-4">
					<Card className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-300 to-blue-500 dark:from-blue-400 dark:to-blue-600 p-0.5">
									<div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center">
										<Target className="w-6 h-6 text-blue-500 dark:text-blue-400" />
									</div>
								</div>
								<div>
									<div className="text-sm text-blue-500 dark:text-blue-400">
										総集中時間
									</div>
									<div className="text-xl font-bold text-slate-900 dark:text-white">
										{Math.floor(seasonStats.totalFocusTime / 60)}
										<span className="text-sm text-blue-500 dark:text-blue-400 ml-1">
											時間
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
					<Card className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
						<CardContent className="p-4">
							<div className="flex items-center gap-3">
								<div className="w-12 h-12 rounded-lg bg-gradient-to-br from-green-300 to-green-500 dark:from-green-400 dark:to-green-600 p-0.5">
									<div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center">
										<Medal className="w-6 h-6 text-green-500 dark:text-green-400" />
									</div>
								</div>
								<div>
									<div className="text-sm text-green-500 dark:text-green-400">
										達成タスク
									</div>
									<div className="text-xl font-bold text-slate-900 dark:text-white">
										{seasonStats.completedTasks}
										<span className="text-sm text-green-500 dark:text-green-400 ml-1">
											個
										</span>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* 追加統計 */}
				<Card className="bg-slate-50/50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
					<CardContent className="p-4 space-y-4">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-300 to-indigo-500 dark:from-indigo-400 dark:to-indigo-600 p-0.5">
									<div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center">
										<Swords className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
									</div>
								</div>
								<div>
									<div className="text-sm text-indigo-500 dark:text-indigo-400">
										週間平均タスク
									</div>
									<div className="text-lg font-bold text-slate-900 dark:text-white">
										{seasonStats.averageTasksPerWeek}
										<span className="text-sm text-indigo-500 dark:text-indigo-400 ml-1">
											個
										</span>
									</div>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<div className="w-10 h-10 rounded-lg bg-gradient-to-br from-rose-300 to-rose-500 dark:from-rose-400 dark:to-rose-600 p-0.5">
									<div className="w-full h-full rounded-lg bg-white dark:bg-slate-900 flex items-center justify-center">
										<TrendingUp className="w-5 h-5 text-rose-500 dark:text-rose-400" />
									</div>
								</div>
								<div>
									<div className="text-sm text-rose-500 dark:text-rose-400">
										成長率
									</div>
									<div className="text-lg font-bold text-slate-900 dark:text-white">
										{seasonStats.growthRate > 0 ? "+" : ""}
										{seasonStats.growthRate}
										<span className="text-sm text-rose-500 dark:text-rose-400 ml-1">
											%
										</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>
			</CardContent>
		</Card>
	);
}
