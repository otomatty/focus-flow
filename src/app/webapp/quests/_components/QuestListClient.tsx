"use client";

import { useState } from "react";
import type { Quest, UserQuest } from "@/types/quests";
import { QuestSearch } from "@/components/custom/quests/QuestSearch";
import { PickupQuestList } from "@/components/custom/quests/PickupQuestList";
import { AllQuestList } from "@/components/custom/quests/AllQuestList";

interface QuestListClientProps {
	quests: {
		quest: Quest;
		userQuest: UserQuest;
	}[];
}

export function QuestListClient({ quests }: QuestListClientProps) {
	const [searchQuery, setSearchQuery] = useState("");

	// ピックアップクエストを抽出（上位8件）
	const pickupQuests = quests
		.filter((q) => q.quest.is_pickup)
		.sort((a, b) => {
			// 進行中のクエストを優先
			if (
				a.userQuest.status === "IN_PROGRESS" &&
				b.userQuest.status !== "IN_PROGRESS"
			)
				return -1;
			if (
				b.userQuest.status === "IN_PROGRESS" &&
				a.userQuest.status !== "IN_PROGRESS"
			)
				return 1;
			// 次に進捗率で並べ替え
			return b.userQuest.progress.percentage - a.userQuest.progress.percentage;
		})
		.slice(0, 8);

	const filteredQuests = quests.filter((q) => {
		const matchesSearch =
			q.quest.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			q.quest.description.toLowerCase().includes(searchQuery.toLowerCase());
		return matchesSearch;
	});

	return (
		<div className="space-y-8">
			<QuestSearch value={searchQuery} onChange={setSearchQuery} />
			<PickupQuestList quests={pickupQuests} />
			<AllQuestList quests={filteredQuests} />
		</div>
	);
}
