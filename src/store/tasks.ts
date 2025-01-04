import { atom } from "jotai";
import { getTasks, searchTasks } from "@/app/_actions/tasks/core";
import type { Task } from "@/types/task";

// タスクの一覧
export const tasksAtom = atom<Task[]>([]);

// 検索クエリ
export const searchQueryAtom = atom("");

// フィルター条件
export const statusFilterAtom = atom<Task["status"] | null>(null);
export const priorityFilterAtom = atom<Task["priority"] | null>(null);

// フィルタリング済みのタスク一覧
export const filteredTasksAtom = atom((get) => {
	const tasks = get(tasksAtom);
	const status = get(statusFilterAtom);
	const priority = get(priorityFilterAtom);
	const searchQuery = get(searchQueryAtom);

	return tasks.filter((task) => {
		// ステータスでフィルタリング
		if (status && task.status !== status) {
			return false;
		}

		// 優先度でフィルタリング
		if (priority && task.priority !== priority) {
			return false;
		}

		// 検索クエリでフィルタリング
		if (searchQuery) {
			const query = searchQuery.toLowerCase();
			return (
				task.title.toLowerCase().includes(query) ||
				task.description?.toLowerCase().includes(query) ||
				task.category?.toLowerCase().includes(query)
			);
		}

		return true;
	});
});

// タスクの初期読み込み
export const loadTasksAtom = atom(null, async (get, set) => {
	const tasks = await getTasks();
	set(tasksAtom, tasks);
});

// タスクの検索
export const searchTasksAtom = atom(null, async (get, set) => {
	const query = get(searchQueryAtom);
	const tasks = !query ? await getTasks() : await searchTasks(query);
	set(tasksAtom, tasks);
});
