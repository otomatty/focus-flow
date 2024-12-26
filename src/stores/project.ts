import { atom } from "jotai";
import type { Project, ProjectFilter } from "@/types/project";

// 検索クエリのatom
export const searchQueryAtom = atom<string>("");

// フィルタのatom
export const filterAtom = atom<ProjectFilter>({});

// 表示モードのatom
export const viewModeAtom = atom<"grid" | "list">("grid");

// プロジェクト一覧のatom
export const projectsAtom = atom<Project[]>([]);

// 選択中のプロジェクトのatom
export const projectAtom = atom<Project | null>(null);

// フィルタリング済みプロジェクト一覧の派生atom
export const filteredProjectsAtom = atom((get) => {
	const projects = get(projectsAtom);
	const searchQuery = get(searchQueryAtom);
	const filter = get(filterAtom);

	return projects
		.filter((project) => {
			// 検索クエリでフィルタリング
			if (searchQuery) {
				const query = searchQuery.toLowerCase();
				const matchesName = project.name.toLowerCase().includes(query);
				const matchesDescription = project.description
					?.toLowerCase()
					.includes(query);
				if (!matchesName && !matchesDescription) {
					return false;
				}
			}

			// ステータスでフィルタリング
			if (filter.status && project.status !== filter.status) {
				return false;
			}

			// 優先度でフィルタリング
			if (filter.priority && project.priority !== filter.priority) {
				return false;
			}

			// アーカイブ状態でフィルタリング
			if (
				filter.isArchived !== undefined &&
				project.isArchived !== filter.isArchived
			) {
				return false;
			}

			return true;
		})
		.sort((a, b) => {
			// デフォルトは更新日時の降順
			const aTime = a.updatedAt ? new Date(a.updatedAt).getTime() : 0;
			const bTime = b.updatedAt ? new Date(b.updatedAt).getTime() : 0;
			return bTime - aTime;
		});
});
