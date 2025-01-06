import { createClient } from "@/lib/supabase/server";
import { cookies } from "next/headers";
import {
	ApiKey,
	type ApiKeyInput,
	type ApiKeyResponse,
	type ApiProvider,
} from "@/types/api-keys";
import { encrypt, decrypt } from "@/lib/crypto";

// APIキーの保存
export async function saveApiKey(input: ApiKeyInput): Promise<ApiKeyResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return {
				success: false,
				message: "ユーザーが認証されていません",
			};
		}

		// APIキーの暗号化
		const encryptedKey = encrypt(input.apiKey);

		const { data, error } = await supabase
			.schema("ff_users")
			.from("api_keys")
			.upsert({
				user_id: user.id,
				provider: input.provider,
				encrypted_api_key: encryptedKey,
				is_active: true,
			})
			.select()
			.single();

		if (error) throw error;

		return {
			success: true,
			message: "APIキーが保存されました",
			data: {
				id: data.id,
				userId: data.user_id,
				provider: data.provider as ApiProvider,
				isActive: data.is_active,
				createdAt: data.created_at,
				updatedAt: data.updated_at,
			},
		};
	} catch (error) {
		console.error("APIキーの保存に失敗しました:", error);
		return {
			success: false,
			message: "APIキーの保存に失敗しました",
		};
	}
}

// APIキーの取得
export async function getApiKey(provider: ApiProvider): Promise<string | null> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) return null;

		const { data, error } = await supabase
			.schema("ff_users")
			.from("api_keys")
			.select("encrypted_api_key")
			.eq("user_id", user.id)
			.eq("provider", provider)
			.eq("is_active", true)
			.single();

		if (error || !data) return null;

		return decrypt(data.encrypted_api_key);
	} catch (error) {
		console.error("APIキーの取得に失敗しました:", error);
		return null;
	}
}

// APIキーの削除
export async function deleteApiKey(
	provider: ApiProvider,
): Promise<ApiKeyResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return {
				success: false,
				message: "ユーザーが認証されていません",
			};
		}

		const { error } = await supabase
			.schema("ff_users")
			.from("api_keys")
			.delete()
			.eq("user_id", user.id)
			.eq("provider", provider);

		if (error) throw error;

		return {
			success: true,
			message: "APIキーが削除されました",
		};
	} catch (error) {
		console.error("APIキーの削除に失敗しました:", error);
		return {
			success: false,
			message: "APIキーの削除に失敗しました",
		};
	}
}

// APIキーの有効/無効切り替え
export async function toggleApiKey(
	provider: ApiProvider,
	isActive: boolean,
): Promise<ApiKeyResponse> {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			return {
				success: false,
				message: "ユーザーが認証されていません",
			};
		}

		const { data, error } = await supabase
			.schema("ff_users")
			.from("api_keys")
			.update({ is_active: isActive })
			.eq("user_id", user.id)
			.eq("provider", provider)
			.select()
			.single();

		if (error) throw error;

		return {
			success: true,
			message: `APIキーが${isActive ? "有効" : "無効"}になりました`,
			data: {
				id: data.id,
				userId: data.user_id,
				provider: data.provider as ApiProvider,
				isActive: data.is_active,
				createdAt: data.created_at,
				updatedAt: data.updated_at,
			},
		};
	} catch (error) {
		console.error("APIキーの状態変更に失敗しました:", error);
		return {
			success: false,
			message: "APIキーの状態変更に失敗しました",
		};
	}
}
