import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { PickupQuestCard } from "./PickupQuestCard";
import type { QuestWithUserQuest } from "@/types/quests";

interface PickupQuestListProps {
	quests: QuestWithUserQuest[];
}

export function PickupQuestList({ quests }: PickupQuestListProps) {
	// ピックアップ対象のクエストのみをフィルタリング
	const pickupQuests = quests.filter((q) => q.quest.is_pickup).slice(0, 8);

	if (pickupQuests.length === 0) return null;
	// Bentoレイアウトの定義
	const bentoLayout = [
		// 上段セクション
		{ colSpan: 6, rowSpan: 2, colStart: 1, rowStart: 1, size: "large" }, // メインカード（左上大）
		{ colSpan: 3, rowSpan: 2, colStart: 7, rowStart: 1, size: "medium" }, // 右上中カード
		{ colSpan: 3, rowSpan: 2, colStart: 10, rowStart: 1, size: "medium" }, // 右上中カード

		// 中段セクション
		{ colSpan: 4, rowSpan: 2, colStart: 1, rowStart: 3, size: "medium" }, // 左中カード
		{ colSpan: 5, rowSpan: 2, colStart: 5, rowStart: 3, size: "medium" }, // 中央カード
		{ colSpan: 3, rowSpan: 2, colStart: 10, rowStart: 3, size: "small" }, // 右中小カード

		// 下段セクション
		{ colSpan: 6, rowSpan: 2, colStart: 1, rowStart: 5, size: "medium" }, // 左下大カード
		{ colSpan: 6, rowSpan: 2, colStart: 7, rowStart: 5, size: "medium" }, // 右下大カード
	] as const;

	return (
		<section className="space-y-6">
			<h2 className="text-2xl font-bold">ピックアップクエスト</h2>
			<div className="grid grid-cols-12 gap-4 min-h-[480px]">
				{pickupQuests.map(({ quest, userQuest }, index) => {
					const layout = bentoLayout[index];
					return (
						<motion.div
							key={quest.id}
							className={cn(
								`col-span-${layout.colSpan}`,
								`row-span-${layout.rowSpan}`,
								`col-start-${layout.colStart}`,
								`row-start-${layout.rowStart}`,
								"transition-transform duration-300 hover:scale-[1.02]",
								{
									"min-h-[180px]": layout.size === "large",
									"min-h-[160px]": layout.size === "medium",
									"min-h-[140px]": layout.size === "small",
								},
							)}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
						>
							<PickupQuestCard
								quest={quest}
								userQuest={userQuest}
								size={layout.size}
							/>
						</motion.div>
					);
				})}
			</div>
		</section>
	);
}
