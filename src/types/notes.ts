import type { Json } from "./supabase";

// データベースの行の型（スネークケース）
export interface NoteRow {
	id: string;
	user_id: string;
	title: string;
	content: string;
	content_format: "markdown" | "rich_text";
	tags: string[] | null;
	visibility: "private" | "shared" | "public";
	is_archived: boolean | null;
	is_pinned: boolean | null;
	metadata: Json;
	version: number | null;
	created_at: string | null;
	updated_at: string | null;
}

// フロントエンドの型（キャメルケース）
export interface Note {
	id: string;
	userId: string;
	title: string;
	content: string;
	contentFormat: "markdown" | "rich_text";
	tags: string[];
	visibility: "private" | "shared" | "public";
	isArchived: boolean;
	isPinned: boolean;
	metadata: Record<string, unknown>;
	version: number;
	createdAt: string;
	updatedAt: string;
}

export interface NoteLink {
	id: string;
	sourceNoteId: string;
	targetNoteId: string;
	linkType: "reference" | "parent_child" | "related";
	createdAt: string;
}

export interface NoteReference {
	id: string;
	noteId: string;
	referenceType: "task" | "goal" | "habit" | "focus_session";
	referenceId: string;
	createdAt: string;
}

export interface NoteVersion {
	id: string;
	noteId: string;
	title: string;
	content: string;
	tags: string[];
	version: number;
	createdBy: string;
	createdAt: string;
}

export interface NoteShare {
	id: string;
	noteId: string;
	sharedWithUserId?: string;
	sharedWithRoleId?: string;
	permissionLevel: "read" | "write" | "admin";
	createdAt: string;
	updatedAt: string;
}

export interface NotePublicSettings {
	id: string;
	noteId: string;
	publicUrlId: string;
	isPasswordProtected: boolean;
	passwordHash?: string;
	allowComments: boolean;
	allowReactions: boolean;
	expiresAt?: string;
	createdAt: string;
	updatedAt: string;
}

export interface LinkedItem {
	itemId: string;
	itemType: "task" | "goal" | "habit" | "focus_session" | "note";
	title: string;
	preview?: string;
}

export interface NoteSearchParams {
	query?: string;
	tags?: string[];
	visibility?: "private" | "shared" | "public";
	limit?: number;
	offset?: number;
}
