"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WeeklySchedule() {
	const days = ["日", "月", "火", "水", "木", "金", "土"];

	return (
		<Card className="p-4">
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">週間スケジュール</h2>
					<div className="flex gap-2">
						<Button size="sm" variant="outline">
							前の週
						</Button>
						<Button size="sm" variant="outline">
							次の週
						</Button>
					</div>
				</div>

				<div className="grid grid-cols-7 gap-2">
					{days.map((day) => (
						<Button
							key={day}
							variant="ghost"
							className="h-auto py-2 flex flex-col items-center"
						>
							<span className="text-sm text-muted-foreground">{day}</span>
							<span className="text-lg font-medium">1</span>
						</Button>
					))}
				</div>
			</div>
		</Card>
	);
}
