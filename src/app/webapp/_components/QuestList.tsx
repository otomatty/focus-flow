import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Quest, QuestRarity } from "@/types/dashboard";
import { Target, MoreVertical, Info, Trash } from "lucide-react";
import { useState } from "react";
import { QuestDetailDialog } from "./QuestDetailDialog";

interface QuestListProps {
	quests: Quest[];
}

const getRarityColor = (rarity: QuestRarity) => {
	switch (rarity) {
		case "common":
			return "text-gray-500 dark:text-gray-400";
		case "rare":
			return "text-blue-500 dark:text-blue-400";
		case "epic":
			return "text-purple-500 dark:text-purple-400";
		case "legendary":
			return "text-orange-500 dark:text-orange-400";
	}
};

const getRarityBadgeColor = (rarity: QuestRarity) => {
	switch (rarity) {
		case "common":
			return "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300";
		case "rare":
			return "bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300";
		case "epic":
			return "bg-purple-100 dark:bg-purple-900/50 text-purple-700 dark:text-purple-300";
		case "legendary":
			return "bg-orange-100 dark:bg-orange-900/50 text-orange-700 dark:text-orange-300";
	}
};

const getRarityLabel = (rarity: QuestRarity) => {
	switch (rarity) {
		case "common":
			return "ノーマル";
		case "rare":
			return "レア";
		case "epic":
			return "エピック";
		case "legendary":
			return "レジェンド";
	}
};

function QuestItem({ quest }: { quest: Quest }) {
	const [showDetails, setShowDetails] = useState(false);

	return (
		<div className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800">
			<div className="space-y-3">
				<div className="flex items-start justify-between gap-4">
					<div className="flex-1 space-y-1">
						<div className="flex items-center gap-2">
							<h3 className={`font-semibold ${getRarityColor(quest.rarity)}`}>
								{quest.title}
							</h3>
							<Badge
								variant="secondary"
								className={getRarityBadgeColor(quest.rarity)}
							>
								{getRarityLabel(quest.rarity)}
							</Badge>
						</div>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							{quest.description}
						</p>
						<div className="flex items-center gap-2 text-sm">
							<Progress
								value={(quest.progress / quest.maxProgress) * 100}
								className="flex-1"
							/>
							<span className="text-gray-500 dark:text-gray-400">
								{quest.progress}/{quest.maxProgress}
							</span>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<div className="flex items-center gap-1 text-yellow-500 dark:text-yellow-400">
							<span className="text-lg">✨</span>
							<span className="font-semibold">{quest.reward}</span>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="ghost" size="sm" className="h-8 w-8 p-0">
									<MoreVertical className="h-4 w-4" />
									<span className="sr-only">クエストの操作メニューを開く</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem onClick={() => setShowDetails(true)}>
									<Info className="mr-2 h-4 w-4" />
									<span>詳細を表示</span>
								</DropdownMenuItem>
								<DropdownMenuItem className="text-red-600 dark:text-red-400">
									<Trash className="mr-2 h-4 w-4" />
									<span>放棄</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</div>
			</div>
			<QuestDetailDialog
				quest={quest}
				open={showDetails}
				onOpenChange={setShowDetails}
			/>
		</div>
	);
}

export function QuestList({ quests }: QuestListProps) {
	return (
		<div className="space-y-4">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
					クエスト
				</h2>
				<Button variant="outline" size="sm">
					すべて見る
				</Button>
			</div>
			<div className="grid gap-4">
				{quests.map((quest) => (
					<motion.div
						key={quest.id}
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<QuestItem quest={quest} />
					</motion.div>
				))}
			</div>
		</div>
	);
}
