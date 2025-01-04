import { atom } from "jotai";
import type { UserWithDetails } from "@/app/_actions/users/types";

interface UserFilters {
	search: string;
	role: string;
	status: "active" | "inactive" | "";
}

// フィルター条件を保持するatom
export const userFiltersAtom = atom<UserFilters>({
	search: "",
	role: "",
	status: "",
});

// 元のユーザーリストを保持するatom
export const usersAtom = atom<UserWithDetails[]>([]);

// フィルター適用後のユーザーリストを計算するatom
export const filteredUsersAtom = atom((get) => {
	const filters = get(userFiltersAtom);
	const users = get(usersAtom);

	return users.filter((user) => {
		// 検索フィルター
		const searchMatch =
			!filters.search ||
			user.profile.display_name
				?.toLowerCase()
				.includes(filters.search.toLowerCase()) ||
			user.profile.email?.toLowerCase().includes(filters.search.toLowerCase());

		// ロールフィルター
		const roleMatch =
			!filters.role || user.roles.some((role) => role.id === filters.role);

		// ステータスフィルター
		const statusMatch =
			!filters.status || user.account_status.status === filters.status;

		return searchMatch && roleMatch && statusMatch;
	});
});
