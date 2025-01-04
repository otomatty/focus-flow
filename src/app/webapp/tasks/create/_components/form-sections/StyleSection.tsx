"use client";

import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { Control } from "react-hook-form";
import type { StandardTaskFormData } from "@/types/task";

interface StyleSectionProps {
	control: Control<StandardTaskFormData>;
}

export function StyleSection({ control }: StyleSectionProps) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="style.color"
				render={({ field }) => (
					<FormItem>
						<FormLabel>カラー</FormLabel>
						<FormControl>
							<Input type="color" {...field} value={field.value || "#808080"} />
						</FormControl>
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="style.icon"
				render={({ field }) => (
					<FormItem>
						<FormLabel>アイコン</FormLabel>
						<FormControl>
							<Input
								placeholder="アイコン名を入力"
								{...field}
								value={field.value || ""}
							/>
						</FormControl>
					</FormItem>
				)}
			/>
		</div>
	);
}
