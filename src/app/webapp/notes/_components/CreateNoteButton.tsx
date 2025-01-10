"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createNote } from "../actions";

export function CreateNoteButton() {
	const router = useRouter();

	const handleCreateNote = async () => {
		try {
			const note = await createNote();
			router.push(`/webapp/notes/${note.id}`);
		} catch (error) {
			console.error("Error creating note:", error);
		}
	};

	return (
		<Button onClick={handleCreateNote} className="gap-2">
			<Plus className="h-4 w-4" />
			新規ノート
		</Button>
	);
}
