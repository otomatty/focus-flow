"use client";

import { useState, useCallback, useMemo } from "react";
import type {
	QuestDifficulty,
	QuestType,
	QuestWithDetails,
} from "@/types/quest";
import { QuestTable } from "./QuestTable";
import { QuestFilters } from "./QuestFilters";
import { QuestDialog } from "./QuestDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface QuestListProps {
	initialQuests: QuestWithDetails[];
	questTypes: QuestType[];
	difficulties: QuestDifficulty[];
}

export function QuestList({
	initialQuests,
	questTypes,
	difficulties,
}: QuestListProps) {
	const [quests, setQuests] = useState(initialQuests);
	const [filters, setFilters] = useState<{
		search?: string;
		questTypeId?: string;
		difficultyId?: string;
		isPartyQuest?: boolean;
		isActive?: boolean;
	}>({});

	const filteredQuests = useMemo(() => {
		return quests.filter((quest) => {
			// 検索フィルター
			if (filters.search) {
				const searchLower = filters.search.toLowerCase();
				const matchesSearch =
					quest.title.toLowerCase().includes(searchLower) ||
					quest.description.toLowerCase().includes(searchLower) ||
					quest.questType.name.toLowerCase().includes(searchLower) ||
					quest.difficulty.name.toLowerCase().includes(searchLower);
				if (!matchesSearch) return false;
			}

			// その他のフィルター
			if (filters.questTypeId && quest.questTypeId !== filters.questTypeId)
				return false;
			if (filters.difficultyId && quest.difficultyId !== filters.difficultyId)
				return false;
			if (
				filters.isPartyQuest !== undefined &&
				quest.isPartyQuest !== filters.isPartyQuest
			)
				return false;
			if (filters.isActive !== undefined && quest.isActive !== filters.isActive)
				return false;
			return true;
		});
	}, [quests, filters]);

	const handleQuestCreated = (newQuest: QuestWithDetails) => {
		setQuests((prev) => [newQuest, ...prev]);
	};

	const handleQuestUpdated = (updatedQuest: QuestWithDetails) => {
		setQuests((prev) =>
			prev.map((quest) =>
				quest.id === updatedQuest.id ? updatedQuest : quest,
			),
		);
	};

	const handleQuestDeleted = (questId: string) => {
		setQuests((prev) => prev.filter((quest) => quest.id !== questId));
	};

	const handleFilterChange = useCallback((newFilters: typeof filters) => {
		setFilters(newFilters);
	}, []);

	return (
		<div className="space-y-4 p-8">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-bold">クエスト管理</h1>
				<QuestDialog
					trigger={
						<Button>
							<Plus className="mr-2 h-4 w-4" />
							新規クエスト
						</Button>
					}
					questTypes={questTypes}
					difficulties={difficulties}
					onCreated={handleQuestCreated}
				/>
			</div>

			<QuestFilters
				questTypes={questTypes}
				difficulties={difficulties}
				onFilterChange={handleFilterChange}
			/>

			<QuestTable
				quests={filteredQuests}
				questTypes={questTypes}
				difficulties={difficulties}
				onUpdated={handleQuestUpdated}
				onDeleted={handleQuestDeleted}
			/>
		</div>
	);
}
