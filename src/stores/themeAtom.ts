import { atom } from "jotai";

// テーマの状態を管理するAtom
export const themeAtom = atom<"light" | "dark" | "system">("system");
