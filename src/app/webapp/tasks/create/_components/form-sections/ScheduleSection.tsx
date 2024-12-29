import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { DateTimePicker } from "@/components/ui/date-time-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TaskFormData } from "@/types/task";

type Props = {
	control: Control<TaskFormData>;
};

export function ScheduleSection({ control }: Props) {
	return (
		<div className="space-y-4">
			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					control={control}
					name="start_date"
					render={({ field }) => (
						<FormItem>
							<FormLabel>開始日時</FormLabel>
							<FormControl>
								<DateTimePicker value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
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
								<DateTimePicker value={field.value} onChange={field.onChange} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>

			<FormField
				control={control}
				name="estimated_duration"
				render={({ field }) => (
					<FormItem>
						<FormLabel>予想所要時間</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="例: PT2H30M（2時間30分）"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

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
						name="recurring_pattern.type"
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
								<FormMessage />
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
								<FormMessage />
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
										value={field.value}
										onChange={field.onChange}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			)}
		</div>
	);
}
