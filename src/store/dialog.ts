import { atom } from "jotai";
import type { DecomposedTask } from "@/types/task";

export const editingTaskIdAtom = atom<string | null>(null);

// タスク更新用のatom
export const taskUpdateAtom = atom<DecomposedTask | null>(null);

// タスク更新処理用のatom
export const handleTaskUpdateAtom = atom(
	null,
	(get, set, updatedTask: DecomposedTask) => {
		set(taskUpdateAtom, updatedTask);
		set(editingTaskIdAtom, null);
	},
);
