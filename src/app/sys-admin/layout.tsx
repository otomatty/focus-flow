import { redirect } from "next/navigation";
import { checkIsSystemAdmin } from "@/app/_actions/auth";
import { AdminHeader } from "./_layouts/AdminHeader";
import { AdminSidebar } from "./_layouts/AdminSidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function SystemAdminLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const isAdmin = await checkIsSystemAdmin();

	if (!isAdmin) {
		redirect("/");
	}

	return (
		<SidebarProvider>
			<AdminSidebar />
			<div className="flex flex-1 flex-col">
				<AdminHeader />
				<main className="flex-1 overflow-auto p-6">{children}</main>
			</div>
		</SidebarProvider>
	);
}
