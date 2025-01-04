export type RankTier =
	| "ROOKIE"
	| "BRONZE"
	| "SILVER"
	| "GOLD"
	| "PLATINUM"
	| "DIAMOND"
	| "ORICHALCUM"
	| "ADAMANTITE";

export interface RankDefinition {
	name: string;
	description: string;
	requiredScore: number;
	color: string;
	benefits: string[];
}

export interface RankScore {
	// 基本スコア（40%）
	focusScore: {
		completionRate: number; // 計画達成率（15%）
		maxFocusTime: number; // 最長集中時間（15%）
		interruptionRate: number; // 中断率の低さ（10%）
	};

	// 継続スコア（30%）
	consistencyScore: {
		weeklyStreak: number; // 週間ストリーク（15%）
		loginStreak: number; // ログイン継続（5%）
		goalCompletion: number; // 目標達成率（10%）
	};

	// 成長スコア（30%）
	growthScore: {
		weeklyGrowth: number; // 週間成長率（10%）
		skillProgress: number; // スキル習得度（10%）
		challengeCount: number; // チャレンジ達成（10%）
	};
}

export interface UserRank {
	currentTier: RankTier;
	currentScore: number;
	seasonHighestTier: RankTier;
	seasonHighestScore: number;
	rankScores: RankScore;
	nextRankProgress: number;
	isEligibleForPromotion: boolean;
}

export interface SeasonInfo {
	seasonNumber: number;
	startDate: Date;
	endDate: Date;
	remainingDays: number;
}

export interface RankHistory {
	season: number;
	finalTier: RankTier;
	finalScore: number;
	highestTier: RankTier;
	highestScore: number;
}

export interface RankChallenge {
	id: string;
	title: string;
	description: string;
	requiredScore: number;
	deadline: Date;
	rewards: {
		score: number;
		benefits: string[];
	};
}

export const RANK_DEFINITIONS: Record<RankTier, RankDefinition> = {
	ROOKIE: {
		name: "ルーキー",
		description: "集中の道を歩み始めたばかりの挑戦者",
		requiredScore: 0,
		color: "text-gray-400",
		benefits: ["基本フレーム"],
	},
	BRONZE: {
		name: "ブロンズ",
		description: "基本的な集中力を身につけた実践者",
		requiredScore: 1000,
		color: "text-amber-600",
		benefits: ["ブロンズフレーム"],
	},
	SILVER: {
		name: "シルバー",
		description: "安定した集中力を持つ熟練者",
		requiredScore: 2000,
		color: "text-slate-400",
		benefits: ["シルバーフレーム"],
	},
	GOLD: {
		name: "ゴールド",
		description: "高度な集中力を操る達人",
		requiredScore: 3500,
		color: "text-yellow-400",
		benefits: ["ゴールドフレーム"],
	},
	PLATINUM: {
		name: "プラチナ",
		description: "卓越した集中力を持つエキスパート",
		requiredScore: 5000,
		color: "text-cyan-300",
		benefits: ["特別なプロフィールフレーム"],
	},
	DIAMOND: {
		name: "ダイアモンド",
		description: "究極の集中力を持つマスター",
		requiredScore: 7000,
		color: "text-blue-400",
		benefits: ["特別なプロフィールフレーム", "アバター特別装飾"],
	},
	ORICHALCUM: {
		name: "オリハルコン",
		description: "伝説の集中力を持つレジェンド",
		requiredScore: 10000,
		color: "text-emerald-400",
		benefits: ["特別なプロフィールフレーム", "カスタムエフェクト"],
	},
	ADAMANTITE: {
		name: "アダマンタイト",
		description: "神話となった不滅の集中力の持ち主",
		requiredScore: 15000,
		color: "text-purple-400",
		benefits: [
			"特別なプロフィールフレーム",
			"カスタムテーマ作成権限",
			"シーズン限定称号",
		],
	},
};
