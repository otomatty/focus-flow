export type PriorityLevel = "high" | "medium" | "low";
export type RecurrencePattern = "daily" | "weekly" | "monthly";
export type SyncStatus = "synced" | "pending" | "failed";
export type VisibilityType = "private" | "public" | "followers";

export interface Schedule {
	id: string;
	userId: string;
	title: string;
	description?: string;
	startDate: string;
	startTime?: string;
	endDate: string;
	endTime?: string;
	isAllDay: boolean;
	categoryId: string;
	priority: PriorityLevel;
	colorId?: string;
	isGoogleSynced: boolean;
	googleEventData?: any;
	googleSyncError?: string;
	googleLastModified?: string;
	projectId?: string;
	taskId?: string;
	habitId?: string;
	createdAt: string;
	updatedAt: string;
}

export interface ScheduleCategory {
	id: string;
	userId: string;
	name: string;
	description?: string;
	colorId?: string;
	systemCategoryId?: string;
	isActive: boolean;
	sortOrder: number;
	createdAt: string;
	updatedAt: string;
}

export interface ColorPalette {
	id: string;
	name: string;
	colorCode: string;
	createdAt: string;
}
