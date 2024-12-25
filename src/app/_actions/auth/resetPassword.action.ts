"use server";

import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

// バリデーションスキーマ
const resetPasswordSchema = z.object({
	email: z.string().email("有効なメールアドレスを入力してください"),
});

const updatePasswordSchema = z.object({
	password: z.string().min(6, "パスワードは6文字以上である必要があります"),
});

export interface ResetPasswordResponse {
	error?: {
		message: string;
		status: number;
	};
	success?: boolean;
}

// パスワードリセットメール送信
export async function resetPassword(
	formData: FormData,
): Promise<ResetPasswordResponse> {
	const email = formData.get("email") as string;

	// バリデーション
	try {
		resetPasswordSchema.parse({ email });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: {
					message: error.errors[0].message,
					status: 400,
				},
			};
		}
	}

	try {
		const supabase = await createClient();
		const { error } = await supabase.auth.resetPasswordForEmail(email, {
			redirectTo: `${process.env.NEXT_PUBLIC_APP_URL}/auth/reset-password`,
		});

		if (error) {
			return {
				error: {
					message: "パスワードリセットメールの送信に失敗しました",
					status: 400,
				},
			};
		}

		return { success: true };
	} catch (error) {
		return {
			error: {
				message: "パスワードリセット処理中にエラーが発生しました",
				status: 500,
			},
		};
	}
}

// パスワード更新
export async function updatePassword(
	formData: FormData,
): Promise<ResetPasswordResponse> {
	const password = formData.get("password") as string;

	// バリデーション
	try {
		updatePasswordSchema.parse({ password });
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: {
					message: error.errors[0].message,
					status: 400,
				},
			};
		}
	}

	try {
		const supabase = await createClient();
		const { error } = await supabase.auth.updateUser({
			password,
		});

		if (error) {
			return {
				error: {
					message: "パスワードの更新に失敗しました",
					status: 400,
				},
			};
		}

		return { success: true };
	} catch (error) {
		return {
			error: {
				message: "パスワード更新処理中にエラーが発生しました",
				status: 500,
			},
		};
	}
}
