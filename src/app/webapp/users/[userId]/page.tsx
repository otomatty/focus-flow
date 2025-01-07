import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/_actions/users/user-profile";
import { getUserStatistics } from "@/app/_actions/users/statistics";
import { getUserBadges } from "@/app/_actions/gamification/user-badges";
import {
	getActiveQuests,
	getQuestHistory,
} from "@/app/_actions/gamification/quests";
import {
	calculateLevelInfo,
	getUserLevel,
} from "@/app/_actions/gamification/level";
import { StatisticsCard } from "../../profile/_components/StatisticsCard";
import { BadgesList } from "../../profile/_components/BadgesList";
import { ActivityTimeline } from "../../profile/_components/ActivityTimeline";
import { UserProfileCard } from "./_components/UserProfileCard";
import {
	getFollowStats,
	getFollowStatus,
} from "@/app/_actions/social/relationships";

export async function generateMetadata({
	params,
}: {
	params: { userId: string };
}): Promise<Metadata> {
	const profile = await getUserProfile(params.userId);
	return {
		title: `${profile?.displayName || "ユーザー"} - Focus Flow`,
		description: `${profile?.displayName || "ユーザー"}のプロフィール`,
	};
}

export default async function UserProfilePage({
	params,
}: {
	params: { userId: string };
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	// 自分自身のプロフィールページへのアクセスの場合はリダイレクト
	if (user.id === params.userId) {
		redirect("/webapp/profile");
	}

	// 並列でデータを取得
	const [
		statistics,
		badges,
		activeQuests,
		questHistory,
		profile,
		userLevel,
		followStats,
		followStatus,
	] = await Promise.all([
		getUserStatistics(params.userId),
		getUserBadges(params.userId),
		getActiveQuests(params.userId),
		getQuestHistory(params.userId, 5),
		getUserProfile(params.userId),
		getUserLevel(),
		getFollowStats(params.userId),
		getFollowStatus(user.id, params.userId),
	]);

	if (!profile) {
		throw new Error("User not found");
	}

	const levelInfo = await calculateLevelInfo(userLevel.total_exp);

	// アクティビティを生成
	const activities = [
		...activeQuests.map((quest) => ({
			id: quest.id,
			type: "quest" as const,
			title: quest.quest.title,
			description: `クエスト開始: ${quest.quest.description}`,
			timestamp: new Date(quest.start_date),
			metadata: { questId: quest.quest.id },
		})),
		...questHistory.map((quest) => ({
			id: quest.id,
			type: "quest" as const,
			title: quest.quest.title,
			description: `クエスト完了: ${quest.quest.description}`,
			timestamp: quest.completed_at ? new Date(quest.completed_at) : new Date(),
			metadata: { questId: quest.quest.id },
		})),
		...badges.map((badge) => ({
			id: badge.id,
			type: "badge" as const,
			title: badge.badge.name,
			description: `バッジ獲得: ${badge.badge.description}`,
			timestamp: badge.acquired_at ? new Date(badge.acquired_at) : new Date(),
			metadata: { badgeId: badge.badge_id },
		})),
	].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

	const formattedStats = {
		focusStats: {
			totalSessions: statistics.total_focus_sessions,
			totalTime: String(statistics.total_focus_time),
			avgSessionLength: String(statistics.avg_session_length),
		},
		taskStats: {
			totalTasks: statistics.total_tasks,
			completedTasks: statistics.completed_tasks,
			completionRate: statistics.task_completion_rate,
		},
		streaks: {
			currentLoginStreak: statistics.current_login_streak,
			longestLoginStreak: statistics.longest_login_streak,
			currentFocusStreak: statistics.current_focus_streak,
			longestFocusStreak: statistics.longest_focus_streak,
		},
		level: levelInfo,
	};

	const formattedBadges = badges.map((badge) => ({
		id: badge.id,
		badge: {
			id: badge.badge.id,
			name: badge.badge.name,
			description: badge.badge.description,
			imageUrl: badge.badge.image_url || "",
		},
		acquired_at: badge.acquired_at || "",
	}));

	return (
		<div className="container mx-auto p-6 space-y-6">
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				{/* 左カラム：プロフィール情報 */}
				<div className="md:col-span-2">
					<UserProfileCard
						profile={profile}
						isFollowing={!!followStatus}
						followersCount={followStats.followers_count}
						followingCount={followStats.following_count}
					/>
				</div>

				{/* 右カラム：統計情報とバッジ */}
				<div className="space-y-6">
					<StatisticsCard statistics={formattedStats} />
					<BadgesList badges={formattedBadges} />
				</div>
			</div>

			{/* アクティビティタイムライン */}
			<ActivityTimeline activities={activities} />
		</div>
	);
}
