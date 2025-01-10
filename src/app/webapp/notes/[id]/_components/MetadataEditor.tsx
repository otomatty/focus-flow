"use client";

import { useCallback } from "react";
import { useAtom } from "jotai";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { currentNoteAtom } from "@/store/notes";
import { updateNoteMetadata } from "../actions";

interface MetadataEditorProps {
	noteId: string;
}

export function MetadataEditor({ noteId }: MetadataEditorProps) {
	const [note, setNote] = useAtom(currentNoteAtom);

	const handleVisibilityChange = useCallback(
		async (visibility: "private" | "shared" | "public") => {
			if (!note) return;
			try {
				const updatedNote = await updateNoteMetadata(noteId, { visibility });
				setNote(updatedNote);
			} catch (error) {
				console.error("Error updating note visibility:", error);
			}
		},
		[note, noteId, setNote],
	);

	const handlePinToggle = useCallback(
		async (isPinned: boolean) => {
			if (!note) return;
			try {
				const updatedNote = await updateNoteMetadata(noteId, { isPinned });
				setNote(updatedNote);
			} catch (error) {
				console.error("Error updating note pin status:", error);
			}
		},
		[note, noteId, setNote],
	);

	const handleArchiveToggle = useCallback(
		async (isArchived: boolean) => {
			if (!note) return;
			try {
				const updatedNote = await updateNoteMetadata(noteId, { isArchived });
				setNote(updatedNote);
			} catch (error) {
				console.error("Error updating note archive status:", error);
			}
		},
		[note, noteId, setNote],
	);

	const handleAddTag = useCallback(
		async (tag: string) => {
			if (!note || !tag) return;
			const newTags = [...new Set([...note.tags, tag])];
			try {
				const updatedNote = await updateNoteMetadata(noteId, { tags: newTags });
				setNote(updatedNote);
			} catch (error) {
				console.error("Error adding tag:", error);
			}
		},
		[note, noteId, setNote],
	);

	const handleRemoveTag = useCallback(
		async (tagToRemove: string) => {
			if (!note) return;
			const newTags = note.tags.filter((tag) => tag !== tagToRemove);
			try {
				const updatedNote = await updateNoteMetadata(noteId, { tags: newTags });
				setNote(updatedNote);
			} catch (error) {
				console.error("Error removing tag:", error);
			}
		},
		[note, noteId, setNote],
	);

	if (!note) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>設定</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="space-y-2">
					<Label>可視性</Label>
					<Select
						value={note.visibility}
						onValueChange={handleVisibilityChange}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="private">プライベート</SelectItem>
							<SelectItem value="shared">共有</SelectItem>
							<SelectItem value="public">公開</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>ピン留め</Label>
						<div className="text-sm text-muted-foreground">
							ノート一覧の上部に固定します
						</div>
					</div>
					<Switch checked={note.isPinned} onCheckedChange={handlePinToggle} />
				</div>

				<div className="flex items-center justify-between">
					<div className="space-y-0.5">
						<Label>アーカイブ</Label>
						<div className="text-sm text-muted-foreground">
							ノートをアーカイブに移動します
						</div>
					</div>
					<Switch
						checked={note.isArchived}
						onCheckedChange={handleArchiveToggle}
					/>
				</div>

				<div className="space-y-2">
					<Label>タグ</Label>
					<div className="flex gap-2">
						<Input
							placeholder="新しいタグ..."
							onKeyPress={(e) => {
								if (e.key === "Enter") {
									handleAddTag((e.target as HTMLInputElement).value);
									(e.target as HTMLInputElement).value = "";
								}
							}}
						/>
						<Button
							variant="outline"
							size="icon"
							onClick={() => {
								const input = document.querySelector(
									"input[placeholder='新しいタグ...']",
								) as HTMLInputElement;
								handleAddTag(input.value);
								input.value = "";
							}}
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
					<div className="flex gap-2 flex-wrap">
						{note.tags.map((tag) => (
							<Badge key={tag} variant="secondary" className="gap-1">
								{tag}
								<Button
									variant="ghost"
									size="icon"
									className="h-4 w-4 p-0 hover:bg-transparent"
									onClick={() => handleRemoveTag(tag)}
								>
									<X className="h-3 w-3" />
								</Button>
							</Badge>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
