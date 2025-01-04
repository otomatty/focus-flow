"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { Control } from "react-hook-form";
import type { StandardTaskFormData } from "@/types/task";

interface ScheduleSectionProps {
	control: Control<StandardTaskFormData>;
}

export function ScheduleSection({ control }: ScheduleSectionProps) {
	return (
		<div className="grid gap-4">
			<FormField
				control={control}
				name="start_date"
				render={({ field }) => (
					<FormItem>
						<FormLabel>開始日時</FormLabel>
						<FormControl>
							<DateTimePicker
								value={field.value ? new Date(field.value) : undefined}
								onChange={(date) =>
									field.onChange(date ? date.toISOString() : undefined)
								}
							/>
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="due_date"
				render={({ field }) => (
					<FormItem>
						<FormLabel>期限日時</FormLabel>
						<FormControl>
							<DateTimePicker
								value={field.value ? new Date(field.value) : undefined}
								onChange={(date) =>
									field.onChange(date ? date.toISOString() : undefined)
								}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
