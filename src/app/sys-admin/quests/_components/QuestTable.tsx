"use client";

import { useState, useMemo } from "react";
import type {
	QuestDifficulty,
	QuestType,
	QuestWithDetails,
} from "@/types/quest";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Edit2,
	Trash2,
	ArrowUpDown,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";
import { QuestDialog } from "./QuestDialog";
import { useToast } from "@/hooks/use-toast";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ITEMS_PER_PAGE = 10;

type SortConfig = {
	key: keyof QuestWithDetails;
	direction: "asc" | "desc";
} | null;

interface QuestTableProps {
	quests: QuestWithDetails[];
	questTypes: QuestType[];
	difficulties: QuestDifficulty[];
	onUpdated: (quest: QuestWithDetails) => void;
	onDeleted: (questId: string) => void;
}

export function QuestTable({
	quests,
	questTypes,
	difficulties,
	onUpdated,
	onDeleted,
}: QuestTableProps) {
	const { toast } = useToast();
	const [sortConfig, setSortConfig] = useState<SortConfig>(null);
	const [currentPage, setCurrentPage] = useState(1);
	const [selectedQuests, setSelectedQuests] = useState<Set<string>>(new Set());

	const sortedQuests = useMemo(() => {
		if (!sortConfig) return quests;

		return [...quests].sort((a, b) => {
			const aValue = a[sortConfig.key];
			const bValue = b[sortConfig.key];

			if (aValue === undefined || bValue === undefined) return 0;

			if (aValue < bValue) {
				return sortConfig.direction === "asc" ? -1 : 1;
			}
			if (aValue > bValue) {
				return sortConfig.direction === "asc" ? 1 : -1;
			}
			return 0;
		});
	}, [quests, sortConfig]);

	const paginatedQuests = useMemo(() => {
		const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
		return sortedQuests.slice(startIndex, startIndex + ITEMS_PER_PAGE);
	}, [sortedQuests, currentPage]);

	const totalPages = Math.ceil(sortedQuests.length / ITEMS_PER_PAGE);

	const handlePageChange = (page: number) => {
		setCurrentPage(page);
	};

	const handleSort = (key: keyof QuestWithDetails) => {
		setSortConfig((current) => {
			if (current?.key === key) {
				if (current.direction === "asc") {
					return { key, direction: "desc" };
				}
				return null;
			}
			return { key, direction: "asc" };
		});
	};

	const handleToggleActive = async (id: string, isActive: boolean) => {
		try {
			const response = await fetch(`/api/quests/${id}/toggle-active`, {
				method: "PUT",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isActive }),
			});

			if (!response.ok) {
				throw new Error("APIエラーが発生しました");
			}

			const data = await response.json();
			onUpdated(data);
			toast({
				title: "クエストの状態を更新しました",
				description: `クエストを${isActive ? "有効" : "無効"}にしました。`,
			});
		} catch (error) {
			toast({
				title: "エラーが発生しました",
				description: "クエストの状態を更新できませんでした。",
				variant: "destructive",
			});
		}
	};

	const handleDelete = async (id: string) => {
		try {
			const response = await fetch(`/api/quests/${id}`, {
				method: "DELETE",
			});

			if (!response.ok) {
				throw new Error("APIエラーが発生しました");
			}

			onDeleted(id);
			toast({
				title: "クエストを削除しました",
				description: "クエストの削除が完了しました。",
			});
		} catch (error) {
			toast({
				title: "エラーが発生しました",
				description: "クエストを削除できませんでした。",
				variant: "destructive",
			});
		}
	};

	const handleSelectAll = (checked: boolean) => {
		if (checked) {
			setSelectedQuests(new Set(paginatedQuests.map((quest) => quest.id)));
		} else {
			setSelectedQuests(new Set());
		}
	};

	const handleSelectQuest = (
		questId: string,
		checked: boolean | "indeterminate",
	) => {
		const newSelected = new Set(selectedQuests);
		if (checked === true) {
			newSelected.add(questId);
		} else {
			newSelected.delete(questId);
		}
		setSelectedQuests(newSelected);
	};

	const handleBulkAction = async (
		action: "activate" | "deactivate" | "delete",
	) => {
		try {
			const selectedQuestIds = Array.from(selectedQuests);

			if (action === "delete") {
				await Promise.all(
					selectedQuestIds.map((id) =>
						fetch(`/api/quests/${id}`, {
							method: "DELETE",
						}),
					),
				);
				for (const id of selectedQuestIds) {
					onDeleted(id);
				}
				toast({
					title: "クエストを一括削除しました",
					description: `${selectedQuestIds.length}件のクエストを削除しました。`,
				});
			} else {
				await Promise.all(
					selectedQuestIds.map((id) =>
						fetch(`/api/quests/${id}/toggle-active`, {
							method: "PUT",
							headers: {
								"Content-Type": "application/json",
							},
							body: JSON.stringify({ isActive: action === "activate" }),
						}),
					),
				);
				const updatedQuests = quests.map((quest) => {
					if (selectedQuestIds.includes(quest.id)) {
						return { ...quest, isActive: action === "activate" };
					}
					return quest;
				});
				for (const quest of updatedQuests) {
					if (selectedQuestIds.includes(quest.id)) {
						onUpdated(quest);
					}
				}
				toast({
					title: `クエストを一括${action === "activate" ? "有効" : "無効"}化しました`,
					description: `${selectedQuestIds.length}件のクエストを${
						action === "activate" ? "有効" : "無効"
					}化しました。`,
				});
			}
			setSelectedQuests(new Set());
		} catch (error) {
			toast({
				title: "エラーが発生しました",
				description: "一括操作に失敗しました。",
				variant: "destructive",
			});
		}
	};

	return (
		<div className="rounded-md border">
			{selectedQuests.size > 0 && (
				<div className="flex items-center justify-between p-4 border-b">
					<p className="text-sm text-muted-foreground">
						{selectedQuests.size}件のクエストを選択中
					</p>
					<div className="flex items-center space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleBulkAction("activate")}
						>
							一括有効化
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleBulkAction("deactivate")}
						>
							一括無効化
						</Button>
						<AlertDialog>
							<AlertDialogTrigger asChild>
								<Button variant="destructive" size="sm">
									一括削除
								</Button>
							</AlertDialogTrigger>
							<AlertDialogContent>
								<AlertDialogHeader>
									<AlertDialogTitle>クエストの一括削除</AlertDialogTitle>
									<AlertDialogDescription>
										選択した{selectedQuests.size}
										件のクエストを削除してもよろしいですか？
										この操作は取り消せません。
									</AlertDialogDescription>
								</AlertDialogHeader>
								<AlertDialogFooter>
									<AlertDialogCancel>キャンセル</AlertDialogCancel>
									<AlertDialogAction
										onClick={() => handleBulkAction("delete")}
										className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
									>
										削除
									</AlertDialogAction>
								</AlertDialogFooter>
							</AlertDialogContent>
						</AlertDialog>
					</div>
				</div>
			)}
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead className="w-12">
							<Checkbox
								checked={
									paginatedQuests.length > 0 &&
									paginatedQuests.every((quest) => selectedQuests.has(quest.id))
								}
								onCheckedChange={handleSelectAll}
								aria-label="全て選択"
							/>
						</TableHead>
						<TableHead>
							<Button
								variant="ghost"
								onClick={() => handleSort("title")}
								className="h-8 text-left font-medium"
							>
								タイトル
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</TableHead>
						<TableHead>
							<Button
								variant="ghost"
								onClick={() => handleSort("questTypeId")}
								className="h-8 text-left font-medium"
							>
								タイプ
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</TableHead>
						<TableHead>
							<Button
								variant="ghost"
								onClick={() => handleSort("difficultyId")}
								className="h-8 text-left font-medium"
							>
								難易度
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</TableHead>
						<TableHead>
							<Button
								variant="ghost"
								onClick={() => handleSort("durationType")}
								className="h-8 text-left font-medium"
							>
								期間
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</TableHead>
						<TableHead>
							<Button
								variant="ghost"
								onClick={() => handleSort("baseRewardExp")}
								className="h-8 text-left font-medium"
							>
								経験値
								<ArrowUpDown className="ml-2 h-4 w-4" />
							</Button>
						</TableHead>
						<TableHead>状態</TableHead>
						<TableHead className="text-right">操作</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{paginatedQuests.map((quest) => (
						<TableRow key={quest.id}>
							<TableCell>
								<Checkbox
									checked={selectedQuests.has(quest.id)}
									onCheckedChange={(checked) =>
										handleSelectQuest(quest.id, checked)
									}
									aria-label={`${quest.title}を選択`}
								/>
							</TableCell>
							<TableCell className="font-medium">
								{quest.title}
								{quest.isPartyQuest && (
									<Badge variant="secondary" className="ml-2">
										パーティー
									</Badge>
								)}
							</TableCell>
							<TableCell>{quest.questType.name}</TableCell>
							<TableCell>{quest.difficulty.name}</TableCell>
							<TableCell>
								{quest.durationType === "daily" && "デイリー"}
								{quest.durationType === "weekly" && "ウィークリー"}
								{quest.durationType === "monthly" && "マンスリー"}
							</TableCell>
							<TableCell>
								{quest.baseRewardExp * quest.difficulty.expMultiplier}
							</TableCell>
							<TableCell>
								<Switch
									checked={quest.isActive}
									onCheckedChange={(checked) =>
										handleToggleActive(quest.id, checked)
									}
								/>
							</TableCell>
							<TableCell className="text-right">
								<div className="flex justify-end space-x-2">
									<QuestDialog
										trigger={
											<Button variant="ghost" size="icon">
												<Edit2 className="h-4 w-4" />
											</Button>
										}
										questTypes={questTypes}
										difficulties={difficulties}
										quest={quest}
										onUpdated={onUpdated}
									/>
									<AlertDialog>
										<AlertDialogTrigger asChild>
											<Button variant="ghost" size="icon">
												<Trash2 className="h-4 w-4" />
											</Button>
										</AlertDialogTrigger>
										<AlertDialogContent>
											<AlertDialogHeader>
												<AlertDialogTitle>クエストの削除</AlertDialogTitle>
												<AlertDialogDescription>
													このクエストを削除してもよろしいですか？
													この操作は取り消せません。
												</AlertDialogDescription>
											</AlertDialogHeader>
											<AlertDialogFooter>
												<AlertDialogCancel>キャンセル</AlertDialogCancel>
												<AlertDialogAction
													onClick={() => handleDelete(quest.id)}
													className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
												>
													削除
												</AlertDialogAction>
											</AlertDialogFooter>
										</AlertDialogContent>
									</AlertDialog>
								</div>
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
			{totalPages > 1 && (
				<div className="flex items-center justify-end space-x-2 py-4 px-4 border-t">
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage - 1)}
						disabled={currentPage === 1}
					>
						<ChevronLeft className="h-4 w-4" />
						前へ
					</Button>
					<div className="flex items-center gap-1">
						{Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
							<Button
								key={page}
								variant={currentPage === page ? "default" : "outline"}
								size="sm"
								onClick={() => handlePageChange(page)}
							>
								{page}
							</Button>
						))}
					</div>
					<Button
						variant="outline"
						size="sm"
						onClick={() => handlePageChange(currentPage + 1)}
						disabled={currentPage === totalPages}
					>
						次へ
						<ChevronRight className="h-4 w-4" />
					</Button>
				</div>
			)}
		</div>
	);
}
