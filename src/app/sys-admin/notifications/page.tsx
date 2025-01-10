import { Suspense } from "react";
import { TabsContent } from "@/components/ui/tabs";
import CategoryList from "./_components/CategoryList";
import TemplateList from "./_components/TemplateList";
import NotificationForm from "./_components/NotificationForm";
import {
	fetchCategories,
	fetchTemplates,
} from "@/app/_actions/notifications/queries";

export default async function NotificationsPage() {
	// 初期データをフェッチ
	const initialCategories = await fetchCategories();
	const initialTemplates = await fetchTemplates();

	return (
		<>
			<TabsContent value="categories">
				<Suspense fallback={<div>Loading...</div>}>
					<CategoryList initialCategories={initialCategories} />
				</Suspense>
			</TabsContent>
			<TabsContent value="templates">
				<Suspense fallback={<div>Loading...</div>}>
					<TemplateList
						initialTemplates={initialTemplates}
						initialCategories={initialCategories}
					/>
				</Suspense>
			</TabsContent>
			<TabsContent value="notifications">
				<Suspense fallback={<div>Loading...</div>}>
					<NotificationForm
						initialCategories={initialCategories}
						initialTemplates={initialTemplates}
					/>
				</Suspense>
			</TabsContent>
		</>
	);
}
