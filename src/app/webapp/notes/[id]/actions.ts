"use server";

import { createClient } from "@/lib/supabase/server";
import type { Note, NoteRow } from "@/types/notes";

function convertNoteRowToNote(row: NoteRow): Note {
	return {
		id: row.id,
		userId: row.user_id,
		title: row.title,
		content: row.content,
		contentFormat: row.content_format,
		tags: row.tags || [],
		visibility: row.visibility,
		isArchived: row.is_archived || false,
		isPinned: row.is_pinned || false,
		metadata: row.metadata as Record<string, unknown>,
		version: row.version || 1,
		createdAt: row.created_at || new Date().toISOString(),
		updatedAt: row.updated_at || new Date().toISOString(),
	};
}

export async function getNote(noteId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { data, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.select("*")
		.eq("id", noteId)
		.eq("user_id", user.id)
		.single();

	if (error) throw error;
	return convertNoteRowToNote(data as NoteRow);
}

export async function updateNoteContent(
	noteId: string,
	updates: {
		title?: string;
		content?: string;
	},
) {
	"use server";

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { data, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.update({
			title: updates.title,
			content: updates.content,
			version: undefined,
			updated_at: new Date().toISOString(),
		})
		.eq("id", noteId)
		.eq("user_id", user.id)
		.select("*")
		.single();

	if (error) throw error;
	return convertNoteRowToNote(data as NoteRow);
}

export async function updateNoteMetadata(
	noteId: string,
	updates: {
		visibility?: Note["visibility"];
		isPinned?: boolean;
		isArchived?: boolean;
		tags?: string[];
	},
) {
	"use server";

	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { data, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.update({
			visibility: updates.visibility,
			is_pinned: updates.isPinned,
			is_archived: updates.isArchived,
			tags: updates.tags,
			version: undefined,
			updated_at: new Date().toISOString(),
		})
		.eq("id", noteId)
		.eq("user_id", user.id)
		.select("*")
		.single();

	if (error) throw error;
	return convertNoteRowToNote(data as NoteRow);
}
