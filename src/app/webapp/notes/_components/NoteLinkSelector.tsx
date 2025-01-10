"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Link as LinkIcon } from "lucide-react";
import { useAtomValue } from "jotai";
import { notesAtom } from "@/store/notes";
import type { Note } from "@/types/notes";

interface NoteLinkSelectorProps {
	onSelect: (note: Note) => void;
	currentNoteId?: string;
}

export function NoteLinkSelector({
	onSelect,
	currentNoteId,
}: NoteLinkSelectorProps) {
	const notes = useAtomValue(notesAtom);
	const [search, setSearch] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	const filteredNotes = notes.filter(
		(note) =>
			note.id !== currentNoteId &&
			(note.title.toLowerCase().includes(search.toLowerCase()) ||
				note.content.toLowerCase().includes(search.toLowerCase())),
	);

	const handleSelect = useCallback(
		(note: Note) => {
			onSelect(note);
			setIsOpen(false);
		},
		[onSelect],
	);

	return (
		<Dialog open={isOpen} onOpenChange={setIsOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="icon">
					<LinkIcon className="h-4 w-4" />
				</Button>
			</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>ノートをリンク</DialogTitle>
				</DialogHeader>
				<div className="space-y-4">
					<Input
						placeholder="ノートを検索..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>
					<ScrollArea className="h-[400px]">
						<div className="space-y-2">
							{filteredNotes.map((note) => (
								<button
									type="button"
									key={note.id}
									onClick={() => handleSelect(note)}
									className="w-full p-4 text-left hover:bg-accent rounded-lg transition-colors"
								>
									<div className="font-medium">{note.title}</div>
									<div className="text-sm text-muted-foreground line-clamp-2">
										{note.content}
									</div>
								</button>
							))}
							{filteredNotes.length === 0 && (
								<div className="text-center text-muted-foreground py-4">
									ノートが見つかりません
								</div>
							)}
						</div>
					</ScrollArea>
				</div>
			</DialogContent>
		</Dialog>
	);
}
