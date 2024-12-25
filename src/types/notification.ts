export type NotificationCategory =
	| "trading" // 取引関連
	| "task" // タスク関連
	| "system" // システム通知
	| "message" // メッセージ
	| "approval"; // 承認依頼

export interface Notification {
	id: string;
	title: string;
	message: string;
	timestamp: Date;
	isRead: boolean;
	type: "info" | "warning" | "error" | "success";
	category: NotificationCategory;
	link?: string; // 通知に関連するページへのリンク
}
