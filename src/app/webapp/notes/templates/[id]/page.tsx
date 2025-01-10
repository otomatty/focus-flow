"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { TemplateForm } from "../_components/TemplateForm";
import { createClient } from "@/lib/supabase/client";
import type { NoteTemplate } from "@/app/_actions/notes/service";

interface TemplatePageProps {
	params: {
		id: string;
	};
}

export default function TemplatePage({ params }: TemplatePageProps) {
	const [template, setTemplate] = useState<NoteTemplate | null>(null);
	const router = useRouter();

	useEffect(() => {
		const fetchTemplate = async () => {
			const supabase = createClient();
			const { data, error } = await supabase
				.schema("ff_notes")
				.from("note_templates")
				.select("*")
				.eq("id", params.id)
				.single();

			if (error || !data) {
				console.error("Error fetching template:", error);
				router.push("/webapp/notes/templates");
				return;
			}

			setTemplate({
				id: data.id,
				title: data.title,
				content: data.content,
				templateType: data.template_type as NoteTemplate["templateType"],
				metadata: data.metadata as Record<string, unknown>,
				isDefault: data.is_default || false,
				createdAt: data.created_at || new Date().toISOString(),
				updatedAt: data.updated_at || new Date().toISOString(),
			});
		};

		fetchTemplate();
	}, [params.id, router]);

	if (!template) {
		return <div>Loading...</div>;
	}

	return (
		<div className="container mx-auto p-4 space-y-4">
			<h1 className="text-2xl font-bold">テンプレートを編集</h1>
			<TemplateForm mode="edit" template={template} />
		</div>
	);
}
