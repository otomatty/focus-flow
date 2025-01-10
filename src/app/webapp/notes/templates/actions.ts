"use server";

import { createClient } from "@/lib/supabase/server";
import {
	getTemplates as getTemplatesService,
	getTemplatesByType as getTemplatesByTypeService,
	createNoteFromTemplate as createNoteFromTemplateService,
} from "@/app/_actions/notes/service";
import type { NoteTemplate } from "@/app/_actions/notes/service";

export async function getTemplates() {
	return getTemplatesService();
}

export async function getTemplatesByType(type: NoteTemplate["templateType"]) {
	return getTemplatesByTypeService(type);
}

export async function createNoteFromTemplate(templateId: string) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const note = await createNoteFromTemplateService(templateId, user.id);
	return note;
}
