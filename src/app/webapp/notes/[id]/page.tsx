import { Suspense } from "react";
import { NoteEditor } from "./_components/NoteEditor";
import { MetadataEditor } from "./_components/MetadataEditor";
import { LinkedNotes } from "./_components/LinkedNotes";
import { getNote } from "./actions";

interface NotePageProps {
	params: {
		id: string;
	};
}

export default async function NotePage({ params }: NotePageProps) {
	const note = await getNote(params.id);

	return (
		<div className="container mx-auto p-4 space-y-4">
			<Suspense fallback={<div>Loading...</div>}>
				<NoteEditor note={note} />
			</Suspense>
			<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
				<Suspense fallback={<div>Loading...</div>}>
					<MetadataEditor noteId={params.id} />
				</Suspense>
				<Suspense fallback={<div>Loading...</div>}>
					<LinkedNotes noteId={params.id} />
				</Suspense>
			</div>
		</div>
	);
}
