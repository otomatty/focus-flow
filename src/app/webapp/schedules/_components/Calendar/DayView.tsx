"use client";

import { addHours, format } from "date-fns";
import { ja } from "date-fns/locale";
import type { Schedule } from "../../types";

interface DayViewProps {
	currentDate: Date;
	schedules: Schedule[];
}

export function DayView({ currentDate, schedules }: DayViewProps) {
	const hours = Array.from({ length: 24 }, (_, i) => i);

	const getSchedulesForHour = (hour: number) => {
		return schedules.filter((schedule) => {
			if (schedule.isAllDay) return false;
			const scheduleStart = new Date(
				`${schedule.startDate}T${schedule.startTime || "00:00"}`,
			);
			const scheduleEnd = new Date(
				`${schedule.endDate}T${schedule.endTime || "23:59"}`,
			);
			const hourStart = addHours(
				new Date(currentDate.setHours(hour, 0, 0, 0)),
				0,
			);
			const hourEnd = addHours(hourStart, 1);
			return scheduleStart < hourEnd && scheduleEnd >= hourStart;
		});
	};

	const getAllDaySchedules = () => {
		return schedules.filter((schedule) => {
			return (
				schedule.isAllDay &&
				new Date(schedule.startDate) <= currentDate &&
				new Date(schedule.endDate) >= currentDate
			);
		});
	};

	return (
		<div className="flex flex-col h-full">
			{/* 終日予定の表示 */}
			<div className="border-b p-2">
				<div className="text-sm font-medium text-muted-foreground mb-2">
					終日
				</div>
				<div className="space-y-1">
					{getAllDaySchedules().map((schedule) => (
						<div
							key={schedule.id}
							className="text-sm p-2 rounded bg-primary/10"
							title={schedule.title}
						>
							{schedule.title}
						</div>
					))}
				</div>
			</div>

			{/* 時間ごとの予定表示 */}
			<div className="flex-1 overflow-auto">
				<div className="grid grid-cols-[100px_1fr] gap-1">
					{hours.map((hour) => {
						const hourSchedules = getSchedulesForHour(hour);
						return (
							<div key={hour} className="contents">
								<div className="p-2 text-sm text-right text-muted-foreground border-b">
									{`${hour.toString().padStart(2, "0")}:00`}
								</div>
								<div className="p-2 border-b">
									{hourSchedules.map((schedule) => (
										<div
											key={schedule.id}
											className="text-sm p-2 rounded bg-primary/10 mb-1"
											title={schedule.title}
										>
											<div className="font-medium">
												{schedule.startTime?.slice(0, 5)} -{" "}
												{schedule.endTime?.slice(0, 5)}
											</div>
											<div>{schedule.title}</div>
										</div>
									))}
								</div>
							</div>
						);
					})}
				</div>
			</div>
		</div>
	);
}
