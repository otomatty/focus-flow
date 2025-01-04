import { PageHeader } from "@/components/custom/PageHeader";
import { MetricsGrid } from "./_components/MetricsGrid";
import { ActivityTimeline } from "./_components/ActivityTimeline";
import { QuickActions } from "./_components/QuickActions";
import { NotificationCenter } from "./_components/NotificationCenter";
import { PerformanceCharts } from "./_components/PerformanceCharts";
import { SystemResources } from "./_components/SystemResources";
import {
	getSystemMetrics,
	getUserActivityData,
	getTaskCompletionData,
	getApiRequestData,
	getSystemActivity,
} from "@/app/_actions/admin/metrics";
import { getAdminNotifications } from "@/app/_actions/admin/notifications";

export default async function SystemAdminPage() {
	// データの取得
	const [
		metrics,
		userActivity,
		taskCompletion,
		apiRequests,
		systemActivity,
		notifications,
	] = await Promise.all([
		getSystemMetrics(),
		getUserActivityData(),
		getTaskCompletionData(),
		getApiRequestData(),
		getSystemActivity(),
		getAdminNotifications(),
	]);

	return (
		<div className="space-y-6">
			<PageHeader
				title="システム管理ダッシュボード"
				description="システムの状態を監視し、管理機能にアクセスできます。"
				backHref="/webapp"
			/>

			<MetricsGrid metrics={metrics} />

			<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
				<div className="col-span-full lg:col-span-4">
					<ActivityTimeline events={systemActivity} />
				</div>
				<div className="col-span-full lg:col-span-3">
					<NotificationCenter notifications={notifications} />
				</div>
			</div>

			<QuickActions />

			<div className="grid gap-6 md:grid-cols-2">
				<SystemResources
					resourceMetrics={metrics.resources}
					apiRequestData={apiRequests}
				/>
				<PerformanceCharts
					userActivityData={userActivity}
					taskCompletionData={taskCompletion}
				/>
			</div>
		</div>
	);
}
