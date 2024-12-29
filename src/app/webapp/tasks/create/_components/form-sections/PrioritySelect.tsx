"use client";

import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { Rocket, Clock, Calendar } from "lucide-react";
import type { TaskFormData } from "@/types/task";

const priorities = [
	{
		value: "high",
		label: "最優先",
		description: "最優先で取り組む",
		icon: Rocket,
	},
	{
		value: "medium",
		label: "通常",
		description: "普通にやる",
		icon: Clock,
	},
	{
		value: "low",
		label: "低",
		description: "いつかやる",
		icon: Calendar,
	},
] as const;

type Props = {
	control: Control<TaskFormData>;
};

export function PrioritySelect({ control }: Props) {
	return (
		<FormField
			control={control}
			name="priority"
			render={({ field }) => (
				<FormItem>
					<FormLabel>優先度</FormLabel>
					<FormControl>
						<div className="grid grid-cols-3 gap-4">
							{priorities.map((priority) => {
								const Icon = priority.icon;
								return (
									<button
										key={priority.value}
										type="button"
										onClick={() => field.onChange(priority.value)}
										className={cn(
											"flex flex-col items-center gap-2 rounded-lg border-2 p-4 text-center transition-colors hover:bg-accent",
											field.value === priority.value
												? "border-primary bg-accent"
												: "border-muted",
										)}
									>
										<Icon className="h-6 w-6" />
										<div>
											<div className="font-medium">{priority.label}</div>
											<div className="text-sm text-muted-foreground">
												{priority.description}
											</div>
										</div>
									</button>
								);
							})}
						</div>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
}
