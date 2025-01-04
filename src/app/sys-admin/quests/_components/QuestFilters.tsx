"use client";

import type { QuestDifficulty, QuestType } from "@/types/quest";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QuestFiltersProps {
	questTypes: QuestType[];
	difficulties: QuestDifficulty[];
	onFilterChange?: (filters: {
		search?: string;
		questTypeId?: string;
		difficultyId?: string;
		isPartyQuest?: boolean;
		isActive?: boolean;
	}) => void;
}

export function QuestFilters({
	questTypes,
	difficulties,
	onFilterChange,
}: QuestFiltersProps) {
	const handleFilterChange = (key: string, value: string | boolean) => {
		onFilterChange?.({
			search: key === "search" ? (value as string) : undefined,
			questTypeId:
				key === "questTypeId"
					? value === "all"
						? undefined
						: (value as string)
					: undefined,
			difficultyId:
				key === "difficultyId"
					? value === "all"
						? undefined
						: (value as string)
					: undefined,
			isPartyQuest: key === "isPartyQuest" ? (value as boolean) : undefined,
			isActive: key === "isActive" ? (value as boolean) : undefined,
		});
	};

	return (
		<Card className="p-4">
			<div className="space-y-4">
				<div className="relative">
					<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="クエストを検索..."
						className="pl-8"
						onChange={(e) => handleFilterChange("search", e.target.value)}
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-2">
						<Label>クエストタイプ</Label>
						<Select
							onValueChange={(value) =>
								handleFilterChange("questTypeId", value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="すべて" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">すべて</SelectItem>
								{questTypes.map((type) => (
									<SelectItem key={type.id} value={type.id}>
										{type.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="space-y-2">
						<Label>難易度</Label>
						<Select
							onValueChange={(value) =>
								handleFilterChange("difficultyId", value)
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="すべて" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">すべて</SelectItem>
								{difficulties.map((difficulty) => (
									<SelectItem key={difficulty.id} value={difficulty.id}>
										{difficulty.name}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							onCheckedChange={(checked) =>
								handleFilterChange("isPartyQuest", checked)
							}
						/>
						<Label>パーティークエスト</Label>
					</div>

					<div className="flex items-center space-x-2">
						<Switch
							onCheckedChange={(checked) =>
								handleFilterChange("isActive", checked)
							}
						/>
						<Label>有効なクエストのみ</Label>
					</div>
				</div>
			</div>
		</Card>
	);
}
