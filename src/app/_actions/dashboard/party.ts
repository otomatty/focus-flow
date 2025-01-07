"use server";

import { createClient } from "@/lib/supabase/server";
import { getParty } from "@/app/_actions/social/parties";
import { getUserStatus } from "@/app/_actions/users/status";
import { getWeeklyStats } from "@/app/_actions/users/statistics";
import { getUserProfile } from "@/app/_actions/users/profile";
import { getUserLevels } from "@/app/_actions/gamification/level";
import {
	getAvailableCpuAccounts,
	generateCpuWeeklyStats,
} from "@/app/_actions/social/cpu-accounts";

interface PartyMemberData {
	id: string;
	name: string;
	level: number;
	avatarUrl: string | null;
	status: "online" | "focusing" | "offline";
	weeklyStats: {
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
	};
}

interface WeeklyPartyData {
	members: PartyMemberData[];
	goal: {
		currentSessions: number;
		targetSessions: number;
		deadline: Date;
	};
}

export async function getWeeklyPartyData(): Promise<WeeklyPartyData> {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// ユーザーのアクティブなパーティーを取得
	const { data: activeParties, error: partiesError } = await supabase
		.schema("ff_social")
		.from("parties")
		.select("*, party_members!inner(*)")
		.eq("is_active", true)
		.eq("party_members.user_id", user.id)
		.single();

	if (partiesError) {
		if (partiesError.code === "PGRST116") {
			// パーティーが見つからない場合は空のデータを返す
			return {
				members: [],
				goal: {
					currentSessions: 0,
					targetSessions: 20,
					deadline: new Date(new Date().setDate(new Date().getDate() + 7)),
				},
			};
		}
		throw new Error(`Failed to fetch active party: ${partiesError.message}`);
	}

	// 全メンバーのレベル情報を一括取得
	const memberLevels = await getUserLevels(
		activeParties.party_members.map((member) => member.user_id),
	);

	const memberPromises = activeParties.party_members.map(async (member) => {
		const [status, profile, weeklyStats] = await Promise.all([
			getUserStatus(member.user_id),
			getUserProfile(member.user_id),
			getWeeklyStats(member.user_id),
		]);

		// メンバーのレベル情報を取得
		const levelInfo = memberLevels.find(
			(level) => level.user_id === member.user_id,
		);

		// ステータスをマッピング
		let memberStatus: PartyMemberData["status"] = "offline";
		if (status.presence_status === "online") {
			memberStatus = status.focus_status === "focusing" ? "focusing" : "online";
		}

		return {
			id: member.user_id,
			name: profile.displayName || "Unknown",
			level: levelInfo?.current_level || 1,
			avatarUrl: profile.profileImage,
			status: memberStatus,
			weeklyStats: {
				focusTime: weeklyStats.focusTime,
				achievementCount: weeklyStats.completedTasks,
				points: Math.floor(
					weeklyStats.focusTime * 10 + weeklyStats.completedTasks * 5,
				),
				streak: weeklyStats.taskCompletionRate,
				growth: Math.floor(weeklyStats.taskCompletionRate),
				lastActive: new Date(status.last_activity_at || new Date()),
				completedSessions: Math.floor(weeklyStats.focusTime / 25), // 25分を1セッションとして計算
				plannedSessions: 20, // 仮の目標値
				contribution: Math.floor(weeklyStats.taskCompletionRate / 10),
				bestFocusTime: Math.floor(weeklyStats.avgSessionLength),
			},
		};
	});

	let members = await Promise.all(memberPromises);

	// メンバーが4人未満の場合、CPUアカウントで補完
	if (members.length < 4) {
		const cpuCount = 4 - members.length;
		const cpuAccounts = await getAvailableCpuAccounts({ count: cpuCount });

		const cpuMembers = await Promise.all(
			cpuAccounts.map(async (cpu) => ({
				id: cpu.id,
				name: cpu.name,
				level: cpu.level,
				avatarUrl: cpu.avatarUrl,
				status: "online" as const,
				weeklyStats: await generateCpuWeeklyStats({ cpuAccount: cpu }),
			})),
		);

		members = [...members, ...cpuMembers];
	}

	// パーティー目標を計算
	const totalCompletedSessions = members.reduce(
		(sum, member) => sum + member.weeklyStats.completedSessions,
		0,
	);

	return {
		members,
		goal: {
			currentSessions: totalCompletedSessions,
			targetSessions: members.length * 20, // メンバー1人あたり20セッションを目標とする
			deadline: new Date(new Date().setDate(new Date().getDate() + 7)), // 1週間後
		},
	};
}
