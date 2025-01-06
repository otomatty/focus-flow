import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Editor } from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { createNote, updateNote } from "@/app/_actions/notes/service";
import type { Note } from "@/types/notes";

interface NoteEditorProps {
	note?: Note;
	onSave?: (note: Note) => void;
}

export function NoteEditor({ note, onSave }: NoteEditorProps) {
	const router = useRouter();
	const [title, setTitle] = useState(note?.title || "");
	const [content, setContent] = useState(note?.content || "");
	const [visibility, setVisibility] = useState<"private" | "shared" | "public">(
		note?.visibility || "private",
	);
	const [isSaving, setIsSaving] = useState(false);

	// エディタの設定
	const editorOptions = {
		minimap: { enabled: false },
		lineNumbers: "on" as const,
		wordWrap: "on" as const,
		fontSize: 14,
		tabSize: 2,
	};

	// 保存処理
	const handleSave = useCallback(async () => {
		try {
			setIsSaving(true);
			let savedNote: Note;

			if (note) {
				// 既存のノートを更新
				savedNote = await updateNote(note.id, {
					title,
					content,
					visibility,
				});
			} else {
				// 新規ノートを作成
				savedNote = await createNote(title, content, [], visibility);
			}

			onSave?.(savedNote);
			router.refresh();
		} catch (error) {
			console.error("Failed to save note:", error);
			// TODO: エラー処理
		} finally {
			setIsSaving(false);
		}
	}, [title, content, visibility, note, onSave, router]);

	// ショートカットキーの設定
	useEffect(() => {
		const handleKeyDown = (e: KeyboardEvent) => {
			if ((e.metaKey || e.ctrlKey) && e.key === "s") {
				e.preventDefault();
				handleSave();
			}
		};

		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleSave]);

	return (
		<div className="flex flex-col h-full gap-4 p-4">
			<div className="flex items-center gap-4">
				<div className="flex-1">
					<Label htmlFor="title">タイトル</Label>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="ノートのタイトルを入力..."
					/>
				</div>
				<div className="w-40">
					<Label htmlFor="visibility">公開設定</Label>
					<Select
						value={visibility}
						onValueChange={(value: "private" | "shared" | "public") =>
							setVisibility(value)
						}
					>
						<SelectTrigger id="visibility">
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="private">非公開</SelectItem>
							<SelectItem value="shared">共有</SelectItem>
							<SelectItem value="public">公開</SelectItem>
						</SelectContent>
					</Select>
				</div>
				<Button
					onClick={handleSave}
					disabled={isSaving || !title || !content}
					className="self-end"
				>
					{isSaving ? "保存中..." : "保存"}
				</Button>
			</div>

			<div className="flex-1 min-h-0">
				<Editor
					height="100%"
					defaultLanguage="markdown"
					value={content}
					onChange={(value: string | undefined) => setContent(value || "")}
					options={editorOptions}
					theme="vs-dark"
				/>
			</div>
		</div>
	);
}
