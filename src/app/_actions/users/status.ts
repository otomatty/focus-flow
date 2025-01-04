import { createClient } from "@/lib/supabase/server";
import type { AccountStatus } from "./types";

export async function updateAccountStatus(
	userId: string,
	status: AccountStatus["status"],
	reason?: string,
) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.upsert(
			{
				user_id: userId,
				status,
				reason,
				changed_at: new Date().toISOString(),
			},
			{
				onConflict: "user_id",
			},
		);

	if (error) {
		throw new Error(`Failed to update account status: ${error.message}`);
	}
}

export async function getAccountStatus(userId: string): Promise<AccountStatus> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("account_statuses")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			// レコードが見つからない場合はデフォルト値を返す
			return {
				id: "",
				user_id: userId,
				status: "pending",
				reason: null,
				changed_by: null,
				changed_at: new Date().toISOString(),
				created_at: new Date().toISOString(),
				updated_at: new Date().toISOString(),
			};
		}
		throw new Error(`Failed to fetch account status: ${error.message}`);
	}

	return data as AccountStatus;
}
