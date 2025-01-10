"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAtom } from "jotai";
import { notesAtom } from "@/store/notes";
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

function NoteCard({ note }: { note: Note }) {
	return (
		<Link href={`/webapp/notes/${note.id}`}>
			<Card className="h-full hover:bg-accent/50 transition-colors">
				<CardHeader>
					<div className="flex items-center justify-between">
						<CardTitle className="text-lg">{note.title}</CardTitle>
						<Badge
							variant={
								note.visibility === "private"
									? "secondary"
									: note.visibility === "shared"
										? "outline"
										: "default"
							}
						>
							{note.visibility}
						</Badge>
					</div>
				</CardHeader>
				<CardContent>
					<p className="text-sm text-muted-foreground line-clamp-3">
						{note.content}
					</p>
					<div className="flex gap-2 mt-4 flex-wrap">
						{note.tags?.map((tag) => (
							<Badge key={tag} variant="outline">
								{tag}
							</Badge>
						))}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}

interface NoteListProps {
	initialNotes: Note[];
}

export function NoteList({ initialNotes }: NoteListProps) {
	const [notes, setNotes] = useAtom(notesAtom);

	useEffect(() => {
		setNotes(initialNotes);
	}, [initialNotes, setNotes]);

	useEffect(() => {
		const supabase = createClient();

		const channel = supabase
			.channel("notes")
			.on(
				"postgres_changes",
				{
					event: "*",
					schema: "ff_notes",
					table: "notes",
				},
				(payload) => {
					switch (payload.eventType) {
						case "INSERT":
							setNotes((prev) => [
								convertNoteRowToNote(payload.new as NoteRow),
								...prev,
							]);
							break;
						case "UPDATE":
							setNotes((prev) =>
								prev.map((note) =>
									note.id === payload.new.id
										? convertNoteRowToNote(payload.new as NoteRow)
										: note,
								),
							);
							break;
						case "DELETE":
							setNotes((prev) =>
								prev.filter((note) => note.id !== payload.old.id),
							);
							break;
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [setNotes]);

	if (!notes || notes.length === 0) {
		return (
			<div className="text-center text-muted-foreground">
				ノートがありません。新しいノートを作成してください。
			</div>
		);
	}

	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
			{notes.map((note) => (
				<NoteCard key={note.id} note={note} />
			))}
		</div>
	);
}
