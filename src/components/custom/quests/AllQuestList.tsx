import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { QuestCard } from "./QuestCard";
import type { QuestWithUserQuest } from "@/types/quests";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

interface AllQuestListProps {
	quests: QuestWithUserQuest[];
}

export function AllQuestList({ quests }: AllQuestListProps) {
	// クエストをカテゴリーごとにグループ化
	const questsByType = quests.reduce(
		(acc, quest) => {
			const type = quest.quest.quest_type;
			if (!acc[type]) {
				acc[type] = [];
			}
			acc[type].push(quest);
			return acc;
		},
		{} as Record<string, QuestWithUserQuest[]>,
	);

	// カテゴリー名の日本語マッピング
	const typeNames = {
		TASK_COMPLETION: "タスク達成",
		TIME_MANAGEMENT: "時間管理",
		STREAK: "継続チャレンジ",
		ACHIEVEMENT: "アチーブメント",
	} as const;

	return (
		<section className="space-y-8">
			<h2 className="text-2xl font-bold">すべてのクエスト</h2>
			{Object.entries(questsByType).map(([type, typeQuests]) => (
				<QuestTypeSection
					key={type}
					type={type}
					quests={typeQuests}
					typeName={typeNames[type as keyof typeof typeNames]}
				/>
			))}
		</section>
	);
}

interface QuestTypeSectionProps {
	type: string;
	quests: QuestWithUserQuest[];
	typeName: string;
}

function QuestTypeSection({ type, quests, typeName }: QuestTypeSectionProps) {
	const scrollContainerRef = useRef<HTMLDivElement>(null);

	const scroll = (direction: "left" | "right") => {
		const container = scrollContainerRef.current;
		if (!container) return;

		const scrollAmount = 600; // 2枚分のカード幅
		const targetScroll =
			container.scrollLeft +
			(direction === "left" ? -scrollAmount : scrollAmount);
		container.scrollTo({
			left: targetScroll,
			behavior: "smooth",
		});
	};

	return (
		<div className="space-y-3">
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<h3 className="text-lg font-semibold">{typeName}</h3>
					<span className="rounded-full bg-muted px-2 py-0.5 text-sm text-muted-foreground">
						{quests.length}
					</span>
				</div>
				<div className="flex gap-2">
					<Button
						variant="outline"
						size="icon"
						onClick={() => scroll("left")}
						className="h-8 w-8"
					>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						onClick={() => scroll("right")}
						className="h-8 w-8"
					>
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			</div>
			<ScrollArea>
				<div
					ref={scrollContainerRef}
					className="flex space-x-4 pb-4 overflow-x-hidden"
				>
					{quests.map((quest) => (
						<motion.div
							key={quest.quest.id}
							className="w-[300px] flex-none"
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.3 }}
						>
							<QuestCard quest={quest.quest} userQuest={quest.userQuest} />
						</motion.div>
					))}
				</div>
				<ScrollBar orientation="horizontal" />
			</ScrollArea>
		</div>
	);
}
