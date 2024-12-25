"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { ArchivedTaskList } from "./_components/ArchivedTaskList";
import { ArchivedTaskFilters } from "./_components/ArchivedTaskFilters";
import { ArchivedTaskStats } from "./_components/ArchivedTaskStats";

export default function TaskArchivePage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスクアーカイブ"
				description="完了したタスクの履歴を確認できます。"
			/>
			<ArchivedTaskStats />
			<div className="flex flex-col gap-4">
				<ArchivedTaskFilters />
				<ArchivedTaskList />
			</div>
		</div>
	);
}
