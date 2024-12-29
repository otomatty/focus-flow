// src/app/_components/task/TaskAnalysisProgress.tsx
"use client";

import { useAtom } from "jotai";
import { taskCreationAtom } from "@/store/taskCreation";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

type Props = {
	analyzingTaskId: string | null;
	breakingDownTaskId: string | null;
};

export function TaskAnalysisProgress({
	analyzingTaskId,
	breakingDownTaskId,
}: Props) {
	const [taskCreation] = useAtom(taskCreationAtom);

	// 分析済みのタスク数を計算
	const analyzedTasksCount = taskCreation.analyzedTasks.length;

	// 現在処理中のタスク数を計算
	const processingTasksCount =
		(analyzingTaskId ? 1 : 0) + (breakingDownTaskId ? 1 : 0);

	// Geminiへのリクエスト数を計算（分析と細分化の合計）
	const totalGeminiRequests =
		analyzedTasksCount + taskCreation.breakdowns.length;

	return (
		<Card>
			<CardContent className="pt-6">
				<div className="grid gap-4 text-sm">
					<div className="flex justify-between items-center">
						<span>処理中のタスク:</span>
						<div className="flex items-center">
							<span className="font-semibold mr-2">{processingTasksCount}</span>
							{processingTasksCount > 0 && (
								<Loader2 className="h-4 w-4 animate-spin" />
							)}
						</div>
					</div>
					<div className="flex justify-between items-center">
						<span>分析済みタスク:</span>
						<span className="font-semibold">{analyzedTasksCount}</span>
					</div>
					<div className="flex justify-between items-center">
						<span>Geminiリクエスト数:</span>
						<span className="font-semibold">{totalGeminiRequests}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
