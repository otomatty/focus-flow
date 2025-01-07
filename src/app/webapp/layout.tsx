import { AppHeader } from "@/app/webapp/_layouts/AppHeader";
import { AppSidebar } from "@/app/webapp/_layouts/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { getUserNotifications } from "@/app/_actions/notifications";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/_actions/users/profile";
import {
	getUserLevel,
	getLevelSettings,
} from "@/app/_actions/gamification/level";
import { redirect } from "next/navigation";
import { ClientProvider } from "@/app/webapp/_components/ClientProvider";

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

	try {
		// ユーザーデータの取得
		const [profile, level, levelSettings] = await Promise.all([
			getUserProfile(user.id),
			getUserLevel(),
			getLevelSettings(),
		]);

		if (!profile) {
			console.error("[WebAppLayout] Profile not found");
			redirect("/auth/login");
		}

		// 現在のレベルの設定を取得
		const levelSetting = levelSettings.find(
			(setting) => setting.level === level.current_level,
		);

		// 次のレベルまでの必要経験値を計算
		const nextLevelExp = levelSetting
			? level.current_exp + levelSetting.required_exp
			: null;

		// ユーザーデータを準備
		const userData = {
			profile,
			level,
			nextLevelExp,
			levelSetting,
		};

		// 通知データの取得
		const notifications = await getUserNotifications({
			userId: user.id,
			limit: 5,
			status: "sent",
		});

		return (
			<ClientProvider userData={userData} notifications={notifications}>
				<SidebarProvider>
					<AppSidebar />
					<SidebarInset>
						<AppHeader />
						<main>{children}</main>
					</SidebarInset>
				</SidebarProvider>
			</ClientProvider>
		);
	} catch (error) {
		console.error("[WebAppLayout] Error:", error);
		redirect("/auth/login");
	}
}
