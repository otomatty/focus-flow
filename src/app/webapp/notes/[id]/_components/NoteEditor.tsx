"use client";

import { useEffect, useCallback, useTransition } from "react";
import { useAtom } from "jotai";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import MDEditor from "@uiw/react-md-editor";
import { currentNoteAtom } from "@/store/notes";
import { ImageUploader } from "../../_components/ImageUploader";
import { NoteLinkSelector } from "../../_components/NoteLinkSelector";
import { updateNoteContent } from "../actions";
import type { Note } from "@/types/notes";

interface NoteEditorProps {
	note: Note;
}

export function NoteEditor({ note: initialNote }: NoteEditorProps) {
	const [note, setNote] = useAtom(currentNoteAtom);
	const [isPending, startTransition] = useTransition();

	useEffect(() => {
		setNote(initialNote);
	}, [initialNote, setNote]);

	const handleTitleChange = useCallback(
		async (title: string) => {
			if (!note) return;
			startTransition(async () => {
				try {
					const updatedNote = await updateNoteContent(note.id, { title });
					setNote(updatedNote);
				} catch (error) {
					console.error("Error updating note title:", error);
				}
			});
		},
		[note, setNote],
	);

	const handleContentChange = useCallback(
		async (content: string | undefined) => {
			if (!note || content === undefined) return;
			startTransition(async () => {
				try {
					const updatedNote = await updateNoteContent(note.id, { content });
					setNote(updatedNote);
				} catch (error) {
					console.error("Error updating note content:", error);
				}
			});
		},
		[note, setNote],
	);

	const handleImageUpload = useCallback(
		(imageUrl: string) => {
			if (!note) return;
			const imageMarkdown = `![](${imageUrl})`;
			const newContent = note.content
				? `${note.content}\n${imageMarkdown}`
				: imageMarkdown;
			handleContentChange(newContent);
		},
		[note, handleContentChange],
	);

	const handleNoteLink = useCallback(
		(linkedNote: Note) => {
			if (!note) return;
			const linkMarkdown = `[[${linkedNote.title}]](/webapp/notes/${linkedNote.id})`;
			const newContent = note.content
				? `${note.content}\n${linkMarkdown}`
				: linkMarkdown;
			handleContentChange(newContent);
		},
		[note, handleContentChange],
	);

	if (!note) {
		return null;
	}

	return (
		<Card className="p-4">
			<div className="space-y-4">
				<Input
					value={note.title}
					onChange={(e) => handleTitleChange(e.target.value)}
					className="text-2xl font-bold border-none focus-visible:ring-0"
					placeholder="タイトルを入力..."
				/>
				<div className="flex items-center gap-2 pb-2">
					<ImageUploader onUpload={handleImageUpload} />
					<NoteLinkSelector onSelect={handleNoteLink} currentNoteId={note.id} />
				</div>
				<div data-color-mode="light">
					<MDEditor
						value={note.content}
						onChange={handleContentChange}
						preview="edit"
						height={500}
						visibleDragbar={false}
						hideToolbar={false}
						enableScroll={true}
						textareaProps={{
							placeholder: "ノートを入力...",
						}}
					/>
				</div>
			</div>
		</Card>
	);
}
