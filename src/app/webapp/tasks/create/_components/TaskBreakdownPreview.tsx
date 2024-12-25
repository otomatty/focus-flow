"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import type { AIAnalysis, TaskBreakdown } from "@/lib/gemini/task-analyzer";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";

interface TaskBreakdownPreviewProps {
	analysis: AIAnalysis | null;
	isLoading: boolean;
}

export function TaskBreakdownPreview({
	analysis,
	isLoading,
}: TaskBreakdownPreviewProps) {
	const [selectedBreakdown, setSelectedBreakdown] =
		useState<TaskBreakdown | null>(null);
	const [showSummary, setShowSummary] = useState(true);

	if (!analysis && !isLoading) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle>AIによるタスク分析</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<div className="space-y-4">
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
						<Skeleton className="h-12 w-full" />
					</div>
				) : analysis ? (
					<div className="space-y-6">
						<div className="border rounded-lg">
							<button
								type="button"
								className="p-4 w-full flex items-center justify-between cursor-pointer hover:bg-muted/50"
								onClick={() => setShowSummary(!showSummary)}
							>
								<h4 className="font-medium">推奨設定の概要</h4>
								{showSummary ? (
									<ChevronUp className="h-4 w-4" />
								) : (
									<ChevronDown className="h-4 w-4" />
								)}
							</button>
							{showSummary && (
								<div className="p-4 border-t bg-muted/10">
									<div className="grid grid-cols-2 gap-2 text-sm">
										<div>優先度: {analysis.suggestedPriority}</div>
										<div>カテゴリー: {analysis.suggestedCategory}</div>
										<div>
											推奨期限:{" "}
											{new Date(analysis.suggestedDueDate).toLocaleString()}
										</div>
										<div>予定時間: {analysis.totalEstimatedDuration}</div>
										<div>合計経験値: {analysis.totalExperiencePoints} XP</div>
									</div>
									<div className="mt-4">
										<h5 className="text-sm font-medium mb-2">スキル分布</h5>
										<div className="grid grid-cols-2 gap-2 text-sm">
											{Object.entries(analysis.skillDistribution).map(
												([skill, percentage]) => (
													<div key={skill}>
														{skill}: {percentage}%
													</div>
												),
											)}
										</div>
									</div>
								</div>
							)}
						</div>

						<div>
							<h4 className="font-medium mb-4">タスクの分解</h4>
							<div className="rounded-md border">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead className="w-12">#</TableHead>
											<TableHead>サブタスク</TableHead>
											<TableHead>予定時間</TableHead>
											<TableHead>経験値</TableHead>
											<TableHead className="w-[100px]" />
										</TableRow>
									</TableHeader>
									<TableBody>
										{analysis.breakdowns.map((breakdown) => (
											<TableRow
												key={breakdown.orderIndex}
												onClick={() => setSelectedBreakdown(breakdown)}
											>
												<TableCell>
													<button
														type="button"
														className="w-full text-left hover:bg-muted/50"
														onClick={() => setSelectedBreakdown(breakdown)}
													>
														<div className="flex items-center space-x-2">
															<span>{breakdown.orderIndex}</span>
															<div>
																<div className="font-medium">
																	{breakdown.title}
																</div>
																{breakdown.description && (
																	<div className="text-sm text-muted-foreground">
																		{breakdown.description}
																	</div>
																)}
															</div>
														</div>
													</button>
												</TableCell>
												<TableCell>{breakdown.estimatedDuration}</TableCell>
												<TableCell>+{breakdown.experiencePoints} XP</TableCell>
												<TableCell className="text-right">
													<div className="text-sm text-muted-foreground">
														{breakdown.skillCategory}
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</div>
						</div>
					</div>
				) : null}
			</CardContent>

			<ResponsiveDialog
				open={selectedBreakdown !== null}
				onOpenChange={(open) => !open && setSelectedBreakdown(null)}
				title="サブタスクの詳細"
				description="このサブタスクの詳細を確認・編集できます"
				trigger={<div />}
			>
				{selectedBreakdown && (
					<div className="space-y-4 p-4">
						<div>
							<h4 className="font-medium text-sm">タイトル</h4>
							<p>{selectedBreakdown.title}</p>
						</div>
						{selectedBreakdown.description && (
							<div>
								<h4 className="font-medium text-sm">説明</h4>
								<p className="text-muted-foreground">
									{selectedBreakdown.description}
								</p>
							</div>
						)}
						<div className="grid grid-cols-2 gap-4">
							<div>
								<h4 className="font-medium text-sm">予定時間</h4>
								<p>{selectedBreakdown.estimatedDuration}</p>
							</div>
							<div>
								<h4 className="font-medium text-sm">経験値</h4>
								<p>+{selectedBreakdown.experiencePoints} XP</p>
							</div>
							<div>
								<h4 className="font-medium text-sm">スキルカテゴリー</h4>
								<p>{selectedBreakdown.skillCategory}</p>
							</div>
							<div>
								<h4 className="font-medium text-sm">順序</h4>
								<p>#{selectedBreakdown.orderIndex}</p>
							</div>
						</div>
					</div>
				)}
			</ResponsiveDialog>
		</Card>
	);
}
