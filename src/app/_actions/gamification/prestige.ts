"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type UserPrestige =
	Database["ff_gamification"]["Tables"]["user_prestige"]["Row"];

/**
 * ユーザーのプレステージ情報を取得
 * @returns プレステージ情報
 */
export async function getUserPrestige(): Promise<UserPrestige> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("認証されていません");
	}

	const { data: prestige, error } = await supabase
		.schema("ff_gamification")
		.from("user_prestige")
		.select("*")
		.eq("user_id", user.id)
		.single();

	if (error) {
		throw new Error(`プレステージ情報の取得に失敗しました: ${error.message}`);
	}

	return prestige;
}

/**
 * プレステージレベルを上昇
 * @returns 更新されたプレステージ情報
 */
export async function incrementPrestige(): Promise<UserPrestige> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("認証されていません");
	}

	// トランザクションを使用して安全に更新
	const { data: prestige, error } = await supabase
		.schema("ff_gamification")
		.from("user_prestige")
		.upsert(
			{
				user_id: user.id,
				prestige_level: 1,
			},
			{
				onConflict: "user_id",
				ignoreDuplicates: false,
			},
		)
		.select()
		.single();

	if (error) {
		throw new Error(`プレステージの更新に失敗しました: ${error.message}`);
	}

	// レベルと経験値をリセット
	const { error: resetError } = await supabase
		.schema("ff_gamification")
		.from("user_levels")
		.upsert(
			{
				user_id: user.id,
				current_level: 1,
				current_exp: 0,
				total_exp: 0,
			},
			{
				onConflict: "user_id",
				ignoreDuplicates: false,
			},
		);

	if (resetError) {
		throw new Error(`レベルのリセットに失敗しました: ${resetError.message}`);
	}

	return prestige;
}

/**
 * 複数ユーザーのプレステージ情報を一括取得
 * @param userIds ユーザーIDの配列
 * @returns プレステージ情報の配列
 */
export async function getUserPrestiges(
	userIds: string[],
): Promise<UserPrestige[]> {
	const supabase = await createClient();
	const { data: prestiges, error } = await supabase
		.schema("ff_gamification")
		.from("user_prestige")
		.select("*")
		.in("user_id", userIds);

	if (error) {
		throw new Error(`プレステージ情報の取得に失敗しました: ${error.message}`);
	}

	return prestiges;
}

/**
 * プレステージレベルでユーザーをランク付け
 * @param params.limit 取得する上位ユーザー数
 * @param params.offset ページネーションのオフセット
 * @returns プレステージ情報の配列
 */
export async function getPrestigeRanking(params?: {
	limit?: number;
	offset?: number;
}): Promise<UserPrestige[]> {
	const supabase = await createClient();
	const { data: prestiges, error } = await supabase
		.schema("ff_gamification")
		.from("user_prestige")
		.select("*")
		.order("prestige_level", { ascending: false })
		.limit(params?.limit ?? 10)
		.range(
			params?.offset ?? 0,
			(params?.offset ?? 0) + (params?.limit ?? 10) - 1,
		);

	if (error) {
		throw new Error(
			`プレステージランキングの取得に失敗しました: ${error.message}`,
		);
	}

	return prestiges;
}
