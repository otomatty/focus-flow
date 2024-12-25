"use client";

import { PageHeader } from "@/components/custom/PageHeader";
import { TaskCalendar } from "./_components/TaskCalendar";
import { TaskCalendarFilters } from "./_components/TaskCalendarFilters";
import { TaskCalendarSidebar } from "./_components/TaskCalendarSidebar";

export default function TaskCalendarPage() {
	return (
		<div className="flex flex-col gap-6">
			<PageHeader
				title="タスクカレンダー"
				description="カレンダー形式でタスクを管理できます。"
			/>
			<div className="flex gap-6">
				<div className="flex-1">
					<TaskCalendarFilters />
					<TaskCalendar />
				</div>
				<TaskCalendarSidebar />
			</div>
		</div>
	);
}
