import { Suspense } from "react";
import { SearchFilter } from "./_components/SearchFilter";
import { NoteList } from "./_components/NoteList";
import { CreateNoteButton } from "./_components/CreateNoteButton";
import { getNotes } from "./actions";

interface NotesPageProps {
	searchParams?: {
		[key: string]: string | string[] | undefined;
	};
}

export default async function NotesPage({ searchParams = {} }: NotesPageProps) {
	const query =
		typeof searchParams.query === "string" ? searchParams.query : undefined;
	const visibility =
		typeof searchParams.visibility === "string"
			? searchParams.visibility
			: undefined;
	const tags =
		typeof searchParams.tags === "string"
			? searchParams.tags.split(",").filter(Boolean)
			: undefined;

	const notes = await getNotes({
		query,
		visibility,
		tags,
	});

	return (
		<div className="container mx-auto p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">ノート一覧</h1>
				<CreateNoteButton />
			</div>
			<SearchFilter />
			<Suspense fallback={<div>Loading...</div>}>
				<NoteList initialNotes={notes} />
			</Suspense>
		</div>
	);
}
