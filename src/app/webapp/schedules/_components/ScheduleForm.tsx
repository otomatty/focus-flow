"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import type { Schedule } from "../types";
import { useUpdateActivity } from "@/hooks/useUpdateActivity";

const formSchema = z.object({
	title: z.string().min(1, "必須目です"),
	description: z.string().optional(),
	startDate: z.date(),
	startTime: z.string().optional(),
	endDate: z.date(),
	endTime: z.string().optional(),
	isAllDay: z.boolean(),
	categoryId: z.string(),
	priority: z.enum(["high", "medium", "low"]),
	colorId: z.string().optional(),
	projectId: z.string().optional(),
	taskId: z.string().optional(),
	habitId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ScheduleFormProps {
	onSubmit: (
		data: Omit<
			Schedule,
			| "id"
			| "userId"
			| "createdAt"
			| "updatedAt"
			| "isGoogleSynced"
			| "googleEventData"
			| "googleSyncError"
			| "googleLastModified"
		>,
	) => Promise<void>;
	isSubmitting: boolean;
	defaultValues?: Partial<FormData>;
}

export function ScheduleForm({
	onSubmit,
	isSubmitting,
	defaultValues,
}: ScheduleFormProps) {
	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			title: "",
			description: "",
			startDate: new Date(),
			endDate: new Date(),
			isAllDay: false,
			categoryId: "work",
			priority: "medium",
			...defaultValues,
		},
	});

	const { updateActivity } = useUpdateActivity({ updateOnMount: false });

	const handleSubmit = async (data: FormData) => {
		try {
			await onSubmit(data);
			await updateActivity();
		} catch (error) {
			// ... エラー処理
		}
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<Card className="p-4">
					<div className="grid gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>タイトル</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>説明</FormLabel>
									<FormControl>
										<Textarea {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="startDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>開始日</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															format(field.value, "yyyy/MM/dd")
														) : (
															<span>日付を選択</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) => date < new Date("1900-01-01")}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="startTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>開始時刻</FormLabel>
										<FormControl>
											<Input
												type="time"
												{...field}
												disabled={form.watch("isAllDay")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endDate"
								render={({ field }) => (
									<FormItem>
										<FormLabel>終了日</FormLabel>
										<Popover>
											<PopoverTrigger asChild>
												<FormControl>
													<Button
														variant="outline"
														className={cn(
															"w-full pl-3 text-left font-normal",
															!field.value && "text-muted-foreground",
														)}
													>
														{field.value ? (
															format(field.value, "yyyy/MM/dd")
														) : (
															<span>日付を選択</span>
														)}
														<CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
													</Button>
												</FormControl>
											</PopoverTrigger>
											<PopoverContent className="w-auto p-0" align="start">
												<Calendar
													mode="single"
													selected={field.value}
													onSelect={field.onChange}
													disabled={(date) => date < form.watch("startDate")}
													initialFocus
												/>
											</PopoverContent>
										</Popover>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="endTime"
								render={({ field }) => (
									<FormItem>
										<FormLabel>終了時刻</FormLabel>
										<FormControl>
											<Input
												type="time"
												{...field}
												disabled={form.watch("isAllDay")}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<FormField
							control={form.control}
							name="isAllDay"
							render={({ field }) => (
								<FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
									<div className="space-y-0.5">
										<FormLabel>終日</FormLabel>
									</div>
									<FormControl>
										<Switch
											checked={field.value}
											onCheckedChange={field.onChange}
										/>
									</FormControl>
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>カテゴリー</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="カテゴリーを選択" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="work">仕事</SelectItem>
											<SelectItem value="personal">個人</SelectItem>
											<SelectItem value="habit">習慣</SelectItem>
											<SelectItem value="other">その他</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						<FormField
							control={form.control}
							name="priority"
							render={({ field }) => (
								<FormItem>
									<FormLabel>優先度</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="優先度を選択" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="high">高</SelectItem>
											<SelectItem value="medium">中</SelectItem>
											<SelectItem value="low">低</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</Card>

				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => window.history.back()}
					>
						キャンセル
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "保存中..." : "保存"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
