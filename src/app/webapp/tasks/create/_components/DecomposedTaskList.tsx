// src/app/_components/task/DecomposedTaskList.tsx
"use client";

import { useAtom } from "jotai";
import { taskCreationAtom } from "@/store/taskCreation";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, RefreshCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
	analyzeTaskAction,
	breakdownTaskAction,
} from "@/app/_actions/tasks/creation";
import { useState, useEffect, useCallback, useMemo } from "react";

export function DecomposedTaskList() {
	const [taskCreation, setTaskCreation] = useAtom(taskCreationAtom);
	const [analyzingTaskId, setAnalyzingTaskId] = useState<string | null>(null);
	const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(
		null,
	);

	const getTaskAnalysis = useCallback(
		(taskTitle: string) => {
			return taskCreation.analyzedTasks.find(
				(analysis) => analysis.taskId === taskTitle,
			);
		},
		[taskCreation.analyzedTasks],
	);

	const getTaskBreakdown = useCallback(
		(taskTitle: string) => {
			return taskCreation.breakdowns.find(
				(breakdown) => breakdown.taskId === taskTitle,
			);
		},
		[taskCreation.breakdowns],
	);

	const needsBreakdown = useCallback(
		(task: (typeof taskCreation.decomposedTasks)[0]) => {
			const analysis = getTaskAnalysis(task.title);
			if (!analysis) return null;

			// 以下の条件で細分化が必要かを判断
			const estimatedHours = Number.parseInt(
				task.estimated_duration?.match(/PT(\d+)H/)?.[1] || "0",
			);
			const isComplex =
				(task.description?.length ?? 0) > 200 || // 説明が長い
				estimatedHours > 4 || // 4時間以上かかる
				task.priority === "high"; // 優先度が高い

			return isComplex;
		},
		[getTaskAnalysis],
	);

	const handleAnalyze = useCallback(
		async (task: (typeof taskCreation.decomposedTasks)[0]) => {
			setAnalyzingTaskId(task.title);
			try {
				const result = await analyzeTaskAction(task);
				if (result.success && result.data) {
					setTaskCreation((prev) => ({
						...prev,
						analyzedTasks: [
							...prev.analyzedTasks.filter((t) => t.taskId !== task.title),
							{ taskId: task.title, analysis: result.data },
						],
					}));
				}
			} catch (error) {
				console.error("タスク分析エラー:", error);
			} finally {
				setAnalyzingTaskId(null);
			}
		},
		[setTaskCreation],
	);

	const handleBreakdown = useCallback(
		async (task: (typeof taskCreation.decomposedTasks)[0]) => {
			setBreakingDownTaskId(task.title);
			try {
				const analysis = getTaskAnalysis(task.title);
				if (!analysis) return;

				const result = await breakdownTaskAction({
					...task,
					...analysis.analysis,
				});

				if (result.success && result.data) {
					setTaskCreation((prev) => ({
						...prev,
						breakdowns: [
							...prev.breakdowns.filter((b) => b.taskId !== task.title),
							{ taskId: task.title, items: result.data },
						],
					}));
				}
			} catch (error) {
				console.error("タスク細分化エラー:", error);
			} finally {
				setBreakingDownTaskId(null);
			}
		},
		[getTaskAnalysis, setTaskCreation],
	);

	type TaskWithParent = (typeof taskCreation.decomposedTasks)[0] & {
		parentTask?: string;
		analysis?: (typeof taskCreation.analyzedTasks)[0]["analysis"];
	};

	// 表示するタスクのリストを生成
	const tasksToDisplay = useMemo(
		() =>
			taskCreation.decomposedTasks.flatMap((task) => {
				const breakdown = getTaskBreakdown(task.title);
				// 細分化されたタスクがある場合は、それらを表示
				if (breakdown) {
					return breakdown.items.map((item) => ({
						...item,
						type: task.type,
						priority: task.priority,
						parentTask: task.title,
						analysis: getTaskAnalysis(task.title)?.analysis,
					}));
				}
				// 細分化されていないタスクは、そのまま表示
				return [task];
			}) as TaskWithParent[],
		[taskCreation.decomposedTasks, getTaskBreakdown, getTaskAnalysis],
	);

	useEffect(() => {
		const startAnalysis = async () => {
			if (taskCreation.decomposedTasks.length === 0) return;

			// まだ分析されていない最初のタスクを見つける（細分化されたタスクも含む）
			const nextTask = tasksToDisplay.find(
				(task) =>
					!taskCreation.analyzedTasks.some((a) => a.taskId === task.title),
			);

			if (nextTask && !analyzingTaskId) {
				await handleAnalyze(nextTask);
			}
		};

		startAnalysis();
	}, [
		taskCreation.decomposedTasks.length,
		taskCreation.analyzedTasks,
		analyzingTaskId,
		tasksToDisplay,
		handleAnalyze,
	]);

	useEffect(() => {
		const startBreakdown = async () => {
			// 分析済みで、細分化が必要で、まだ細分化されていないタスクを見つける
			const nextTask = tasksToDisplay.find((task) => {
				if ("parentTask" in task) return false; // 既に細分化されたタスクはスキップ
				const analysis = getTaskAnalysis(task.title);
				const requiresBreakdown = analysis && needsBreakdown(task);
				const notBrokenDown = !taskCreation.breakdowns.some(
					(b) => b.taskId === task.title,
				);
				return requiresBreakdown && notBrokenDown;
			});

			if (nextTask && !breakingDownTaskId && !analyzingTaskId) {
				await handleBreakdown(nextTask);
			}
		};

		startBreakdown();
	}, [
		taskCreation.breakdowns,
		analyzingTaskId,
		breakingDownTaskId,
		tasksToDisplay,
		getTaskAnalysis,
		needsBreakdown,
		handleBreakdown,
	]);

	if (taskCreation.decomposedTasks.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">分解されたタスク</h3>
			<div className="grid gap-4 md:grid-cols-2">
				{tasksToDisplay.map((task) => {
					const isBreakdownTask = "parentTask" in task;
					const taskAnalysis = getTaskAnalysis(task.title);
					const analysis = isBreakdownTask
						? task.analysis
						: taskAnalysis?.analysis;
					const requiresBreakdown = !isBreakdownTask && needsBreakdown(task);

					return (
						<Card
							key={`${task.title}-${task.estimated_duration}`}
							className="relative"
						>
							<CardHeader>
								<div className="flex items-start justify-between">
									<div className="flex-1">
										<CardTitle className="text-base">
											{task.title}
											{isBreakdownTask && (
												<Badge variant="secondary" className="ml-2">
													{task.parentTask}
												</Badge>
											)}
										</CardTitle>
										<CardDescription>{task.description}</CardDescription>
									</div>
									{taskAnalysis ? (
										requiresBreakdown ? (
											breakingDownTaskId === task.title ? (
												<Loader2 className="h-5 w-5 animate-spin text-yellow-500" />
											) : (
												<RefreshCcw className="h-5 w-5 text-yellow-500" />
											)
										) : (
											<CheckCircle2 className="h-5 w-5 text-green-500" />
										)
									) : (
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleAnalyze(task)}
											disabled={analyzingTaskId === task.title}
										>
											{analyzingTaskId === task.title ? (
												<>
													<Loader2 className="mr-2 h-4 w-4 animate-spin" />
													分析中...
												</>
											) : (
												"分析"
											)}
										</Button>
									)}
								</div>
							</CardHeader>
							<CardContent>
								<div className="flex flex-wrap gap-2">
									<Badge variant="outline">{task.priority}</Badge>
									{task.estimated_duration && (
										<Badge variant="outline">{task.estimated_duration}</Badge>
									)}
									{analysis?.category && <Badge>{analysis.category}</Badge>}
								</div>
							</CardContent>
						</Card>
					);
				})}
			</div>
		</div>
	);
}
