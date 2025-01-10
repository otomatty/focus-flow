"use client";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu";
import { Plus, Filter, Calendar } from "lucide-react";
import { useRouter } from "next/navigation";
import type { PriorityLevel } from "../types";

interface FilterBarProps {
	onCategoryChange: (categoryId: string | null) => void;
	onPriorityChange: (priority: PriorityLevel | null) => void;
	selectedCategory: string | null;
	selectedPriority: PriorityLevel | null;
}

export function FilterBar({
	onCategoryChange,
	onPriorityChange,
	selectedCategory,
	selectedPriority,
}: FilterBarProps) {
	const router = useRouter();

	return (
		<div className="flex justify-between items-center mb-4">
			<div className="flex items-center gap-2">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Filter className="h-4 w-4 mr-2" />
							{selectedPriority
								? `優先度: ${getPriorityLabel(selectedPriority)}`
								: "フィルター"}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuRadioGroup
							value={selectedPriority || ""}
							onValueChange={(value) =>
								onPriorityChange(value as PriorityLevel | null)
							}
						>
							<DropdownMenuRadioItem value="">すべて</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="high">
								高優先度
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="medium">
								中優先度
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="low">
								低優先度
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Calendar className="h-4 w-4 mr-2" />
							{selectedCategory
								? getCategoryLabel(selectedCategory)
								: "カテゴリー"}
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuRadioGroup
							value={selectedCategory || ""}
							onValueChange={(value) => onCategoryChange(value || null)}
						>
							<DropdownMenuRadioItem value="">すべて</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="work">仕事</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="personal">
								個人
							</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="habit">習慣</DropdownMenuRadioItem>
							<DropdownMenuRadioItem value="other">
								その他
							</DropdownMenuRadioItem>
						</DropdownMenuRadioGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>

			<Button size="sm" onClick={() => router.push("/webapp/schedules/new")}>
				<Plus className="h-4 w-4 mr-2" />
				新規作成
			</Button>
		</div>
	);
}

function getPriorityLabel(priority: PriorityLevel): string {
	const labels: Record<PriorityLevel, string> = {
		high: "高",
		medium: "中",
		low: "低",
	};
	return labels[priority];
}

function getCategoryLabel(categoryId: string): string {
	const labels: Record<string, string> = {
		work: "仕事",
		personal: "個人",
		habit: "習慣",
		other: "その他",
	};
	return labels[categoryId] || categoryId;
}
