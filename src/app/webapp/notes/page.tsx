import { Suspense } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import type { Note, NoteRow } from "@/types/notes";
import { convertToCamelCase } from "@/utils/caseConverter";

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

async function getNotes() {
	const supabase = await createClient();
	const { data: notes, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.select("*")
		.order("updated_at", { ascending: false });

	if (error) {
		console.error("Error fetching notes:", error);
		return [];
	}

	return notes.map((note) => convertNoteRowToNote(note as NoteRow));
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
					<div className="flex gap-2 mt-4">
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

async function NoteList() {
	const notes = await getNotes();

	if (notes.length === 0) {
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

export default function NotesPage() {
	return (
		<div className="container py-8">
			<div className="flex items-center justify-between mb-8">
				<h1 className="text-3xl font-bold">ノート</h1>
				<Link href="/webapp/notes/new">
					<Button>
						<Plus className="w-4 h-4 mr-2" />
						新規作成
					</Button>
				</Link>
			</div>

			<Suspense
				fallback={
					<div className="text-center text-muted-foreground">
						ノートを読み込んでいます...
					</div>
				}
			>
				<NoteList />
			</Suspense>
		</div>
	);
}
