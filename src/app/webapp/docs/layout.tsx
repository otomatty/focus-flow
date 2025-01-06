import { generateNavigation } from "@/lib/docs/navigation";
import { getUserRoles } from "@/lib/docs/access-control";
import { ScrollArea } from "@/components/ui/scroll-area";
import { createClient } from "@/lib/supabase/server";

interface DocsLayoutProps {
	children: React.ReactNode;
}

export default async function DocsLayout({ children }: DocsLayoutProps) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		return null;
	}

	// ロケールは現在は固定で'ja'を使用
	const locale = "ja";
	const userRoles = await getUserRoles(user);
	const navigation = await generateNavigation(locale, userRoles);

	return (
		<div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-6 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
			<aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 md:sticky md:block">
				<ScrollArea className="h-full py-6 pr-6 lg:py-8">
					<nav className="flex flex-col space-y-2">
						{navigation.map((item) => (
							<a
								key={item.path}
								href={item.path}
								className="text-sm text-muted-foreground hover:text-foreground"
							>
								{item.title}
							</a>
						))}
					</nav>
				</ScrollArea>
			</aside>
			<main className="relative py-6 lg:gap-10 lg:py-8 xl:grid xl:grid-cols-[1fr_300px]">
				<div className="mx-auto w-full min-w-0">{children}</div>
			</main>
		</div>
	);
}
