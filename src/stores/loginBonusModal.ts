import { atom } from "jotai";

export interface LoginBonusState {
	isOpen: boolean;
	bonusExp: number;
	loginStreak: number;
}

export const loginBonusModalAtom = atom<LoginBonusState>({
	isOpen: false,
	bonusExp: 0,
	loginStreak: 0,
});
