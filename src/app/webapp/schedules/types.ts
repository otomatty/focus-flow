export type ScheduleCategory = "work" | "personal" | "habit" | "other";
export type SchedulePriority = "high" | "medium" | "low";
export type RecurrencePattern = "none" | "daily" | "weekly" | "monthly";

export interface Schedule {
	id: string;
	title: string;
	description?: string;
	startDate: string; // YYYY-MM-DD
	startTime: string; // HH:mm
	endDate: string; // YYYY-MM-DD
	endTime: string; // HH:mm
	category: ScheduleCategory;
	priority: SchedulePriority;
	isAllDay: boolean;
	recurrence: {
		pattern: RecurrencePattern;
		interval?: number; // 繰り返し間隔（例：2週間ごと）
		endDate?: string; // 繰り返し終了日
		daysOfWeek?: number[]; // 週次繰り返しの場合の曜日（0-6）
	};
	reminder?: {
		enabled: boolean;
		minutesBefore: number;
	};
	color?: string; // カラーコード
	metadata?: {
		projectId?: string; // 関連プロジェクト
		taskId?: string; // 関連タスク
		habitId?: string; // 関連習慣
	};
}

// スケジュール作成用の型（IDなし）
export type CreateScheduleInput = Omit<Schedule, "id">;

// スケジュール更新用の型（すべてオプショナル）
export type UpdateScheduleInput = Partial<Omit<Schedule, "id">>;

// スケジュールの検索/フィルタリング用の型
export interface ScheduleFilters {
	startDate?: string;
	endDate?: string;
	categories?: ScheduleCategory[];
	priorities?: SchedulePriority[];
	searchQuery?: string;
}

// カレンダービューの表示期間
export interface CalendarViewRange {
	startDate: string;
	endDate: string;
	viewType: "month" | "week" | "day";
}
