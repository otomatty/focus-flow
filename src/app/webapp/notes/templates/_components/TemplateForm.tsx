"use client";

import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import MDEditor from "@uiw/react-md-editor";
import { createTemplate, updateTemplate } from "@/app/_actions/notes/service";
import type { NoteTemplate } from "@/app/_actions/notes/service";

interface TemplateFormProps {
	template?: NoteTemplate;
	mode: "create" | "edit";
}

export function TemplateForm({ template, mode }: TemplateFormProps) {
	const router = useRouter();
	const [title, setTitle] = useState(template?.title || "");
	const [content, setContent] = useState(template?.content || "");
	const [templateType, setTemplateType] = useState<
		NoteTemplate["templateType"]
	>(template?.templateType || "goal_reflection");
	const [isDefault, setIsDefault] = useState(template?.isDefault || false);
	const [isSubmitting, setIsSubmitting] = useState(false);

	const handleSubmit = useCallback(async () => {
		try {
			setIsSubmitting(true);
			if (mode === "create") {
				await createTemplate({
					title,
					content,
					templateType,
					isDefault,
					metadata: {},
				});
			} else {
				if (!template) return;
				await updateTemplate(template.id, {
					title,
					content,
					templateType,
					isDefault,
					metadata: template.metadata,
				});
			}
			router.push("/webapp/notes/templates");
			router.refresh();
		} catch (error) {
			console.error("Error saving template:", error);
		} finally {
			setIsSubmitting(false);
		}
	}, [mode, template, title, content, templateType, isDefault, router]);

	return (
		<Card className="p-6 space-y-6">
			<div className="space-y-4">
				<div>
					<Label htmlFor="title">タイトル</Label>
					<Input
						id="title"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						placeholder="テンプレートのタイトル"
					/>
				</div>

				<div>
					<Label>テンプレートタイプ</Label>
					<Select
						value={templateType}
						onValueChange={(v) =>
							setTemplateType(v as NoteTemplate["templateType"])
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="goal_reflection">目標の振り返り</SelectItem>
							<SelectItem value="milestone_reflection">
								マイルストーンの記録
							</SelectItem>
							<SelectItem value="habit_reflection">習慣の振り返り</SelectItem>
							<SelectItem value="habit_log">習慣の実施記録</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div>
					<Label>テンプレート内容</Label>
					<div data-color-mode="light">
						<MDEditor
							value={content}
							onChange={(value) => setContent(value || "")}
							preview="edit"
							height={400}
						/>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<Switch
						id="isDefault"
						checked={isDefault}
						onCheckedChange={setIsDefault}
					/>
					<Label htmlFor="isDefault">デフォルトテンプレートとして設定</Label>
				</div>

				<div className="flex justify-end space-x-2">
					<Button
						variant="outline"
						onClick={() => router.push("/webapp/notes/templates")}
					>
						キャンセル
					</Button>
					<Button onClick={handleSubmit} disabled={isSubmitting}>
						{mode === "create" ? "作成" : "更新"}
					</Button>
				</div>
			</div>
		</Card>
	);
}
