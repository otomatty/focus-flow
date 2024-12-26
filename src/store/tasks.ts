import { atom } from "jotai";
import type { Database } from "@/types/supabase";
import { getFilteredTasks, searchTasks } from "@/app/_actions/task.action";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

export const tasksAtom = atom<Task[]>([]);
export const searchQueryAtom = atom("");
export const statusAtom = atom<Task["status"] | "all">("all");
export const priorityAtom = atom<Task["priority"] | "all">("all");

export const searchTasksAtom = atom(null, async (get, set) => {
	const query = get(searchQueryAtom);
	const status = get(statusAtom);
	const priority = get(priorityAtom);

	if (!query.trim()) {
		const tasks = await getFilteredTasks({ status, priority });
		set(tasksAtom, tasks);
		return;
	}

	const tasks = await searchTasks(query);
	set(tasksAtom, tasks);
});

export const filterTasksAtom = atom(null, async (get, set) => {
	const status = get(statusAtom);
	const priority = get(priorityAtom);
	const tasks = await getFilteredTasks({ status, priority });
	set(tasksAtom, tasks);
});
