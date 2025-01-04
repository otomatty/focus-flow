"use client";

import { Card } from "@/components/ui/card";
import { type TimeTableSlot, timeToMinutes } from "./types";

interface Props {
	slots: TimeTableSlot[];
}

export function TimeGrid({ slots }: Props) {
	const hours = Array.from({ length: 24 }, (_, i) => i);
	const days = ["日", "月", "火", "水", "木", "金", "土"];

	// 時間枠に予定があるかチェックする関数
	const getSlotContent = (dayIndex: number, hour: number, minute: number) => {
		const currentTimeInMinutes = hour * 60 + minute;
		return slots.find((slot) => {
			const slotStart = timeToMinutes(slot.startTime);
			const slotEnd = timeToMinutes(slot.endTime);
			return (
				slot.dayIndex === dayIndex &&
				currentTimeInMinutes >= slotStart &&
				currentTimeInMinutes < slotEnd
			);
		});
	};

	// スロットの開始時間かどうかをチェックする関数
	const isSlotStart = (dayIndex: number, hour: number, minute: number) => {
		const timeString = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
		return slots.some(
			(slot) => slot.dayIndex === dayIndex && slot.startTime === timeString,
		);
	};

	return (
		<Card className="p-4 overflow-auto">
			<div className="min-w-[800px]">
				{/* ヘッダー（曜日） */}
				<div className="grid grid-cols-[60px,repeat(7,1fr)] border-b">
					<div className="text-sm text-muted-foreground p-2 border-r" />
					{days.map((day, index) => (
						<div
							key={day}
							className={`text-sm font-medium text-center p-2 border-r ${
								index === days.length - 1 ? "" : "border-r"
							}`}
						>
							{day}
						</div>
					))}
				</div>

				{/* 時間枠 */}
				<div>
					{hours.map((hour) => (
						<div key={hour}>
							{/* 00分の行 */}
							<div className="grid grid-cols-[60px,repeat(7,1fr)] group border-b">
								<div className="text-sm text-muted-foreground text-right p-2 border-r">
									{hour.toString().padStart(2, "0")}:00
								</div>
								{days.map((day, index) => {
									const slot = getSlotContent(index, hour, 0);
									const isStart = isSlotStart(index, hour, 0);
									return (
										<div
											key={`${day}-${hour}-00`}
											className={`h-8 hover:bg-accent/20 transition-colors cursor-pointer ${
												index === days.length - 1 ? "" : "border-r"
											} ${slot ? "bg-primary/10" : ""}`}
										>
											{slot && isStart && (
												<div className="px-2 py-1 text-sm truncate">
													{slot.title}
												</div>
											)}
										</div>
									);
								})}
							</div>
							{/* 30分の行 */}
							<div className="grid grid-cols-[60px,repeat(7,1fr)] group border-b">
								<div className="text-sm text-muted-foreground text-right p-2 border-r">
									{hour.toString().padStart(2, "0")}:30
								</div>
								{days.map((day, index) => {
									const slot = getSlotContent(index, hour, 30);
									const isStart = isSlotStart(index, hour, 30);
									return (
										<div
											key={`${day}-${hour}-30`}
											className={`h-8 hover:bg-accent/20 transition-colors cursor-pointer ${
												index === days.length - 1 ? "" : "border-r"
											} ${slot ? "bg-primary/10" : ""}`}
										>
											{slot && isStart && (
												<div className="px-2 py-1 text-sm truncate">
													{slot.title}
												</div>
											)}
										</div>
									);
								})}
							</div>
						</div>
					))}
				</div>
			</div>
		</Card>
	);
}
