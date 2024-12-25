"use server";

import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";
import type { AuthError } from "@supabase/supabase-js";

export interface CallbackResponse {
	data: {
		user: User | null;
	};
	error?: {
		message: string;
		status: number;
	};
}

// コールバック処理
export async function handleAuthCallback(code: string) {
	try {
		const supabase = await createClient();
		const { data, error } = await supabase.auth.exchangeCodeForSession(code);

		if (error) throw error;
		if (!data.session) throw new Error("セッションの取得に失敗しました");

		return { data, error: null };
	} catch (error) {
		console.error("Auth callback error:", error);
		return {
			data: { session: null, user: null },
			error:
				error instanceof Error
					? ({ message: error.message } as AuthError)
					: ({ message: "認証コールバックの処理に失敗しました" } as AuthError),
		};
	}
}
