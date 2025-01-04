import type { WeeklyPartyCardProps } from "@/types/dashboard";

export const samplePartyData: WeeklyPartyCardProps = {
	members: [
		{
			id: "1",
			name: "田中太郎",
			avatarUrl: "/avatars/member1.png",
			level: 15,
			weeklyStats: {
				plannedSessions: 20,
				completedSessions: 15,
				focusTime: 18000,
				lastActive: new Date(Date.now() - 1000 * 60 * 30), // 30分前
				streak: 5,
				points: 1200,
				contribution: 85,
				growth: 25,
				bestFocusTime: 3600,
				achievementCount: 3,
			},
			status: "online",
		},
		{
			id: "2",
			name: "山田花子",
			avatarUrl: "/avatars/member2.png",
			level: 12,
			weeklyStats: {
				plannedSessions: 15,
				completedSessions: 12,
				focusTime: 14400,
				lastActive: new Date(Date.now() - 1000 * 60 * 5), // 5分前
				streak: 3,
				points: 950,
				contribution: 75,
				growth: 15,
				bestFocusTime: 2700,
				achievementCount: 2,
			},
			status: "focusing",
		},
		{
			id: "3",
			name: "鈴木一郎",
			avatarUrl: "/avatars/member3.png",
			level: 18,
			weeklyStats: {
				plannedSessions: 25,
				completedSessions: 20,
				focusTime: 21600,
				lastActive: new Date(Date.now() - 1000 * 60 * 120), // 2時間前
				streak: 7,
				points: 1500,
				contribution: 90,
				growth: 30,
				bestFocusTime: 4500,
				achievementCount: 4,
			},
			status: "offline",
		},
		{
			id: "4",
			name: "佐藤美咲",
			avatarUrl: "/avatars/member4.png",
			level: 10,
			weeklyStats: {
				plannedSessions: 12,
				completedSessions: 8,
				focusTime: 9000,
				lastActive: new Date(Date.now() - 1000 * 60 * 15), // 15分前
				streak: 2,
				points: 600,
				contribution: 65,
				growth: 20,
				bestFocusTime: 1800,
				achievementCount: 1,
			},
			status: "online",
		},
	],
	goal: {
		targetSessions: 72,
		currentSessions: 55,
		deadline: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3), // 3日後
	},
};
