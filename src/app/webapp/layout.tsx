import { AppHeader } from "@/app/webapp/_layouts/AppHeader";
import { AppSidebar } from "@/app/webapp/_layouts/AppSidebar/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

interface WebAppLayoutProps {
	children: React.ReactNode;
}

export default function WebAppLayout({ children }: WebAppLayoutProps) {
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
