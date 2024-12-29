"use client";

import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import type { TaskFormData } from "@/types/task";

type Props = {
	control: Control<TaskFormData>;
};

export function DetailsSection({ control }: Props) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="description"
				render={({ field }) => (
					<FormItem>
						<FormLabel>説明</FormLabel>
						<FormControl>
							<Textarea
								placeholder="タスクの詳細な説明を入力"
								className="min-h-[100px]"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="category"
				render={({ field }) => (
					<FormItem>
						<FormLabel>カテゴリ</FormLabel>
						<FormControl>
							<Input placeholder="カテゴリを入力" {...field} />
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="difficulty_level"
				render={({ field }) => (
					<FormItem>
						<FormLabel>難易度</FormLabel>
						<FormControl>
							<RadioGroup
								onValueChange={(value) => field.onChange(Number(value))}
								defaultValue={field.value?.toString()}
								className="flex space-x-4"
							>
								{[1, 2, 3, 4, 5].map((level) => (
									<FormItem key={level} className="flex items-center space-x-2">
										<FormControl>
											<RadioGroupItem value={level.toString()} />
										</FormControl>
										<FormLabel className="font-normal">{level}</FormLabel>
									</FormItem>
								))}
							</RadioGroup>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="tags"
				render={({ field }) => (
					<FormItem>
						<FormLabel>タグ</FormLabel>
						<FormControl>
							<div className="space-y-2">
								<Input
									placeholder="タグを入力してEnterで追加"
									onKeyDown={(e) => {
										if (e.key === "Enter") {
											e.preventDefault();
											const input = e.currentTarget;
											const value = input.value.trim();
											if (value && !field.value?.includes(value)) {
												field.onChange([...(field.value || []), value]);
												input.value = "";
											}
										}
									}}
								/>
								<div className="flex flex-wrap gap-2">
									{field.value?.map((tag) => (
										<Badge
											key={tag}
											variant="secondary"
											className="flex items-center gap-1"
										>
											{tag}
											<X
												className="h-3 w-3 cursor-pointer"
												onClick={() =>
													field.onChange(field.value?.filter((t) => t !== tag))
												}
											/>
										</Badge>
									))}
								</div>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
