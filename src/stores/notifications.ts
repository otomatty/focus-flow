import { atom } from "jotai";
import type { Database } from "@/types/supabase";

// 通知の型定義
type Notification =
	Database["ff_notifications"]["Tables"]["notifications"]["Row"];

// 通知一覧を管理するatom
export const notificationsAtom = atom<Notification[]>([]);

// 通知の読み込み状態を管理するatom
export const notificationsLoadingAtom = atom(false);

// 未読通知数を計算する派生atom
export const unreadNotificationsCountAtom = atom((get) => {
	const notifications = get(notificationsAtom);
	return notifications.filter((notification) => !notification.read_at).length;
});

// 通知の種類に応じたスタイルを管理するatom
export const notificationStylesAtom = atom({
	info: "border-blue-500/50",
	warning: "border-yellow-500/50",
	error: "border-red-500/50",
	success: "border-green-500/50",
});
