// src/app/_components/task/DecomposedTaskList.tsx
"use client";

import type React from "react";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useAtom, useAtomValue } from "jotai";
import { taskCreationAtom } from "@/store/taskCreation";
import { editingTaskIdAtom, taskUpdateAtom } from "@/store/dialog";
import {
	analyzeTaskAction,
	breakdownTaskAction,
} from "@/app/_actions/tasks/creation";
import type { TaskWithParent } from "@/types/task";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DecomposedTaskTable } from "./DecomposedTaskTable";

import { TaskCardList } from "./TaskCardList";
import { TaskStats } from "./TaskStats";

export function DecomposedTaskList() {
	const [taskCreation, setTaskCreation] = useAtom(taskCreationAtom);
	const [analyzingTaskId, setAnalyzingTaskId] = useState<string | null>(null);
	const [breakingDownTaskId, setBreakingDownTaskId] = useState<string | null>(
		null,
	);
	const updatedTask = useAtomValue(taskUpdateAtom);

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
				estimatedHours > 2 || // 2時間以上かかる
				task.priority === "high"; // 優先度が高い

			return isComplex;
		},
		[getTaskAnalysis],
	);

	const handleAnalyze = useCallback(
		async (task: (typeof taskCreation.decomposedTasks)[0]) => {
			setAnalyzingTaskId(task.title);
			try {
				const taskWithFormattedDeps = {
					...task,
					style: {
						color: task.style?.color ?? undefined,
						icon: task.style?.icon ?? undefined,
					},
					dependencies: task.dependencies?.map((dep) => ({
						task_id: dep.prerequisite_task_title,
						type: dep.dependency_type,
						link_type: dep.link_type,
						id: `${dep.prerequisite_task_title}-${task.title}`,
						lag_time: undefined,
						conditions: undefined,
					})),
				};
				const result = await analyzeTaskAction(taskWithFormattedDeps);
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

	const handleManualBreakdown = useCallback(
		async (task: TaskWithParent) => {
			console.log("=== 手動細分化処理開始 ===");
			console.log("対象タスク:", task);

			setBreakingDownTaskId(task.title);
			try {
				const analysis = getTaskAnalysis(task.title);
				console.log("タスク分析結果:", analysis);

				if (!analysis) {
					console.log("分析結果なし - 分析を実行します");
					await handleAnalyze(task);
					return;
				}

				console.log("細分化リクエストを送信:", {
					task: task,
					analysis: analysis.analysis,
				});

				const result = await breakdownTaskAction({
					...task,
					style: {
						color: task.style?.color ?? undefined,
						icon: task.style?.icon ?? undefined,
					},
					analysis: analysis.analysis,
					dependencies: task.dependencies?.map((dep) => ({
						task_id: dep.prerequisite_task_title,
						type: dep.dependency_type,
						link_type: dep.link_type,
						id: `${dep.prerequisite_task_title}-${task.title}`,
						lag_time: undefined,
						conditions: undefined,
					})),
				});

				console.log("細分化結果:", result);

				if (result.success && result.data) {
					console.log("細分化成功 - 新しいタスク:", result.data);
					setTaskCreation((prev) => {
						const newBreakdowns = [
							...prev.breakdowns.filter((b) => b.taskId !== task.title),
							{ taskId: task.title, items: result.data },
						];
						console.log("更新後のbreakdowns:", newBreakdowns);
						return {
							...prev,
							breakdowns: newBreakdowns,
						};
					});
				}
			} catch (error) {
				console.error("タスク細分化エラー:", error);
			} finally {
				setBreakingDownTaskId(null);
				console.log("=== 手動細分化処理完了 ===");
			}
		},
		[getTaskAnalysis, handleAnalyze, setTaskCreation],
	);

	// 表示するタスクのリストを生成
	const tasksToDisplay = useMemo(() => {
		// 再帰的にタスクを展開する関数
		const expandTask = (
			task: TaskWithParent,
			parentChain: string[] = [],
		): TaskWithParent[] => {
			const breakdown = getTaskBreakdown(task.title);
			console.log("タスク展開処理:", {
				taskTitle: task.title,
				hasBreakdown: !!breakdown,
				breakdownItems: breakdown?.items.length,
				parentChain,
			});

			// 循環参照を防ぐ
			if (parentChain.includes(task.title)) {
				console.warn("循環参照を検出:", task.title);
				return [task];
			}

			// 細分化されたタスクがある場合は、それらを展開
			if (breakdown) {
				const breakdownTasks = breakdown.items.map((item, index, array) => {
					const dependencies =
						index > 0
							? [
									{
										prerequisite_task_title: array[index - 1].title,
										dependency_type: "required" as const,
										link_type: "finish_to_start" as const,
									},
								]
							: [];

					const newTask = {
						...item,
						priority: task.priority,
						parentTask: task.title,
						analysis: getTaskAnalysis(item.title)?.analysis,
						description: item.description || "",
						dependencies,
						tags: [],
						type: "task" as const,
						status: "not_started" as const,
						progress_percentage: 0,
						style: {
							color: item.style?.color || null,
							icon: item.style?.icon || null,
						},
					};

					// 再帰的に展開
					return expandTask(newTask, [...parentChain, task.title]);
				});

				console.log("展開された細分化タスク:", {
					parentTask: task.title,
					breakdownTasks: breakdownTasks.flat().map((t) => t.title),
				});

				return breakdownTasks.flat();
			}

			return [task];
		};

		// すべてのルートタスクを展開
		return taskCreation.decomposedTasks.flatMap((task) =>
			expandTask(task as TaskWithParent),
		);
	}, [taskCreation.decomposedTasks, getTaskBreakdown, getTaskAnalysis]);

	// 細分化後のタスクの自動分析を行う
	useEffect(() => {
		const startAnalysis = async () => {
			if (taskCreation.decomposedTasks.length === 0) return;

			// まだ分析されていない最初のタスクを見つける（細分化されたタスクも含む）
			const nextTask = tasksToDisplay.find(
				(task) =>
					!taskCreation.analyzedTasks.some((a) => a.taskId === task.title),
			);

			if (nextTask && !analyzingTaskId) {
				console.log("新しいタスクの分析開始:", nextTask.title);
				await handleAnalyze(nextTask);
			}
		};

		startAnalysis();
	}, [
		taskCreation.decomposedTasks,
		taskCreation.analyzedTasks,
		analyzingTaskId,
		tasksToDisplay,
		handleAnalyze,
	]);

	// 親タスクを細分化後に非表示にする
	const filteredTasks = useMemo(() => {
		const tasks = tasksToDisplay.filter((task) => {
			// 細分化されたタスクの親タスクを非表示にする
			const isParentTask = taskCreation.breakdowns.some(
				(b) => b.taskId === task.title,
			);
			return !isParentTask || "parentTask" in task;
		});

		console.log("フィルタリング後のタスク:", {
			before: tasksToDisplay.length,
			after: tasks.length,
			tasks: tasks.map((t) => t.title),
		});

		return tasks;
	}, [tasksToDisplay, taskCreation.breakdowns]);

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
				await handleManualBreakdown(nextTask);
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
		handleManualBreakdown,
	]);

	// タスクが更新されたときの処理
	useEffect(() => {
		if (updatedTask) {
			setTaskCreation((prev) => ({
				...prev,
				decomposedTasks: prev.decomposedTasks.map((task) =>
					task.title === updatedTask.title ? updatedTask : task,
				),
			}));
		}
	}, [updatedTask, setTaskCreation]);

	if (taskCreation.decomposedTasks.length === 0) {
		return null;
	}

	return (
		<div className="space-y-4">
			<h3 className="text-lg font-semibold">分解されたタスク</h3>
			<TaskStats tasks={filteredTasks} />
			<Tabs defaultValue="cards" className="w-full">
				<TabsList>
					<TabsTrigger value="cards">カード表示</TabsTrigger>
					<TabsTrigger value="table">テーブル表示</TabsTrigger>
				</TabsList>
				<TabsContent value="cards" className="w-full">
					<TaskCardList
						tasks={filteredTasks}
						analyzingTaskId={analyzingTaskId}
						breakingDownTaskId={breakingDownTaskId}
					/>
				</TabsContent>
				<TabsContent value="table">
					<DecomposedTaskTable tasks={tasksToDisplay} />
				</TabsContent>
			</Tabs>
		</div>
	);
}
