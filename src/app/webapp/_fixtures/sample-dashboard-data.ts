import type { RankTier } from "@/types/rank";
import type {
	Announcement,
	Quest,
	Task,
	Project,
	AnnouncementType,
	QuestRarity,
	TaskDifficulty,
} from "@/types/dashboard";

export const sampleDashboardData = {
	hero: {
		id: "user-1",
		name: "田中太郎",
		avatar: "/avatars/member1.png",
		focusPoints: 1200,
		streak: {
			current: 7,
			best: 14,
		},
		weeklyStats: {
			focusTime: 1260,
			completedTasks: 15,
			earnedPoints: 850,
		},
		rank: {
			currentTier: "GOLD" as RankTier,
			seasonHighestTier: "PLATINUM" as RankTier,
			seasonHighestScore: 5500,
		},
	},
	season: {
		number: 1,
		remainingDays: 75,
		rank: {
			current: "GOLD" as RankTier,
			highest: "PLATINUM" as RankTier,
		},
		progress: {
			current: 5500,
			target: 10000,
		},
	},
	announcements: [
		{
			id: "1",
			type: "contributor" as AnnouncementType,
			title: "開発メンバー募集中！",
			description:
				"Focus Flowの開発に参加してみませんか？UIデザイナーとフロントエンドエンジニアを募集しています。",
			badge: "緊急",
			action: {
				label: "詳細を見る",
				href: "/contribute",
			},
		},
		{
			id: "2",
			type: "promotion" as AnnouncementType,
			title: "新機能リリース予定",
			description:
				"来週、新しいフォーカスモードと統計機能がリリースされます。お楽しみに！",
			action: {
				label: "続きを読む",
				href: "/news/upcoming",
			},
		},
	] as Announcement[],
	quests: [
		{
			id: "1",
			title: "5回の集中セッションを完了",
			description: "25分間の集中を5回達成する",
			rarity: "rare" as const,
			progress: 3,
			maxProgress: 5,
			reward: 100,
			deadline: new Date(
				new Date().setDate(new Date().getDate() + 7),
			).toISOString(),
			requirements: [
				"25分間の集中セッションを完了",
				"セッション間に5分の休憩を取る",
				"集中時間中は通知をオフにする",
			],
			rewards: [
				{ type: "exp", value: "経験値", amount: 100 },
				{ type: "title", value: "集中の達人" },
			],
		},
		{
			id: "2",
			title: "3日連続ログイン",
			description: "3日間連続でアプリを使用する",
			rarity: "common" as QuestRarity,
			progress: 2,
			maxProgress: 3,
			reward: 50,
		},
		{
			id: "3",
			title: "週間目標の達成",
			description: "設定した週間目標を100%達成する",
			rarity: "epic" as QuestRarity,
			progress: 85,
			maxProgress: 100,
			reward: 200,
		},
	] as Quest[],
	tasks: [
		{
			id: "1",
			title: "ダッシュボードUIの実装",
			difficulty: "hard" as const,
			estimatedTime: 120,
			progress: 75,
			comboCount: 3,
			description:
				"ダッシュボードのメインUIコンポーネントを実装する。グラフ、統計、進捗表示を含む。",
			dueDate: new Date(
				new Date().setDate(new Date().getDate() + 2),
			).toISOString(),
			tags: ["フロントエンド", "UI/UX", "重要"],
			subtasks: [
				{ id: "s1", title: "基本レイアウトの作成", isCompleted: true },
				{ id: "s2", title: "データ連携の実装", isCompleted: false },
				{ id: "s3", title: "アニメーションの追加", isCompleted: false },
			],
		},
		{
			id: "2",
			title: "ドキュメントの作成",
			difficulty: "medium" as TaskDifficulty,
			estimatedTime: 60,
			progress: 30,
			comboCount: 1,
		},
		{
			id: "3",
			title: "バグ修正",
			difficulty: "easy" as TaskDifficulty,
			estimatedTime: 30,
			progress: 0,
			comboCount: 0,
		},
	] as Task[],
	projects: [
		{
			id: "1",
			title: "Focus Flowアプリ開発",
			progress: 65,
			milestones: [
				{
					id: "m1",
					title: "UI/UXデザイン",
					progress: 100,
					collaborators: [
						{
							id: "u1",
							name: "田中太郎",
							avatarUrl: "/avatars/member1.png",
						},
						{
							id: "u2",
							name: "山田花子",
							avatarUrl: "/avatars/member2.png",
						},
					],
					isCompleted: true,
				},
				{
					id: "m2",
					title: "フロントエンド実装",
					progress: 75,
					collaborators: [
						{
							id: "u1",
							name: "田中太郎",
							avatarUrl: "/avatars/member1.png",
						},
						{
							id: "u3",
							name: "鈴木一郎",
							avatarUrl: "/avatars/member3.png",
						},
					],
					isCompleted: false,
				},
				{
					id: "m3",
					title: "バックエンド実装",
					progress: 20,
					collaborators: [
						{
							id: "u4",
							name: "佐藤美咲",
							avatarUrl: "/avatars/member4.png",
						},
					],
					isCompleted: false,
				},
			],
		},
		{
			id: "2",
			title: "ドキュメント整備",
			progress: 40,
			milestones: [
				{
					id: "m4",
					title: "API仕様書",
					progress: 60,
					collaborators: [
						{
							id: "u1",
							name: "田中太郎",
							avatarUrl: "/avatars/member1.png",
						},
					],
					isCompleted: false,
				},
				{
					id: "m5",
					title: "ユーザーガイド",
					progress: 20,
					collaborators: [
						{
							id: "u2",
							name: "山田花子",
							avatarUrl: "/avatars/member2.png",
						},
					],
					isCompleted: false,
				},
			],
		},
	] as Project[],
	todayTasks: [
		{
			title: "プロジェクト計画書の作成",
			priority: "high" as const,
			dueTime: new Date(
				new Date().setHours(new Date().getHours() + 2),
			).toISOString(),
			description:
				"Q4のプロジェクト計画書を作成し、チームメンバーと共有する必要があります。主要な目標と予算配分を含めてください。",
			estimatedTime: 120,
			tags: ["書類作成", "プロジェクト管理", "重要"],
		},
		{
			title: "週次ミーティング",
			priority: "medium" as const,
			dueTime: new Date(new Date().setHours(14, 0, 0, 0)).toISOString(),
			description: "チームの進捗確認と次週の計画について話し合います。",
			estimatedTime: 60,
			tags: ["ミーティング", "チーム"],
		},
		{
			title: "デイリースクラム",
			priority: "high" as const,
			dueTime: new Date(new Date().setHours(10, 0, 0, 0)).toISOString(),
			description: "昨日の進捗、今日の予定、障害について共有します。",
			estimatedTime: 15,
			tags: ["ミーティング", "スクラム"],
		},
	],
	habits: [
		{
			id: "1",
			title: "朝の運動",
			description: "30分のストレッチと軽いエクササイズ",
			targetCount: 7,
			currentCount: 5,
			streak: 5,
			lastCompletedAt: new Date().toISOString(),
			category: "健康",
			startDate: new Date(
				new Date().setDate(new Date().getDate() - 30),
			).toISOString(),
			bestStreak: 14,
			completionHistory: Array.from({ length: 7 }).map((_, i) => ({
				date: new Date(
					new Date().setDate(new Date().getDate() - i),
				).toISOString(),
				completed: i < 5,
			})),
		},
		{
			id: "2",
			title: "瞑想",
			description: "10分間の集中瞑想",
			targetCount: 7,
			currentCount: 3,
			streak: 3,
			lastCompletedAt: new Date().toISOString(),
		},
		{
			id: "3",
			title: "読書",
			description: "就寝前の30分読書",
			targetCount: 7,
			currentCount: 2,
			streak: 0,
			lastCompletedAt: new Date(
				new Date().setDate(new Date().getDate() - 1),
			).toISOString(),
		},
	],
};
