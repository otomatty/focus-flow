"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/client";
import type { Note, NoteRow } from "@/types/notes";

interface LinkedNotesProps {
	noteId: string;
}

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

export function LinkedNotes({ noteId }: LinkedNotesProps) {
	const [linkedNotes, setLinkedNotes] = useState<Note[]>([]);
	const [backlinks, setBacklinks] = useState<Note[]>([]);
	const router = useRouter();

	useEffect(() => {
		const supabase = createClient();

		const fetchLinkedNotes = async () => {
			// 現在のノートのコンテンツから[[title]](/webapp/notes/id)形式のリンクを抽出
			const { data: currentNote } = await supabase
				.schema("ff_notes")
				.from("notes")
				.select("content")
				.eq("id", noteId)
				.single();

			if (!currentNote?.content) return;

			const linkPattern = /\[\[(.*?)\]\]\(\/webapp\/notes\/(.*?)\)/g;
			const linkedIds = Array.from(
				currentNote.content.matchAll(linkPattern),
			).map((match) => match[2]);

			if (linkedIds.length > 0) {
				const { data: notes } = await supabase
					.schema("ff_notes")
					.from("notes")
					.select("*")
					.in("id", linkedIds);

				if (notes) {
					setLinkedNotes(
						notes.map((note) => convertNoteRowToNote(note as NoteRow)),
					);
				}
			}

			// バックリンクを取得（このノートへのリンクを含むノート）
			const { data: backlinkedNotes } = await supabase
				.schema("ff_notes")
				.from("notes")
				.select("*")
				.ilike("content", `%/webapp/notes/${noteId}%`);

			if (backlinkedNotes) {
				setBacklinks(
					backlinkedNotes.map((note) => convertNoteRowToNote(note as NoteRow)),
				);
			}
		};

		fetchLinkedNotes();

		// リアルタイム更新の購読
		const channel = supabase
			.channel("linked-notes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "ff_notes",
					table: "notes",
					filter: `content.ilike.%/webapp/notes/${noteId}%`,
				},
				() => {
					fetchLinkedNotes();
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [noteId]);

	const renderNoteList = (notes: Note[], title: string) => (
		<>
			<CardHeader>
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				{notes.length > 0 ? (
					<ScrollArea className="h-[200px]">
						<div className="space-y-2">
							{notes.map((note) => (
								<button
									type="button"
									key={note.id}
									onClick={() => router.push(`/webapp/notes/${note.id}`)}
									className="w-full p-2 text-left hover:bg-accent rounded-lg transition-colors"
								>
									<div className="flex items-center justify-between">
										<div className="font-medium">{note.title}</div>
										<Badge variant="secondary">{note.visibility}</Badge>
									</div>
									<div className="text-sm text-muted-foreground line-clamp-2">
										{note.content}
									</div>
								</button>
							))}
						</div>
					</ScrollArea>
				) : (
					<div className="text-sm text-muted-foreground py-2">
						リンクされたノートはありません
					</div>
				)}
			</CardContent>
		</>
	);

	return (
		<div className="grid gap-4">
			<Card>{renderNoteList(linkedNotes, "リンク先")}</Card>
			<Card>{renderNoteList(backlinks, "バックリンク")}</Card>
		</div>
	);
}
