"use client";

import { useMemo } from "react";
import {
	format,
	startOfMonth,
	endOfMonth,
	eachDayOfInterval,
	isSameMonth,
	isToday,
} from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Schedule } from "../../types";

interface MonthViewProps {
	currentDate: Date;
	schedules: Schedule[];
}

export function MonthView({ currentDate, schedules }: MonthViewProps) {
	const days = useMemo(() => {
		const start = startOfMonth(currentDate);
		const end = endOfMonth(currentDate);
		return eachDayOfInterval({ start, end });
	}, [currentDate]);

	const getSchedulesForDay = (date: Date) => {
		return schedules.filter((schedule) => {
			const scheduleStart = new Date(schedule.startDate);
			const scheduleEnd = new Date(schedule.endDate);
			return date >= scheduleStart && date <= scheduleEnd;
		});
	};

	return (
		<div className="grid grid-cols-7 gap-1">
			{/* 曜日の行 */}
			{["日", "月", "火", "水", "木", "金", "土"].map((day) => (
				<div
					key={day}
					className="p-2 text-center text-sm font-medium text-muted-foreground"
				>
					{day}
				</div>
			))}

			{/* 日付のグリッド */}
			{days.map((day, index) => {
				const daySchedules = getSchedulesForDay(day);
				const isCurrentMonth = isSameMonth(day, currentDate);
				const isCurrentDay = isToday(day);

				return (
					<div
						key={day.toISOString()}
						className={cn(
							"min-h-[100px] p-2 border",
							!isCurrentMonth && "bg-muted/50",
							isCurrentDay && "bg-accent/50",
						)}
					>
						<div className="text-sm font-medium">
							{format(day, "d", { locale: ja })}
						</div>
						<div className="mt-1 space-y-1">
							{daySchedules.map((schedule) => (
								<div
									key={schedule.id}
									className="text-xs p-1 rounded bg-primary/10 truncate"
									title={schedule.title}
								>
									{schedule.isAllDay ? (
										<span className="font-medium">{schedule.title}</span>
									) : (
										<>
											<span className="font-medium">
												{schedule.startTime?.slice(0, 5)}
											</span>{" "}
											{schedule.title}
										</>
									)}
								</div>
							))}
						</div>
					</div>
				);
			})}
		</div>
	);
}
