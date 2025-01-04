import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Quest, UserQuest } from "@/types/quests";
import Link from "next/link";
import { Target, Clock, Zap, Trophy } from "lucide-react";

interface PickupQuestCardProps {
	quest: Quest;
	userQuest: UserQuest;
	size?: "small" | "medium" | "large";
}

export function PickupQuestCard({
	quest,
	userQuest,
	size = "medium",
}: PickupQuestCardProps) {
	// クエストタイプに応じたアイコンを選択
	const QuestIcon = {
		TASK_COMPLETION: Target,
		TIME_MANAGEMENT: Clock,
		STREAK: Zap,
		ACHIEVEMENT: Trophy,
	}[quest.quest_type];

	return (
		<Link href={`/webapp/quests/${quest.id}`} className="block h-full">
			<Card
				className={cn(
					"group relative h-full w-full overflow-hidden transition-all",
					"hover:shadow-lg hover:-translate-y-0.5",
					"cursor-pointer active:translate-y-0 active:shadow-md",
					"bg-gradient-to-br",
					{
						"from-[var(--quest-gradient-from)] to-[var(--quest-gradient-to)]":
							quest.theme?.gradient,
					},
				)}
				style={
					{
						"--quest-gradient-from": quest.theme?.gradient?.from,
						"--quest-gradient-to": quest.theme?.gradient?.to,
						"--quest-text": quest.theme?.text,
						"--quest-badge": quest.theme?.badge,
					} as React.CSSProperties
				}
			>
				{/* オーバーレイ（ホバー時に暗く） */}
				<div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30" />

				{/* 背景アイコン */}
				<div className="absolute right-4 bottom-4 opacity-10">
					<QuestIcon
						className={cn(
							"text-white transition-all duration-300 group-hover:opacity-20",
							{
								"w-24 h-24": size === "large",
								"w-20 h-20": size === "medium",
								"w-16 h-16": size === "small",
							},
						)}
					/>
				</div>

				{/* 背景画像 */}
				{quest.background_image && (
					<div
						className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-20 transition-opacity group-hover:opacity-10"
						style={{ backgroundImage: `url(${quest.background_image})` }}
					/>
				)}

				<div className="relative flex h-full flex-col p-4">
					{/* メインコンテンツ */}
					<div className="flex-1">
						{/* タイトル（ホバー時に小さく） */}
						<h3
							className={cn(
								"font-bold transition-all duration-300",
								"group-hover:text-lg",
								{
									"text-2xl": size === "large",
									"text-xl": size === "medium",
									"text-lg": size === "small",
								},
							)}
							style={{ color: quest.theme?.text }}
						>
							{quest.title}
						</h3>

						{/* 説明文（ホバー時に表示） */}
						<p
							className="mt-2 text-sm opacity-0 transition-all duration-300 group-hover:opacity-90 line-clamp-2"
							style={{ color: quest.theme?.text }}
						>
							{quest.description}
						</p>
					</div>

					{/* フッター情報 */}
					<div className="mt-2 flex items-center justify-between text-sm">
						<div className="font-medium" style={{ color: quest.theme?.text }}>
							{userQuest.progress.percentage}%
						</div>
						<div className="rounded-full bg-[var(--quest-badge)] px-2 py-0.5">
							<span
								className="font-medium"
								style={{ color: quest.theme?.color }}
							>
								{quest.reward_exp} EXP
							</span>
						</div>
					</div>
				</div>
			</Card>
		</Link>
	);
}
