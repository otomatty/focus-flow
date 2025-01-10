import { atom } from "jotai";

export interface LevelUpState {
	isOpen: boolean;
	prevLevel: number;
	newLevel: number;
	currentExp: number;
	nextLevelExp: number;
}

export const levelUpModalAtom = atom<LevelUpState>({
	isOpen: false,
	prevLevel: 1,
	newLevel: 1,
	currentExp: 0,
	nextLevelExp: 100,
});
