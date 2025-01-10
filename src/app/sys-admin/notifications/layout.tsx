import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NotificationsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="container mx-auto py-6">
			<div className="flex flex-col gap-6">
				<div>
					<h1 className="text-2xl font-bold">通知管理</h1>
					<p className="text-muted-foreground">
						通知カテゴリ、テンプレート、通知の作成と管理を行います。
					</p>
				</div>
				<Tabs defaultValue="categories" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="categories">カテゴリ</TabsTrigger>
						<TabsTrigger value="templates">テンプレート</TabsTrigger>
						<TabsTrigger value="notifications">通知作成</TabsTrigger>
					</TabsList>
					{children}
				</Tabs>
			</div>
		</div>
	);
}
