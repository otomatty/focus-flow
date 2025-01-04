"use client";

import { TimeGrid } from "./_components/TimeGrid";
import { TemplateEditor } from "./_components/TemplateEditor";
import { ScheduleControls } from "./_components/ScheduleControls";
import type { ScheduleTemplate, TimeTableSlot } from "./_components/types";
import { timeToMinutes } from "./_components/types";
import { useState } from "react";

export default function TimeTablePage() {
	const [slots, setSlots] = useState<TimeTableSlot[]>([]);

	// 時間枠が重複しているかチェックする関数
	const isTimeOverlapping = (
		slot1: TimeTableSlot,
		slot2: TimeTableSlot,
	): boolean => {
		if (slot1.dayIndex !== slot2.dayIndex) return false;

		const start1 = timeToMinutes(slot1.startTime);
		const end1 = timeToMinutes(slot1.endTime);
		const start2 = timeToMinutes(slot2.startTime);
		const end2 = timeToMinutes(slot2.endTime);

		return (
			(start1 >= start2 && start1 < end2) ||
			(end1 > start2 && end1 <= end2) ||
			(start1 <= start2 && end1 >= end2)
		);
	};

	const handleApplyTemplate = (template: ScheduleTemplate) => {
		// テンプレートから新しい予定を生成
		const newTemplateSlots = template.applyTo.days.flatMap((dayIndex) =>
			template.slots.map((slot) => ({
				...slot,
				id: `${dayIndex}-${slot.id}`,
				dayIndex,
			})),
		);

		// 既存の予定と新しい予定を結合
		const updatedSlots = slots.filter(
			(existingSlot) =>
				// 新しい予定と重複する既存の予定を除外
				!newTemplateSlots.some((newSlot) =>
					isTimeOverlapping(existingSlot, newSlot),
				),
		);

		setSlots([...updatedSlots, ...newTemplateSlots]);
	};

	return (
		<div className="container mx-auto p-6 space-y-8">
			<div className="flex justify-between items-center">
				<h1 className="text-2xl font-bold">タイムテーブル</h1>
				<ScheduleControls />
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
				<TimeGrid slots={slots} />
				<TemplateEditor onApplyTemplate={handleApplyTemplate} />
			</div>
		</div>
	);
}
