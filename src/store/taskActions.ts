import { atom } from "jotai";
import type { TaskWithParent, AIAnalysis } from "@/types/task";
import {
	analyzeTaskAction,
	breakdownTaskAction,
} from "@/app/_actions/tasks/creation";
import { taskCreationAtom } from "./taskCreation";

export const analyzeTaskAtom = atom(
	null,
	async (get, set, task: TaskWithParent) => {
		try {
			const taskWithFormattedDeps = {
				...task,
				dependencies: task.dependencies?.map((dep) => ({
					task_id: dep.prerequisite_task_title,
					type: dep.dependency_type,
					link_type: dep.link_type,
					id: `${dep.prerequisite_task_title}-${task.title}`,
					lag_time: undefined,
					conditions: undefined,
				})),
				style: {
					color: task.style?.color ?? undefined,
					icon: task.style?.icon ?? undefined,
				},
			};
			const result = await analyzeTaskAction(taskWithFormattedDeps);
			if (result.success && result.data) {
				set(taskCreationAtom, (prev) => ({
					...prev,
					analyzedTasks: [
						...prev.analyzedTasks.filter((t) => t.taskId !== task.title),
						{ taskId: task.title, analysis: result.data },
					],
				}));
			}
			return result;
		} catch (error) {
			console.error("タスク分析エラー:", error);
			throw error;
		}
	},
);

export const breakdownTaskAtom = atom(
	null,
	async (get, set, task: TaskWithParent) => {
		try {
			const taskCreation = get(taskCreationAtom);
			const analysis = taskCreation.analyzedTasks.find(
				(a) => a.taskId === task.title,
			);

			if (!analysis) {
				await set(analyzeTaskAtom, task);
				return;
			}

			const result = await breakdownTaskAction({
				...task,
				analysis: analysis.analysis,
				dependencies: task.dependencies?.map((dep) => ({
					task_id: dep.prerequisite_task_title,
					type: dep.dependency_type,
					link_type: dep.link_type,
					id: `${dep.prerequisite_task_title}-${task.title}`,
					lag_time: undefined,
					conditions: undefined,
				})),
				style: {
					color: task.style?.color ?? undefined,
					icon: task.style?.icon ?? undefined,
				},
			});

			if (result.success && result.data) {
				set(taskCreationAtom, (prev) => ({
					...prev,
					breakdowns: [
						...prev.breakdowns.filter((b) => b.taskId !== task.title),
						{ taskId: task.title, items: result.data },
					],
				}));
			}
			return result;
		} catch (error) {
			console.error("タスク細分化エラー:", error);
			throw error;
		}
	},
);

export const getTaskAnalysisAtom = atom((get) => (taskId: string) => {
	const taskCreation = get(taskCreationAtom);
	return taskCreation.analyzedTasks.find(
		(analysis) => analysis.taskId === taskId,
	);
});
