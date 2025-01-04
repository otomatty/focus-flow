"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Switch } from "@/components/ui/switch";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import type { Control } from "react-hook-form";
import type { StandardTaskFormData } from "@/types/task";

interface DetailsSectionProps {
	control: Control<StandardTaskFormData>;
}

export function DetailsSection({ control }: DetailsSectionProps) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="is_recurring"
				render={({ field }) => (
					<FormItem className="flex items-center justify-between rounded-lg border p-4">
						<div className="space-y-0.5">
							<FormLabel>繰り返し</FormLabel>
						</div>
						<FormControl>
							<Switch checked={field.value} onCheckedChange={field.onChange} />
						</FormControl>
					</FormItem>
				)}
			/>

			{control._formValues.is_recurring && (
				<div className="space-y-4">
					<FormField
						control={control}
						name="recurring_pattern.frequency"
						render={({ field }) => (
							<FormItem>
								<FormLabel>繰り返しパターン</FormLabel>
								<Select
									onValueChange={field.onChange}
									defaultValue={field.value}
								>
									<FormControl>
										<SelectTrigger>
											<SelectValue placeholder="繰り返しパターンを選択" />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value="daily">毎日</SelectItem>
										<SelectItem value="weekly">毎週</SelectItem>
										<SelectItem value="monthly">毎月</SelectItem>
									</SelectContent>
								</Select>
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="recurring_pattern.interval"
						render={({ field }) => (
							<FormItem>
								<FormLabel>間隔</FormLabel>
								<FormControl>
									<Input
										type="number"
										min={1}
										{...field}
										onChange={(e) =>
											field.onChange(Number.parseInt(e.target.value))
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>

					<FormField
						control={control}
						name="recurring_pattern.end_date"
						render={({ field }) => (
							<FormItem>
								<FormLabel>繰り返し終了日</FormLabel>
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
			)}
		</div>
	);
}
