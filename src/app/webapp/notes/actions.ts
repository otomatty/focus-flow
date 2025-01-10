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

export async function getNotes(params?: {
	query?: string;
	visibility?: string;
	tags?: string[];
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	let queryBuilder = supabase
		.schema("ff_notes")
		.from("notes")
		.select("*")
		.eq("user_id", user.id)
		.order("is_pinned", { ascending: false })
		.order("updated_at", { ascending: false });

	if (params?.query) {
		queryBuilder = queryBuilder.or(
			`title.ilike.%${params.query}%,content.ilike.%${params.query}%`,
		);
	}

	if (params?.visibility && params.visibility !== "all") {
		queryBuilder = queryBuilder.eq("visibility", params.visibility);
	}

	if (params?.tags && params.tags.length > 0) {
		queryBuilder = queryBuilder.contains("tags", params.tags);
	}

	const { data, error } = await queryBuilder;
	if (error) throw error;

	return (data as NoteRow[]).map(convertNoteRowToNote);
}

export async function createNote() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { data, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.insert({
			user_id: user.id,
			title: "無題のノート",
			content: "",
			content_format: "markdown",
			visibility: "private",
			is_archived: false,
			is_pinned: false,
			metadata: {},
			version: 1,
		})
		.select("*")
		.single();

	if (error) throw error;
	return convertNoteRowToNote(data as NoteRow);
}
