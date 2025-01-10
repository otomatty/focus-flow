"use client";

import { useMemo } from "react";
import {
	format,
	startOfWeek,
	endOfWeek,
	eachDayOfInterval,
	isToday,
	addHours,
	isSameDay,
} from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Schedule } from "../../types";

interface WeekViewProps {
	currentDate: Date;
	schedules: Schedule[];
}

export function WeekView({ currentDate, schedules }: WeekViewProps) {
	const days = useMemo(() => {
		const start = startOfWeek(currentDate, { locale: ja });
		const end = endOfWeek(currentDate, { locale: ja });
		return eachDayOfInterval({ start, end });
	}, [currentDate]);

	const hours = Array.from({ length: 24 }, (_, i) => i);

	const getSchedulesForDayAndHour = (date: Date, hour: number) => {
		return schedules.filter((schedule) => {
			if (schedule.isAllDay) return false;
			const scheduleStart = new Date(
				`${schedule.startDate}T${schedule.startTime || "00:00"}`,
			);
			const scheduleEnd = new Date(
				`${schedule.endDate}T${schedule.endTime || "23:59"}`,
			);
			const hourStart = addHours(new Date(date.setHours(hour, 0, 0, 0)), 0);
			const hourEnd = addHours(hourStart, 1);
			return (
				isSameDay(date, scheduleStart) &&
				scheduleStart < hourEnd &&
				scheduleEnd >= hourStart
			);
		});
	};

	const getAllDaySchedules = (date: Date) => {
		return schedules.filter((schedule) => {
			return (
				schedule.isAllDay &&
				new Date(schedule.startDate) <= date &&
				new Date(schedule.endDate) >= date
			);
		});
	};

	return (
		<div className="flex flex-col h-full">
			{/* 終日予定の表示 */}
			<div className="border-b">
				<div className="grid grid-cols-8 gap-1">
					<div className="p-2 text-sm font-medium text-muted-foreground">
						終日
					</div>
					{days.map((day) => {
						const allDaySchedules = getAllDaySchedules(day);
						return (
							<div
								key={day.toISOString()}
								className={cn("p-2 border-l", isToday(day) && "bg-accent/50")}
							>
								{allDaySchedules.map((schedule) => (
									<div
										key={schedule.id}
										className="text-xs p-1 mb-1 rounded bg-primary/10 truncate"
										title={schedule.title}
									>
										{schedule.title}
									</div>
								))}
							</div>
						);
					})}
				</div>
			</div>

			{/* 時間ごとの予定表示 */}
			<div className="flex-1 overflow-auto">
				<div className="grid grid-cols-8 gap-1">
					{/* 時間列 */}
					<div className="space-y-1">
						{hours.map((hour) => (
							<div
								key={hour}
								className="h-12 p-2 text-xs text-right text-muted-foreground"
							>
								{`${hour.toString().padStart(2, "0")}:00`}
							</div>
						))}
					</div>

					{/* 各日の時間ごとの予定 */}
					{days.map((day) => (
						<div key={day.toISOString()} className="space-y-1">
							{hours.map((hour) => {
								const hourSchedules = getSchedulesForDayAndHour(day, hour);
								return (
									<div
										key={hour}
										className={cn(
											"h-12 p-1 border-l",
											isToday(day) && "bg-accent/50",
										)}
									>
										{hourSchedules.map((schedule) => (
											<div
												key={schedule.id}
												className="text-xs p-1 rounded bg-primary/10 truncate"
												title={schedule.title}
											>
												{schedule.title}
											</div>
										))}
									</div>
								);
							})}
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
