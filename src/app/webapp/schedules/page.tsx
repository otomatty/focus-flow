"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Filter } from "lucide-react";
import type { Schedule, CalendarViewRange } from "./types";

export default function SchedulesPage() {
	const [viewRange, setViewRange] = useState<CalendarViewRange>({
		startDate: new Date().toISOString().split("T")[0],
		endDate: new Date().toISOString().split("T")[0],
		viewType: "week",
	});

	const [schedules, setSchedules] = useState<Schedule[]>([]);

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">スケジュール</h1>
				<div className="flex items-center gap-2">
					<Button size="sm" variant="outline">
						<Filter className="h-4 w-4 mr-2" />
						フィルター
					</Button>
					<Button size="sm" variant="outline">
						<Calendar className="h-4 w-4 mr-2" />
						表示切替
					</Button>
					<Button size="sm">
						<Plus className="h-4 w-4 mr-2" />
						新規作成
					</Button>
				</div>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
				<Card className="p-4">
					{/* TODO: カレンダービューまたはスケジュール一覧を実装 */}
					<div className="h-[600px] flex items-center justify-center text-muted-foreground">
						カレンダービューをここに実装
					</div>
				</Card>

				<div className="space-y-4">
					<Card className="p-4">
						<h2 className="text-lg font-semibold mb-4">今日の予定</h2>
						<div className="space-y-2">
							{/* TODO: 今日の予定一覧を実装 */}
							<div className="text-sm text-muted-foreground">
								予定はありません
							</div>
						</div>
					</Card>

					<Card className="p-4">
						<h2 className="text-lg font-semibold mb-4">今後の予定</h2>
						<div className="space-y-2">
							{/* TODO: 今後の予定一覧を実装 */}
							<div className="text-sm text-muted-foreground">
								予定はありません
							</div>
						</div>
					</Card>
				</div>
			</div>
		</div>
	);
}
