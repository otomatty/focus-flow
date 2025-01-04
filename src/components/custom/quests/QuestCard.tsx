"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import type { Quest, UserQuest } from "@/types/quests";
import Link from "next/link";
import { Target, Clock, Zap, Trophy } from "lucide-react";

interface QuestCardProps {
	quest: Quest;
	userQuest: UserQuest;
}

export function QuestCard({ quest, userQuest }: QuestCardProps) {
	// クエストタイプに応じたアイコンを選択
	const QuestIcon = {
		TASK_COMPLETION: Target,
		TIME_MANAGEMENT: Clock,
		STREAK: Zap,
		ACHIEVEMENT: Trophy,
	}[quest.quest_type];

	// クエストタイプに応じたテーマカラー
	const themeColors = {
		TASK_COMPLETION: {
			bg: "from-blue-500/10 to-blue-600/5",
			border: "border-blue-500/20",
			text: "text-blue-500",
			progress: "bg-blue-500",
		},
		TIME_MANAGEMENT: {
			bg: "from-purple-500/10 to-purple-600/5",
			border: "border-purple-500/20",
			text: "text-purple-500",
			progress: "bg-purple-500",
		},
		STREAK: {
			bg: "from-amber-500/10 to-amber-600/5",
			border: "border-amber-500/20",
			text: "text-amber-500",
			progress: "bg-amber-500",
		},
		ACHIEVEMENT: {
			bg: "from-emerald-500/10 to-emerald-600/5",
			border: "border-emerald-500/20",
			text: "text-emerald-500",
			progress: "bg-emerald-500",
		},
	}[quest.quest_type];

	return (
		<Link href={`/webapp/quests/${quest.id}`} className="block h-full">
			<Card
				className={cn(
					"group relative h-full w-full overflow-hidden transition-all duration-300",
					"hover:shadow-xl hover:-translate-y-1",
					"cursor-pointer active:translate-y-0 active:shadow-lg",
					"bg-gradient-to-br",
					themeColors.bg,
					themeColors.border,
					"backdrop-blur-sm",
				)}
			>
				{/* 背景アイコン */}
				<div className="absolute right-4 bottom-4 opacity-10">
					<QuestIcon className={cn("h-20 w-20", themeColors.text)} />
				</div>

				<div className="relative flex h-full flex-col p-4">
					{/* ヘッダー */}
					<div className="mb-4 flex items-start justify-between">
						<div className="flex-1">
							<h3 className="line-clamp-2 text-lg font-bold text-foreground">
								{quest.title}
							</h3>
						</div>
						<div className="ml-4 flex-none">
							<div
								className={cn(
									"rounded-full px-3 py-1",
									"bg-gradient-to-r",
									themeColors.bg,
									"border",
									themeColors.border,
								)}
							>
								<span className={cn("text-sm font-bold", themeColors.text)}>
									+{quest.reward_exp} EXP
								</span>
							</div>
						</div>
					</div>

					{/* 説明文 */}
					<p className="mb-4 flex-1 text-sm text-muted-foreground/80 line-clamp-2">
						{quest.description}
					</p>

					{/* フッター */}
					<div className="space-y-2">
						<div className="flex items-center justify-between text-sm">
							<span className="font-medium text-foreground/80">進捗状況</span>
							<span className={cn("font-bold", themeColors.text)}>
								{userQuest.progress.percentage}%
							</span>
						</div>
						<div className="h-2 w-full rounded-full bg-background/50 p-0.5">
							<div
								className={cn(
									"h-full rounded-full transition-all duration-300",
									themeColors.progress,
								)}
								style={{ width: `${userQuest.progress.percentage}%` }}
							/>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
}
