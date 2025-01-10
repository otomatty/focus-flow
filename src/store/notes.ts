import { atom } from "jotai";
import type { Note } from "@/types/notes";

export const notesAtom = atom<Note[]>([]);
export const currentNoteAtom = atom<Note | null>(null);
