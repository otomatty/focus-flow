import { atom } from "jotai";
import type { Database } from "@/types/supabase";
import { getFilteredTasks, searchTasks } from "@/app/_actions/tasks";

type Task = Database["public"]["Tables"]["tasks"]["Row"];

// タスクの一覧
export const tasksAtom = atom<Task[]>([]);

// 検索クエリ
export const searchQueryAtom = atom("");

// フィルター条件
export const statusFilterAtom = atom<Task["status"] | null>(null);
export const priorityFilterAtom = atom<Task["priority"] | null>(null);

// タスクの検索
export const searchTasksAtom = atom(null, async (get, set) => {
	const query = get(searchQueryAtom);
	if (!query) {
		return;
	}
	const tasks = await searchTasks(query);
	set(tasksAtom, tasks);
});

// タスクのフィルタリング
export const filterTasksAtom = atom(null, async (get, set) => {
	const status = get(statusFilterAtom);
	const priority = get(priorityFilterAtom);
	const tasks = await getFilteredTasks({ status, priority });
	set(tasksAtom, tasks);
});
