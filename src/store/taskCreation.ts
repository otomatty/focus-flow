import { atom } from "jotai";
import type { AnalyzedTask } from "@/app/_actions/tasks/processor";

export type TaskFormData = {
	title: string;
	description: string;
	estimated_duration: string;
	priority: "high" | "medium" | "low";
	tags: string[];
};

type TaskCreationState = {
	originalTask: TaskFormData | null;
	decomposedTasks: TaskFormData[];
	analyzedTasks: {
		taskId: string;
		analysis: AnalyzedTask;
	}[];
	breakdowns: {
		taskId: string;
		items: {
			title: string;
			description?: string;
			estimated_duration: string;
			experience_points: number;
			skill_category: string;
		}[];
	}[];
	currentStep: "input" | "decompose" | "analyze" | "breakdown";
	isProcessing: boolean;
	error: string | null;
};

export const taskCreationAtom = atom<TaskCreationState>({
	originalTask: null,
	decomposedTasks: [],
	analyzedTasks: [],
	breakdowns: [],
	currentStep: "input",
	isProcessing: false,
	error: null,
});

export const setOriginalTaskAtom = atom(
	null,
	(get, set, task: TaskFormData | null) => {
		set(taskCreationAtom, {
			...get(taskCreationAtom),
			originalTask: task,
		});
	},
);

export const setDecomposedTasksAtom = atom(
	null,
	(get, set, tasks: TaskFormData[]) => {
		set(taskCreationAtom, {
			...get(taskCreationAtom),
			decomposedTasks: tasks,
		});
	},
);

export const setAnalyzedTasksAtom = atom(
	null,
	(get, set, tasks: { taskId: string; analysis: AnalyzedTask }[]) => {
		set(taskCreationAtom, {
			...get(taskCreationAtom),
			analyzedTasks: tasks,
		});
	},
);

export const setBreakdownsAtom = atom(
	null,
	(
		get,
		set,
		breakdowns: {
			taskId: string;
			items: {
				title: string;
				description?: string;
				estimated_duration: string;
				experience_points: number;
				skill_category: string;
			}[];
		}[],
	) => {
		set(taskCreationAtom, {
			...get(taskCreationAtom),
			breakdowns,
		});
	},
);

export const setCurrentStepAtom = atom(
	null,
	(get, set, step: TaskCreationState["currentStep"]) => {
		set(taskCreationAtom, {
			...get(taskCreationAtom),
			currentStep: step,
		});
	},
);

export const setProcessingAtom = atom(
	null,
	(get, set, isProcessing: boolean) => {
		set(taskCreationAtom, {
			...get(taskCreationAtom),
			isProcessing,
		});
	},
);

export const setErrorAtom = atom(null, (get, set, error: string | null) => {
	set(taskCreationAtom, {
		...get(taskCreationAtom),
		error,
	});
});
