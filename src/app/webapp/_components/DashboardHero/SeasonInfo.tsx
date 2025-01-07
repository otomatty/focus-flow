import { Progress } from "@/components/ui/progress";
import {
	Crown,
	Star,
	ChevronUp,
	Calendar,
	Clock,
	CheckCircle2,
	AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import type { SeasonData } from "./types";

interface SeasonInfoProps {
	season: SeasonData;
}

export function SeasonInfo({ season }: SeasonInfoProps) {
	const progress =
		(season.progress.current_points / season.rankRequirements.required_points) *
		100;
	const milestones = [25, 50, 75, 100];

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			className="h-full"
		>
			<div className="relative h-full p-6 rounded-2xl bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-purple-500/10 border border-purple-200/20 dark:border-purple-800/20">
				<motion.div
					className="absolute inset-0 bg-grid-purple-500/[0.02] dark:bg-grid-purple-400/[0.02]"
					style={{
						backgroundSize: "24px 24px",
						maskImage:
							"radial-gradient(circle at center, black, transparent 80%)",
					}}
					animate={{
						opacity: [0.3, 0.5, 0.3],
					}}
					transition={{
						duration: 4,
						repeat: Number.POSITIVE_INFINITY,
						repeatType: "reverse",
					}}
				/>
				<div className="relative space-y-6">
					{/* シーズンヘッダー */}
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-3">
							<div className="relative">
								<motion.div
									animate={{
										scale: [1, 1.1, 1],
										rotate: [0, 5, -5, 0],
									}}
									transition={{
										duration: 3,
										repeat: Number.POSITIVE_INFINITY,
										ease: "easeInOut",
									}}
									className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl opacity-75 blur-sm"
								/>
								<div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 p-0.5">
									<div className="w-full h-full rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center">
										<Crown className="w-5 h-5 text-purple-500" />
									</div>
								</div>
							</div>
							<div>
								<h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
									シーズン {season.season.season_number}
								</h3>
								<div className="flex items-center space-x-1 text-xs text-slate-500 dark:text-slate-400">
									<Calendar className="w-3 h-3" />
									<span>残り {season.remainingDays} 日</span>
								</div>
							</div>
						</div>
					</div>

					{/* ランク情報 */}
					<div className="space-y-2">
						<div className="flex items-center space-x-2">
							<Star className="w-5 h-5 text-purple-500" />
							<span className="text-lg font-bold text-purple-600 dark:text-purple-400">
								{season.progress.current_rank}
							</span>
						</div>
						<div className="relative pt-2">
							<div className="h-3 bg-purple-100 dark:bg-purple-900/20 rounded-full overflow-hidden">
								<div
									className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full relative"
									style={{ width: `${progress}%` }}
								>
									<motion.div
										className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent"
										animate={{
											x: ["0%", "200%"],
										}}
										transition={{
											duration: 2,
											repeat: Number.POSITIVE_INFINITY,
											ease: "linear",
										}}
										style={{ opacity: 0.2 }}
									/>
								</div>
							</div>
							<div className="absolute top-0 left-0 w-full flex justify-between px-1">
								{milestones.map((milestone) => (
									<div
										key={milestone}
										className={cn(
											"w-2 h-2 rounded-full border-2 border-white dark:border-slate-800 -mt-0.5",
											progress >= milestone
												? "bg-gradient-to-r from-purple-500 to-pink-500"
												: "bg-purple-100 dark:bg-purple-900/20",
										)}
									/>
								))}
							</div>
						</div>
					</div>

					{/* 進捗情報 */}
					<div className="space-y-4">
						<div className="flex items-center justify-between">
							<div className="text-sm font-medium text-slate-600 dark:text-slate-300">
								次のランクまで
							</div>
							<div className="text-sm font-bold text-purple-600 dark:text-purple-400">
								{Math.floor(progress)}%
							</div>
						</div>
						<div className="flex items-center justify-between p-3 rounded-xl bg-white/50 dark:bg-slate-800/50 border border-purple-100/20 dark:border-purple-900/20">
							<div className="space-y-1">
								<div className="text-xs text-slate-500 dark:text-slate-400">
									現在のポイント
								</div>
								<div className="text-lg font-bold text-purple-600 dark:text-purple-400">
									{season.progress.current_points}
									<span className="ml-1 text-xs font-medium">pt</span>
								</div>
							</div>
							<div className="w-px h-8 bg-slate-200 dark:bg-slate-700" />
							<HoverCard>
								<HoverCardTrigger asChild>
									<div className="space-y-1 cursor-help">
										<div className="text-xs text-slate-500 dark:text-slate-400">
											必要ポイント
										</div>
										<div className="text-lg font-bold text-slate-600 dark:text-slate-300">
											{season.rankRequirements.required_points}
											<span className="ml-1 text-xs font-medium">pt</span>
										</div>
									</div>
								</HoverCardTrigger>
								<HoverCardContent className="w-80">
									<div className="space-y-2">
										<h4 className="text-sm font-semibold">ランクアップ要件</h4>
										<div className="text-sm space-y-1">
											{season.rankRequirements.focus_time_requirement && (
												<div className="flex items-center gap-2">
													<Clock className="w-4 h-4 text-purple-500" />
													<span>
														累計フォーカス時間:{" "}
														{season.rankRequirements.focus_time_requirement}
													</span>
												</div>
											)}
											{season.rankRequirements.task_completion_requirement && (
												<div className="flex items-center gap-2">
													<CheckCircle2 className="w-4 h-4 text-green-500" />
													<span>
														タスク完了数:{" "}
														{
															season.rankRequirements
																.task_completion_requirement
														}
													</span>
												</div>
											)}
											{season.rankRequirements.daily_focus_requirement && (
												<div className="flex items-center gap-2">
													<AlertCircle className="w-4 h-4 text-yellow-500" />
													<span>
														1日の目標時間:{" "}
														{season.rankRequirements.daily_focus_requirement}
													</span>
												</div>
											)}
											{season.rankRequirements.weekly_focus_requirement && (
												<div className="flex items-center gap-2">
													<AlertCircle className="w-4 h-4 text-orange-500" />
													<span>
														週の目標時間:{" "}
														{season.rankRequirements.weekly_focus_requirement}
													</span>
												</div>
											)}
										</div>
									</div>
								</HoverCardContent>
							</HoverCard>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
