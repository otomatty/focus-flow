import type { Metadata } from "next";
import { ProfileForm } from "@/components/custom/profile/ProfileForm";
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
import { getUserStreaks } from "@/app/_actions/users/statistics";
import { Trophy, Clock, CheckCircle2, Target } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { ActivityHeatmap } from "./_components/ActivityHeatmap";

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

	const [
		statistics,
		streaks,
		badges,
		activeQuests,
		questHistory,
		profile,
		userLevel,
	] = await Promise.all([
		getUserStatistics(user.id),
		getUserStreaks(user.id),
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
		userId: user.id,
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
			currentLoginStreak: streaks.current,
			longestLoginStreak: streaks.best,
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
				{/* 統計情報 */}
				<div className="space-y-6">
					{/* 基本統計 */}
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
						{/* レベル情報 */}
						<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
							<div className="flex items-center gap-3 mb-3">
								<Trophy className="w-5 h-5 text-primary" />
								<h3 className="font-bold text-lg">レベル</h3>
							</div>
							<div className="space-y-2">
								<p className="text-2xl font-bold">
									{formattedStats.level.currentLevel}
								</p>
								<Progress
									value={formattedStats.level.progress * 100}
									className="h-2"
								/>
								<p className="text-sm text-muted-foreground">
									次のレベルまで:{" "}
									{formattedStats.level.nextLevelExp -
										formattedStats.level.currentExp}{" "}
									EXP
								</p>
							</div>
						</div>

						{/* フォーカス統計 */}
						<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
							<div className="flex items-center gap-3 mb-3">
								<Clock className="w-5 h-5 text-blue-500" />
								<h3 className="font-bold text-lg">フォーカス</h3>
							</div>
							<div className="space-y-2">
								<p className="text-2xl font-bold">
									{formattedStats.focusStats.totalSessions}
								</p>
								<p className="text-sm text-muted-foreground">総セッション数</p>
								<p className="text-sm">{formattedStats.focusStats.totalTime}</p>
							</div>
						</div>

						{/* タスク統計 */}
						<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
							<div className="flex items-center gap-3 mb-3">
								<CheckCircle2 className="w-5 h-5 text-emerald-500" />
								<h3 className="font-bold text-lg">タスク</h3>
							</div>
							<div className="space-y-2">
								<p className="text-2xl font-bold">
									{formattedStats.taskStats.completedTasks}/
									{formattedStats.taskStats.totalTasks}
								</p>
								<p className="text-sm text-muted-foreground">完了タスク</p>
								<p className="text-sm">
									{formattedStats.taskStats.completionRate}% 完了率
								</p>
							</div>
						</div>

						{/* ストリーク */}
						<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
							<div className="flex items-center gap-3 mb-3">
								<Target className="w-5 h-5 text-purple-500" />
								<h3 className="font-bold text-lg">ストリーク</h3>
							</div>
							<div className="space-y-2">
								<p className="text-2xl font-bold">
									{formattedStats.streaks.currentLoginStreak}日
								</p>
								<p className="text-sm text-muted-foreground">
									現在のストリーク
								</p>
								<p className="text-sm">
									最長: {formattedStats.streaks.longestLoginStreak}日
								</p>
							</div>
						</div>
					</div>

					{/* アクティビティヒートマップ */}
					<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
						<ActivityHeatmap userId={formattedStats.userId} />
					</div>
				</div>

				{/* プロフィール設定 */}
				<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm">
					<div className="p-6">
						<h2 className="text-2xl font-bold mb-6 text-primary">
							プロフィール設定
						</h2>
						<ProfileForm initialProfile={profile || {}} userId={user.id} />
					</div>
				</div>

				{/* バッジとアクティビティログ */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
						<BadgesList badges={formattedBadges} />
					</div>
					<div className="bg-card rounded-lg shadow-lg border border-border/50 backdrop-blur-sm p-6">
						<ActivityTimeline activities={activities} />
					</div>
				</div>
			</div>
		</div>
	);
}
