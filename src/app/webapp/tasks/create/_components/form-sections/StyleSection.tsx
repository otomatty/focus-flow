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
import { Button } from "@/components/ui/button";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { Check, ChevronsUpDown } from "lucide-react";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import type { FormData } from "../CreateTaskForm";
import { useState } from "react";

const icons = [
	{ value: "task", label: "タスク" },
	{ value: "bug", label: "バグ" },
	{ value: "feature", label: "機能" },
	{ value: "improvement", label: "改善" },
	{ value: "documentation", label: "ドキュメント" },
	{ value: "research", label: "調査" },
	{ value: "meeting", label: "ミーティング" },
	{ value: "review", label: "レビュー" },
];

type Props = {
	control: Control<FormData>;
};

export function StyleSection({ control }: Props) {
	const [open, setOpen] = useState(false);
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="style.color"
				render={({ field }) => (
					<FormItem>
						<FormLabel>カラー</FormLabel>
						<FormControl>
							<div className="flex items-center gap-2">
								<Input type="color" className="h-10 w-20" {...field} />
								<Input
									type="text"
									placeholder="#000000"
									value={field.value}
									onChange={(e) => field.onChange(e.target.value)}
									className="flex-1"
								/>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="style.icon"
				render={({ field }) => (
					<FormItem>
						<FormLabel>アイコン</FormLabel>
						<Popover open={open} onOpenChange={setOpen}>
							<PopoverTrigger asChild>
								<FormControl>
									<Button
										variant="outline"
										aria-expanded={open}
										className={cn(
											"w-full justify-between",
											!field.value && "text-muted-foreground",
										)}
									>
										{field.value
											? icons.find((icon) => icon.value === field.value)?.label
											: "アイコンを選択"}
										<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
									</Button>
								</FormControl>
							</PopoverTrigger>
							<PopoverContent className="w-full p-0">
								<Command>
									<CommandInput placeholder="アイコンを検索..." />
									<CommandEmpty>アイコンが見つかりません</CommandEmpty>
									<CommandGroup>
										{icons.map((icon) => (
											<CommandItem
												key={icon.value}
												value={icon.value}
												onSelect={() => {
													field.onChange(icon.value);
												}}
											>
												<Check
													className={cn(
														"mr-2 h-4 w-4",
														icon.value === field.value
															? "opacity-100"
															: "opacity-0",
													)}
												/>
												{icon.label}
											</CommandItem>
										))}
									</CommandGroup>
								</Command>
							</PopoverContent>
						</Popover>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
