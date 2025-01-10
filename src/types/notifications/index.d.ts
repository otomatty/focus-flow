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

export interface NotificationCategory {
	id: string;
	name: string;
	display_name: string;
	description: string | null;
	icon: string | null;
	color: string | null;
	priority: number | null;
	is_active: boolean | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface NotificationTemplate {
	id: string;
	category_id: string;
	name: string;
	title_template: string;
	body_template: string;
	action_type: string | null;
	action_data: Json | null;
	priority: number | null;
	is_active: boolean | null;
	created_at: string | null;
	updated_at: string | null;
}

export interface NotificationPreference {
	id: string;
	user_id: string;
	category_id: string;
	email_enabled: boolean;
	push_enabled: boolean;
	in_app_enabled: boolean;
	quiet_hours: {
		enabled: boolean;
		start_time: string;
		end_time: string;
		timezone: string;
	};
	created_at: string | null;
	updated_at: string | null;
}

export interface DeliveryHistory {
	id: string;
	notification_id: string;
	delivery_type: "email" | "push" | "in_app";
	status: "success" | "failed";
	provider: string | null;
	provider_response: Json | null;
	error_message: string | null;
	created_at: string | null;
}
