export interface User {
	id: string;
	name: string;
	avatar: string;
	exp: number;
	level: number;
	streak: {
		current: number;
		best: number;
	};
	weeklyStats: {
		focusTime: number;
		completedTasks: number;
		earnedPoints: number;
		plannedSessions: number;
		completedSessions: number;
		lastActive: Date;
		streak: number;
		points: number;
		contribution: number;
		growth: number;
		bestFocusTime: number;
		achievementCount: number;
		mvpCount: number;
		specialContribution?: string;
	};
}

export interface Season {
	number: number;
	remainingDays: number;
	rank: {
		current: string;
		highest: string;
	};
	progress: {
		current: number;
		target: number;
	};
}
