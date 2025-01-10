import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/supabase";
import type {
	Note,
	NoteRow,
	NoteSearchParams,
	LinkedItem,
} from "@/types/notes";

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

function convertNoteToRow(note: Partial<Note>): Partial<NoteRow> {
	return {
		user_id: note.userId,
		title: note.title,
		content: note.content,
		content_format: note.contentFormat,
		tags: note.tags,
		visibility: note.visibility,
		is_archived: note.isArchived,
		is_pinned: note.isPinned,
		metadata: note.metadata as Json,
		version: note.version,
	};
}

// ノートの作成
export async function createNote(
	title: string,
	content: string,
	tags: string[] = [],
	visibility: "private" | "shared" | "public" = "private",
): Promise<Note> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const { data, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.insert({
			user_id: user.id,
			title,
			content,
			tags,
			visibility,
		})
		.select("*")
		.single();

	if (error) {
		throw error;
	}

	return convertNoteRowToNote(data as NoteRow);
}

// ノートの更新
export async function updateNote(
	noteId: string,
	updates: Partial<Note>,
): Promise<Note> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const { data, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.update({
			...convertNoteToRow(updates),
			version: updates.version ? updates.version + 1 : undefined,
		})
		.eq("id", noteId)
		.eq("user_id", user.id)
		.select("*")
		.single();

	if (error) {
		throw error;
	}

	return convertNoteRowToNote(data as NoteRow);
}

// ノートの削除
export async function deleteNote(noteId: string): Promise<void> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const { error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.delete()
		.eq("id", noteId)
		.eq("user_id", user.id);

	if (error) {
		throw error;
	}
}

// ノートの検索
export async function searchNotes(params: NoteSearchParams): Promise<Note[]> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	let query = supabase
		.schema("ff_notes")
		.from("notes")
		.select("*")
		.eq("user_id", user.id)
		.order("created_at", { ascending: false });

	if (params.query) {
		query = query.or(
			`title.ilike.%${params.query}%,content.ilike.%${params.query}%`,
		);
	}

	if (params.tags && params.tags.length > 0) {
		query = query.contains("tags", params.tags);
	}

	if (params.visibility) {
		query = query.eq("visibility", params.visibility);
	}

	if (params.limit) {
		query = query.limit(params.limit);
	}

	if (params.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit || 10) - 1,
		);
	}

	const { data, error } = await query;

	if (error) {
		throw error;
	}

	return (data as NoteRow[]).map((note) => convertNoteRowToNote(note));
}

// リンクされたアイテムの取得
export async function getLinkedItems(
	noteId: string,
	type?: string,
): Promise<LinkedItem[]> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const { data, error } = await supabase
		.schema("ff_notes")
		.rpc("get_linked_items", {
			p_note_id: noteId,
			p_type: type,
		});

	if (error) {
		throw error;
	}

	return data.map((item) => ({
		itemId: item.item_id,
		itemType: item.item_type as LinkedItem["itemType"],
		title: item.title,
		preview: item.preview,
	}));
}

// ノート間のリンク作成
export async function createNoteLink(
	sourceNoteId: string,
	targetNoteId: string,
	linkType: "reference" | "parent_child" | "related",
): Promise<void> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const { error } = await supabase
		.schema("ff_notes")
		.from("note_links")
		.insert({
			source_note_id: sourceNoteId,
			target_note_id: targetNoteId,
			link_type: linkType,
		});

	if (error) {
		throw error;
	}
}

// ノートの共有設定
export async function shareNote(
	noteId: string,
	sharedWithUserId?: string,
	sharedWithRoleId?: string,
	permissionLevel: "read" | "write" | "admin" = "read",
): Promise<void> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// ノートの可視性を'shared'に更新
	await supabase
		.schema("ff_notes")
		.from("notes")
		.update({ visibility: "shared" })
		.eq("id", noteId)
		.eq("user_id", user.id);

	// 共有設定を作成
	const { error } = await supabase
		.schema("ff_notes")
		.from("note_shares")
		.insert({
			note_id: noteId,
			shared_with_user_id: sharedWithUserId,
			shared_with_role_id: sharedWithRoleId,
			permission_level: permissionLevel,
		});

	if (error) {
		throw error;
	}
}

