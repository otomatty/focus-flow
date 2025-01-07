import type { Metadata } from "next";
import { ProfileForm } from "@/components/custom/profile/ProfileForm";
import { StatisticsCard } from "./_components/StatisticsCard";
import { BadgesList } from "./_components/BadgesList";
import { ActivityTimeline } from "./_components/ActivityTimeline";
import { getUserStatistics } from "@/app/_actions/users/statistics";
import { getUserBadges } from "@/app/_actions/gamification/user-badges";
import {
	getActiveQuests,
	getQuestHistory,
} from "@/app/_actions/gamification/quests";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/_actions/users/user-profile";
import {
	calculateLevelInfo,
	getUserLevel,
} from "@/app/_actions/gamification/level";

export const metadata: Metadata = {
	title: "プロフィール - Focus Flow",
	description: "ユーザープロフィールの設定と管理",
};

export default async function ProfilePage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const [statistics, badges, activeQuests, questHistory, profile, userLevel] =
		await Promise.all([
			getUserStatistics(user.id),
			getUserBadges(user.id),
			getActiveQuests(user.id),
			getQuestHistory(user.id, 5),
			getUserProfile(user.id),
			getUserLevel(),
		]);

	const levelInfo = await calculateLevelInfo(userLevel.total_exp);

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
		<div className="container mx-auto p-6 min-h-screen bg-gradient-to-b from-background to-background/80">
			<div className="max-w-7xl mx-auto space-y-8">
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
					{/* メインコンテンツ：プロフィール情報 */}
					<div className="lg:col-span-2">
						<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm">
							<div className="p-6">
								<h2 className="text-2xl font-bold mb-6 text-primary">
									冒険者プロフィール
								</h2>
								<ProfileForm initialProfile={profile} />
							</div>
						</div>
					</div>

					{/* サイドバー：統計情報とバッジ */}
					<div className="space-y-8">
						<StatisticsCard statistics={formattedStats} />
						<BadgesList badges={formattedBadges} />
						<ActivityTimeline activities={activities} />
					</div>
				</div>
			</div>
		</div>
	);
}
