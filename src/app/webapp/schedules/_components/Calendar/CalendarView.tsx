"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { MonthView } from "./MonthView";
import { WeekView } from "./WeekView";
import { DayView } from "./DayView";
import type { Schedule } from "../../types";

type ViewType = "month" | "week" | "day";

interface CalendarViewProps {
	schedules: Schedule[];
}

export function CalendarView({ schedules }: CalendarViewProps) {
	const [viewType, setViewType] = useState<ViewType>("month");
	const [currentDate, setCurrentDate] = useState(new Date());

	const handlePrevious = () => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			switch (viewType) {
				case "month":
					newDate.setMonth(prev.getMonth() - 1);
					break;
				case "week":
					newDate.setDate(prev.getDate() - 7);
					break;
				case "day":
					newDate.setDate(prev.getDate() - 1);
					break;
			}
			return newDate;
		});
	};

	const handleNext = () => {
		setCurrentDate((prev) => {
			const newDate = new Date(prev);
			switch (viewType) {
				case "month":
					newDate.setMonth(prev.getMonth() + 1);
					break;
				case "week":
					newDate.setDate(prev.getDate() + 7);
					break;
				case "day":
					newDate.setDate(prev.getDate() + 1);
					break;
			}
			return newDate;
		});
	};

	const handleToday = () => {
		setCurrentDate(new Date());
	};

	return (
		<Card className="p-4">
			<div className="flex justify-between items-center mb-4">
				<div className="flex items-center gap-2">
					<Button variant="outline" size="icon" onClick={handlePrevious}>
						<ChevronLeft className="h-4 w-4" />
					</Button>
					<Button variant="outline" size="icon" onClick={handleNext}>
						<ChevronRight className="h-4 w-4" />
					</Button>
					<Button variant="outline" onClick={handleToday}>
						今日
					</Button>
					<h2 className="text-lg font-semibold ml-4">
						{currentDate.toLocaleDateString("ja-JP", {
							year: "numeric",
							month: "long",
							day: viewType === "day" ? "numeric" : undefined,
						})}
					</h2>
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant={viewType === "month" ? "default" : "outline"}
						onClick={() => setViewType("month")}
					>
						月
					</Button>
					<Button
						variant={viewType === "week" ? "default" : "outline"}
						onClick={() => setViewType("week")}
					>
						週
					</Button>
					<Button
						variant={viewType === "day" ? "default" : "outline"}
						onClick={() => setViewType("day")}
					>
						日
					</Button>
				</div>
			</div>

			<div className="h-[600px] overflow-auto">
				{viewType === "month" && (
					<MonthView currentDate={currentDate} schedules={schedules} />
				)}
				{viewType === "week" && (
					<WeekView currentDate={currentDate} schedules={schedules} />
				)}
				{viewType === "day" && (
					<DayView currentDate={currentDate} schedules={schedules} />
				)}
			</div>
		</Card>
	);
}
