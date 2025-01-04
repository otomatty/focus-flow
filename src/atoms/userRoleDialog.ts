import { atom } from "jotai";
import type { UserWithDetails } from "@/app/_actions/users/types";

interface UserRoleDialogState {
	isOpen: boolean;
	user: UserWithDetails | null;
}

export const userRoleDialogAtom = atom<UserRoleDialogState>({
	isOpen: false,
	user: null,
});
