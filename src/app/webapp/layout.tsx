import { AppHeader } from "@/app/webapp/_layouts/AppHeader";
import { AppSidebar } from "@/app/webapp/_layouts/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserNotifications } from "@/app/_actions/notifications";
import { createStore } from "jotai/vanilla";
import { notificationsAtom } from "@/stores/notifications";
import { userDataAtom } from "@/stores/userDataAtom";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/_actions/users/profile";
import {
	getUserLevel,
	getLevelSettings,
} from "@/app/_actions/gamification/level";
import { redirect } from "next/navigation";

const store = createStore();

interface WebAppLayoutProps {
	children: React.ReactNode;
}

export default async function WebAppLayout({ children }: WebAppLayoutProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		redirect("/auth/login");
	}

	// ユーザーデータの取得
	const [profile, level, levelSettings] = await Promise.all([
		getUserProfile(user.id),
		getUserLevel(),
		getLevelSettings(),
	]);

	// 現在のレベルの設定を取得
	const levelSetting = levelSettings.find(
		(setting) => setting.level === level.current_level,
	);

	// 次のレベルまでの必要経験値を計算
	const nextLevelExp = levelSetting
		? level.current_exp + levelSetting.required_exp
		: null;

	// ユーザーデータをセット
	store.set(userDataAtom, {
		profile,
		level,
		nextLevelExp,
		levelSetting,
	});

	// 通知データの取得と設定
	const notifications = await getUserNotifications({
		userId: user.id,
		limit: 5,
		status: "sent",
	});
	store.set(notificationsAtom, notifications);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<main>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
