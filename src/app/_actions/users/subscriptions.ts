"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";
import { z } from "zod";

type Plan = Database["ff_users"]["Tables"]["plans"]["Row"];
type UserSubscription =
	Database["ff_users"]["Tables"]["user_subscriptions"]["Row"];
type SubscriptionHistory =
	Database["ff_users"]["Tables"]["subscription_history"]["Row"];
type FeatureLimit = Database["ff_users"]["Tables"]["feature_limits"]["Row"];

// バリデーションスキーマ
const SubscriptionStatusSchema = z.enum([
	"active",
	"cancelled",
	"expired",
	"trial",
	"past_due",
]);

/**
 * 利用可能なプラン一覧を取得
 */
export async function getAvailablePlans(): Promise<Plan[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("plans")
		.select("*")
		.eq("is_active", true)
		.order("price_jpy");

	if (error) {
		throw new Error(`Failed to fetch plans: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの現在のプラン情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserPlan(userId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.rpc("get_user_plan", {
			p_user_id: userId,
		});

	if (error) {
		throw new Error(`Failed to fetch user plan: ${error.message}`);
	}

	return (
		data[0] || {
			plan_name: "free",
			plan_features: {},
			plan_limits: {},
			status: "active",
			trial_end: null,
			current_period_end: null,
		}
	);
}

/**
 * ユーザーのサブスクリプション情報を取得
 * @param userId - 対象ユーザーのID
 */
export async function getUserSubscription(
	userId: string,
): Promise<UserSubscription | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("user_subscriptions")
		.select("*")
		.eq("user_id", userId)
		.single();

	if (error) {
		if (error.code === "PGRST116") {
			return null;
		}
		throw new Error(`Failed to fetch subscription: ${error.message}`);
	}

	return data;
}

/**
 * サブスクリプションの更新
 * @param userId - 対象ユーザーのID
 * @param planId - プランのID
 * @param status - サブスクリプションのステータス
 */
export async function updateSubscription(
	userId: string,
	planId: string,
	status: z.infer<typeof SubscriptionStatusSchema>,
	metadata: Database["ff_users"]["Tables"]["user_subscriptions"]["Row"]["metadata"] = {},
) {
	try {
		const validatedStatus = SubscriptionStatusSchema.parse(status);
		const supabase = await createClient();

		const now = new Date();
		const periodEnd = new Date();
		periodEnd.setMonth(periodEnd.getMonth() + 1); // 1ヶ月後

		const { error } = await supabase
			.schema("ff_users")
			.from("user_subscriptions")
			.upsert(
				{
					user_id: userId,
					plan_id: planId,
					status: validatedStatus,
					current_period_start: now.toISOString(),
					current_period_end: periodEnd.toISOString(),
					metadata,
				},
				{
					onConflict: "user_id",
				},
			);

		if (error) {
			throw new Error(`Failed to update subscription: ${error.message}`);
		}

		// 履歴の記録
		await supabase.schema("ff_users").from("subscription_history").insert({
			user_id: userId,
			plan_id: planId,
			status: validatedStatus,
			period_start: now.toISOString(),
			period_end: periodEnd.toISOString(),
			change_type: "new",
			metadata,
		});

		return { error: null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			return {
				error: { message: "Invalid status", details: error.errors },
			};
		}
		return { error };
	}
}

/**
 * サブスクリプションのキャンセル
 * @param userId - 対象ユーザーのID
 */
export async function cancelSubscription(userId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_users")
		.from("user_subscriptions")
		.update({
			status: "cancelled",
			cancel_at_period_end: true,
		})
		.eq("user_id", userId);

	if (error) {
		throw new Error(`Failed to cancel subscription: ${error.message}`);
	}
}

/**
 * 機能制限のチェック
 * @param userId - 対象ユーザーのID
 * @param featureKey - チェックする機能のキー
 * @param currentCount - 現在の使用数（オプション）
 */
export async function checkFeatureLimit(
	userId: string,
	featureKey: string,
	currentCount?: number,
): Promise<boolean> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.rpc("check_feature_limit", {
			p_user_id: userId,
			p_feature_key: featureKey,
			p_current_count: currentCount,
		});

	if (error) {
		throw new Error(`Failed to check feature limit: ${error.message}`);
	}

	return data;
}

/**
 * サブスクリプション履歴の取得
 * @param userId - 対象ユーザーのID
 * @param limit - 取得する履歴の数
 */
export async function getSubscriptionHistory(
	userId: string,
	limit = 10,
): Promise<SubscriptionHistory[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("subscription_history")
		.select("*")
		.eq("user_id", userId)
		.order("created_at", { ascending: false })
		.limit(limit);

	if (error) {
		throw new Error(`Failed to fetch subscription history: ${error.message}`);
	}

	return data;
}

/**
 * 利用可能な機能制限一覧を取得
 */
export async function getFeatureLimits(): Promise<FeatureLimit[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_users")
		.from("feature_limits")
		.select("*")
		.eq("is_active", true)
		.order("feature_key");

	if (error) {
		throw new Error(`Failed to fetch feature limits: ${error.message}`);
	}

	return data;
}
