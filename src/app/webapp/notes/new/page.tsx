import { NoteEditor } from "../_components/note-editor";

export default function NewNotePage() {
	return (
		<div className="container h-[calc(100vh-4rem)]">
			<div className="h-full py-8">
				<h1 className="text-3xl font-bold mb-8">新規ノート作成</h1>
				<div className="h-[calc(100%-5rem)]">
					<NoteEditor />
				</div>
			</div>
		</div>
	);
}
