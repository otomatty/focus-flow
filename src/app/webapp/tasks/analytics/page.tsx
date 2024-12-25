"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskStats } from "./_components/TaskStats";
import { TaskCompletionChart } from "./_components/TaskCompletionChart";
import { ExperienceGainChart } from "./_components/ExperienceGainChart";
import { SkillProgressChart } from "./_components/SkillProgressChart";
import { TimeManagementChart } from "./_components/TimeManagementChart";
import { AIInsights } from "./_components/AIInsights";

export default function TaskAnalyticsPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスク分析"
				description="タスクの完了率、経験値獲得、時間管理などの分析情報を確認できます。"
			/>
			<TaskStats />
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
				<TaskCompletionChart />
				<ExperienceGainChart />
				<SkillProgressChart />
				<TimeManagementChart />
			</div>
			<AIInsights />
		</div>
	);
}