// ノートの公開設定
export async function makeNotePublic(
	noteId: string,
	settings: {
		isPasswordProtected?: boolean;
		passwordHash?: string;
		allowComments?: boolean;
		allowReactions?: boolean;
		expiresAt?: string;
	},
): Promise<void> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// ノートの可視性を'public'に更新
	await supabase
		.schema("ff_notes")
		.from("notes")
		.update({ visibility: "public" })
		.eq("id", noteId)
		.eq("user_id", user.id);

	// 公開設定を作成
	const { error } = await supabase
		.schema("ff_notes")
		.from("note_public_settings")
		.insert({
			note_id: noteId,
			public_url_id: `${noteId}-${Date.now()}`,
			...settings,
		});

	if (error) {
		throw error;
	}
}

export interface NoteTemplate {
	id: string;
	title: string;
	content: string;
	templateType:
		| "goal_reflection"
		| "milestone_reflection"
		| "habit_reflection"
		| "habit_log";
	metadata: Record<string, unknown>;
	isDefault: boolean;
	createdAt: string;
	updatedAt: string;
}

interface NoteTemplateRow {
	id: string;
	title: string;
	content: string;
	template_type: string;
	metadata: Json;
	is_default: boolean | null;
	created_at: string | null;
	updated_at: string | null;
}

function convertTemplateRowToTemplate(row: NoteTemplateRow): NoteTemplate {
	return {
		id: row.id,
		title: row.title,
		content: row.content,
		templateType: row.template_type as NoteTemplate["templateType"],
		metadata: row.metadata as Record<string, unknown>,
		isDefault: row.is_default || false,
		createdAt: row.created_at || new Date().toISOString(),
		updatedAt: row.updated_at || new Date().toISOString(),
	};
}

export async function getTemplates() {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_notes")
		.from("note_templates")
		.select("*")
		.order("created_at", { ascending: false });

	if (error) throw error;
	return (data as NoteTemplateRow[]).map(convertTemplateRowToTemplate);
}

export async function getTemplatesByType(type: NoteTemplate["templateType"]) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_notes")
		.from("note_templates")
		.select("*")
		.eq("template_type", type)
		.order("is_default", { ascending: false });

	if (error) throw error;
	return (data as NoteTemplateRow[]).map(convertTemplateRowToTemplate);
}

export async function createTemplate(
	template: Omit<NoteTemplate, "id" | "createdAt" | "updatedAt">,
) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_notes")
		.from("note_templates")
		.insert({
			title: template.title,
			content: template.content,
			template_type: template.templateType,
			metadata: template.metadata as Json,
			is_default: template.isDefault,
		})
		.select()
		.single();

	if (error) throw error;
	return convertTemplateRowToTemplate(data as NoteTemplateRow);
}

export async function updateTemplate(
	id: string,
	template: Partial<Omit<NoteTemplate, "id" | "createdAt" | "updatedAt">>,
) {
	const supabase = await createClient();
	const { data, error } = await supabase
		.schema("ff_notes")
		.from("note_templates")
		.update({
			title: template.title,
			content: template.content,
			template_type: template.templateType,
			metadata: template.metadata as Json,
			is_default: template.isDefault,
		})
		.eq("id", id)
		.select()
		.single();

	if (error) throw error;
	return convertTemplateRowToTemplate(data as NoteTemplateRow);
}

export async function deleteTemplate(id: string) {
	const supabase = await createClient();
	const { error } = await supabase
		.schema("ff_notes")
		.from("note_templates")
		.delete()
		.eq("id", id);

	if (error) throw error;
}

export async function createNoteFromTemplate(
	templateId: string,
	userId: string,
) {
	const supabase = await createClient();

	// テンプレートを取得
	const { data: template, error: templateError } = await supabase
		.schema("ff_notes")
		.from("note_templates")
		.select("*")
		.eq("id", templateId)
		.single();

	if (templateError) throw templateError;

	// テンプレートからノートを作成
	const { data: note, error: noteError } = await supabase
		.schema("ff_notes")
		.from("notes")
		.insert([
			{
				user_id: userId,
				title: template.title,
				content: template.content,
				content_format: "markdown",
				metadata: {
					...(template.metadata as Record<string, unknown>),
					template_id: templateId,
					template_type: template.template_type,
				} as Json,
			},
		])
		.select()
		.single();

	if (noteError) throw noteError;
	return note;
}

// 高度な検索機能
export interface SearchNotesParams {
	query?: string;
	tags?: string[];
	visibility?: "private" | "shared" | "public";
	limit?: number;
	offset?: number;
}
