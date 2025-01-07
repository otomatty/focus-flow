import type { Json } from "@/types/supabase";

export interface Notification {
	id: string;
	user_id: string;
	category_id: string;
	template_id: string;
	title: string;
	body: string;
	action_type: string | null;
	action_data: Json;
	metadata: Json;
	read_at: string | null;
	expires_at: string | null;
	priority: number | null;

	status: "pending" | "sent" | "failed";
	delivery_attempts: Json;
	created_at: string | null;
	updated_at: string | null;
}
