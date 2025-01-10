import { redirect } from "next/navigation";
import { checkIsSystemAdmin } from "@/app/_actions/auth";
import { AdminHeader } from "./_layouts/AdminHeader";
import { AdminSidebar } from "./_layouts/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/_actions/users/profile";
import { ClientProvider } from "./_components/ClientProvider";

interface SystemAdminLayoutProps {
	children: React.ReactNode;
}

export default async function SystemAdminLayout({
	children,
}: SystemAdminLayoutProps) {
	const isAdmin = await checkIsSystemAdmin();

	if (!isAdmin) {
		redirect("/");
	}

	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		if (!user) {
			redirect("/auth/login");
		}

		// ユーザーデータの取得
		const profile = await getUserProfile(user.id);

		if (!profile) {
			console.error("[SystemAdminLayout] Profile not found");
			redirect("/auth/login");
		}

		// ユーザーデータを準備
		const userData = {
			profile,
		};

		return (
			<ClientProvider userData={userData}>
				<SidebarProvider>
					<AdminSidebar />
					<div className="flex flex-1 flex-col">
						<AdminHeader />
						<main className="flex-1 overflow-auto p-6">{children}</main>
					</div>
				</SidebarProvider>
			</ClientProvider>
		);
	} catch (error) {
		console.error("[SystemAdminLayout] Error:", error);
		redirect("/auth/login");
	}
}
