"use server";

import { createClient } from "@/lib/supabase/server";
import type { CpuAccount } from "@/types/dashboard";
import { randomUUID } from "node:crypto";

/**
 * 利用可能なCPUアカウントを取得
 * @param params.count - 取得するCPUアカウントの数
 * @returns CPUアカウントの配列
 */
export async function getAvailableCpuAccounts(params: {
	count: number;
}): Promise<CpuAccount[]> {
	const supabase = await createClient();

	const { data: cpuAccounts, error } = await supabase
		.schema("ff_social")
		.from("cpu_accounts")
		.select("*")
		.limit(params.count);

	if (error) {
		throw new Error(`Failed to fetch CPU accounts: ${error.message}`);
	}

	return cpuAccounts.map((account) => ({
		id: account.id,
		name: account.name,
		level: account.level,
		avatarUrl: account.avatar_url,
		personality: account.personality as
			| "supportive"
			| "competitive"
			| "analytical"
			| "creative",
		baseStats: {
			focusTime: account.base_focus_time,
			achievementRate: account.base_achievement_rate,
			sessionCompletion: account.base_session_completion,
			consistency: account.base_consistency,
		},
	}));
}

/**
 * CPUアカウントの週間統計データを生成
 * @param params.cpuAccount - CPUアカウント情報
 * @returns 週間統計データ
 */
export async function generateCpuWeeklyStats(params: {
	cpuAccount: CpuAccount;
}): Promise<{
	focusTime: number;
	achievementCount: number;
	points: number;
	streak: number;
	growth: number;
	lastActive: Date;
	completedSessions: number;
	plannedSessions: number;
	contribution: number;
	bestFocusTime: number;
}> {
	const { cpuAccount } = params;
	const { baseStats } = cpuAccount;

	// ランダム性を加えつつ、基本統計値を基にデータを生成
	const randomFactor = () => 0.9 + Math.random() * 0.2; // 0.9-1.1の範囲でランダム値を生成

	const focusTime = Math.floor(baseStats.focusTime * 60 * 7 * randomFactor()); // 週間のフォーカス時間（分）
	const completedSessions = Math.floor(focusTime / 25); // 25分を1セッションとして計算
	const plannedSessions = Math.floor(
		completedSessions / baseStats.sessionCompletion,
	);

	return {
		focusTime,
		achievementCount: Math.floor(
			completedSessions * baseStats.achievementRate * randomFactor(),
		),
		points: Math.floor(
			focusTime * 10 + completedSessions * baseStats.achievementRate * 5,
		),
		streak: Math.floor(7 * baseStats.consistency * randomFactor()),
		growth: Math.floor(baseStats.consistency * 100 * randomFactor()),
		lastActive: new Date(Date.now() - Math.floor(Math.random() * 3600000)), // 最近1時間以内のランダムな時間
		completedSessions,
		plannedSessions,
		contribution: Math.floor(baseStats.achievementRate * 100 * randomFactor()),
		bestFocusTime: Math.floor(45 * randomFactor()), // 25-45分の範囲でランダム
	};
}
