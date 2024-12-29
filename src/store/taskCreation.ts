import { atom } from "jotai";
import type { DecomposedTask, AIAnalysis } from "@/types/task";

export interface TaskCreationState {
	decomposedTasks: DecomposedTask[];
	analyzedTasks: {
		taskId: string;
		analysis: AIAnalysis;
	}[];
	breakdowns: {
		taskId: string;
		items: DecomposedTask[];
	}[];
	currentStep: "input" | "decompose" | "analyze" | "breakdown";
	error: string | null;
}

export const taskCreationAtom = atom<TaskCreationState>({
	decomposedTasks: [],
	analyzedTasks: [],
	breakdowns: [],
	currentStep: "input",
	error: null,
});

export const setCurrentStepAtom = atom(
	null,
	(get, set, step: "input" | "decompose" | "analyze" | "breakdown") => {
		set(taskCreationAtom, (prev) => ({
			...prev,
			currentStep: step,
		}));
	},
);
