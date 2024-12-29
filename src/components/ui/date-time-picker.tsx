"use client";

import * as React from "react";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { TimeField } from "@/components/ui/time-field";

interface DateTimePickerProps {
	value?: Date;
	onChange?: (date: Date | undefined) => void;
}

export function DateTimePicker({ value, onChange }: DateTimePickerProps) {
	const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
		value,
	);
	const [selectedTime, setSelectedTime] = React.useState<string>(
		value ? format(value, "HH:mm") : "00:00",
	);

	// 日付と時刻が変更されたときに親コンポーネントに通知
	React.useEffect(() => {
		if (selectedDate) {
			const [hours, minutes] = selectedTime.split(":").map(Number);
			const newDate = new Date(selectedDate);
			newDate.setHours(hours);
			newDate.setMinutes(minutes);
			onChange?.(newDate);
		} else {
			onChange?.(undefined);
		}
	}, [selectedDate, selectedTime, onChange]);

	return (
		<Popover>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"w-full justify-start text-left font-normal",
						!value && "text-muted-foreground",
					)}
				>
					<CalendarIcon className="mr-2 h-4 w-4" />
					{value ? format(value, "yyyy/MM/dd HH:mm") : "日時を選択"}
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-auto p-0" align="start">
				<Calendar
					mode="single"
					selected={selectedDate}
					onSelect={setSelectedDate}
					initialFocus
				/>
				<div className="p-3 border-t">
					<TimeField
						value={selectedTime}
						onChange={(value) => setSelectedTime(value)}
					/>
				</div>
			</PopoverContent>
		</Popover>
	);
}
