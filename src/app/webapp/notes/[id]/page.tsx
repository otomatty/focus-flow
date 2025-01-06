import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { NoteEditor } from "../_components/note-editor";
import type { Note, NoteRow } from "@/types/notes";
import { convertToCamelCase } from "@/utils/caseConverter";

interface NotePageProps {
	params: {
		id: string;
	};
}

async function getNote(id: string): Promise<Note | null> {
	const supabase = await createClient();
	const { data: note, error } = await supabase
		.schema("ff_notes")
		.from("notes")
		.select("*")
		.eq("id", id)
		.single();

	if (error || !note) {
		return null;
	}

	return convertToCamelCase(note as NoteRow) as unknown as Note;
}

export default async function NotePage({ params }: NotePageProps) {
	const note = await getNote(params.id);

	if (!note) {
		notFound();
	}

	return (
		<div className="container h-[calc(100vh-4rem)]">
			<div className="h-full py-8">
				<div className="h-full">
					<NoteEditor note={note} />
				</div>
			</div>
		</div>
	);
}
