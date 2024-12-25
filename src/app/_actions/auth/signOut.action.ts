"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export interface SignOutResponse {
	error?: {
		message: string;
		status: number;
	};
	success?: boolean;
}

export async function signOut(): Promise<SignOutResponse> {
	try {
		const supabase = await createClient();
		const { error } = await supabase.auth.signOut();

		if (error) {
			return {
				error: {
					message: "ログアウトに失敗しました",
					status: 400,
				},
			};
		}

		revalidatePath("/", "layout");
		return { success: true };
	} catch (error) {
		return {
			error: {
				message: "ログアウト処理中にエラーが発生しました",
				status: 500,
			},
		};
	}
}
