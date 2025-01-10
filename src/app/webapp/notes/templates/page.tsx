"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import type { NoteTemplate } from "@/app/_actions/notes/service";
import {
	getTemplates,
	getTemplatesByType,
	createNoteFromTemplate,
} from "./actions";

export default function TemplatesPage() {
	const [templates, setTemplates] = useState<NoteTemplate[]>([]);
	const [selectedType, setSelectedType] = useState<string>("");
	const router = useRouter();

	useEffect(() => {
		const fetchTemplates = async () => {
			try {
				const data = selectedType
					? await getTemplatesByType(
							selectedType as NoteTemplate["templateType"],
						)
					: await getTemplates();
				setTemplates(data);
			} catch (error) {
				console.error("Error fetching templates:", error);
			}
		};

		fetchTemplates();
	}, [selectedType]);

	const handleCreateNote = async (templateId: string) => {
		try {
			const note = await createNoteFromTemplate(templateId);
			router.push(`/webapp/notes/${note.id}`);
		} catch (error) {
			console.error("Error creating note from template:", error);
		}
	};

	return (
		<div className="container mx-auto p-4 space-y-4">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">ノートテンプレート</h1>
				<Button onClick={() => router.push("/webapp/notes/templates/new")}>
					<Plus className="h-4 w-4 mr-2" />
					新規テンプレート
				</Button>
			</div>

			<Select value={selectedType} onValueChange={setSelectedType}>
				<SelectTrigger>
					<SelectValue placeholder="テンプレートタイプを選択" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">すべて</SelectItem>
					<SelectItem value="goal_reflection">目標の振り返り</SelectItem>
					<SelectItem value="milestone_reflection">
						マイルストーンの記録
					</SelectItem>
					<SelectItem value="habit_reflection">習慣の振り返り</SelectItem>
					<SelectItem value="habit_log">習慣の実施記録</SelectItem>
				</SelectContent>
			</Select>

			<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
				{templates.map((template) => (
					<Card key={template.id}>
						<CardHeader>
							<CardTitle className="flex justify-between items-center">
								<span>{template.title}</span>
								{template.isDefault && (
									<span className="text-xs text-muted-foreground">
										デフォルト
									</span>
								)}
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								<div className="text-sm text-muted-foreground line-clamp-3">
									{template.content}
								</div>
								<div className="flex justify-between items-center">
									<Button
										variant="outline"
										onClick={() =>
											router.push(`/webapp/notes/templates/${template.id}`)
										}
									>
										編集
									</Button>
									<Button onClick={() => handleCreateNote(template.id)}>
										このテンプレートを使用
									</Button>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
