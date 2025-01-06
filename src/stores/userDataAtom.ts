import { atom } from "jotai";
import type { UserLevel, UserProfile, LevelSetting } from "@/types/users";

export interface UserData {
	profile: UserProfile | null;
	level: UserLevel | null;
	nextLevelExp: number | null;
	levelSetting: LevelSetting | null;
}

export const userDataAtom = atom<UserData | null>(null);
