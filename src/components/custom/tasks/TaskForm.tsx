import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormDescription,
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
import { DatePicker } from "@/components/ui/date-picker";

import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { taskSchema } from "@/lib/validations/task";
import type { TaskPriority, TaskType } from "@/types/task";

interface Props {
	onSubmit: (data: TaskFormData) => Promise<void>;
	defaultValues?: Partial<TaskFormData>;
	isSubmitting?: boolean;
}

export interface TaskFormData {
	title: string;
	description?: string;
	type: TaskType;
	priority: TaskPriority;
	due_date?: Date;
	estimated_duration?: string;
	category?: string;
	tags?: string[];
}

export function TaskForm({ onSubmit, defaultValues, isSubmitting }: Props) {
	const [activeTab, setActiveTab] = useState("basic");
	const [tags, setTags] = useState<string[]>([]);
	const [tagInput, setTagInput] = useState("");

	const form = useForm<TaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			type: "task",
			priority: "medium",
			...defaultValues,
		},
	});

	const handleSubmit = async (data: TaskFormData) => {
		await onSubmit({ ...data, tags });
		form.reset();
		setTags([]);
	};

	const handleAddTag = (e: React.KeyboardEvent) => {
		if (e.key === "Enter" && tagInput.trim()) {
			e.preventDefault();
			if (!tags.includes(tagInput.trim())) {
				setTags([...tags, tagInput.trim()]);
			}
			setTagInput("");
		}
	};

	const removeTag = (tagToRemove: string) => {
		setTags(tags.filter((tag) => tag !== tagToRemove));
	};

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
				<Tabs value={activeTab} onValueChange={setActiveTab}>
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="basic">基本情報</TabsTrigger>
						<TabsTrigger value="details">詳細設定</TabsTrigger>
					</TabsList>

					<TabsContent value="basic" className="space-y-4 mt-4">
						<Card className="p-6">
							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel>
											タイトル <span className="text-red-500">*</span>
										</FormLabel>
										<FormControl>
											<Input placeholder="タスクのタイトル" {...field} />
										</FormControl>
										<FormDescription>
											具体的で分かりやすいタイトルを入力してください
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="mt-4">
								<FormField
									control={form.control}
									name="description"
									render={({ field }) => (
										<FormItem>
											<FormLabel>説明</FormLabel>
											<FormControl>
												<Textarea
													placeholder="タスクの詳細な説明"
													className="min-h-[120px]"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												目的、成果物、注意点などを記載してください
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="grid grid-cols-2 gap-4 mt-4">
								<FormField
									control={form.control}
									name="type"
									render={({ field }) => (
										<FormItem>
											<FormLabel>
												タイプ <span className="text-red-500">*</span>
											</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="タイプを選択" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="task">タスク</SelectItem>
													<SelectItem value="milestone">
														マイルストーン
													</SelectItem>
													<SelectItem value="epic">エピック</SelectItem>
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
											<FormLabel>
												優先度 <span className="text-red-500">*</span>
											</FormLabel>
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
					</TabsContent>

					<TabsContent value="details" className="space-y-4 mt-4">
						<Card className="p-6">
							<div className="grid gap-4">
								<FormField
									control={form.control}
									name="due_date"
									render={({ field }) => (
										<FormItem>
											<FormLabel>期限</FormLabel>
											<FormControl>
												<DatePicker
													date={field.value}
													onSelect={field.onChange}
												/>
											</FormControl>
											<FormDescription>
												タスクの完了期限を設定してください
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="estimated_duration"
									render={({ field }) => (
										<FormItem>
											<FormLabel>予想所要時間</FormLabel>
											<FormControl>
												<Input
													placeholder="例: PT2H30M (2時間30分)"
													{...field}
												/>
											</FormControl>
											<FormDescription>
												ISO8601形式で入力 (例: PT2H30M = 2時間30分)
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="category"
									render={({ field }) => (
										<FormItem>
											<FormLabel>カテゴリー</FormLabel>
											<FormControl>
												<Input placeholder="タスクのカテゴリー" {...field} />
											</FormControl>
											<FormDescription>
												タスクの分類や種別を入力してください
											</FormDescription>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormItem>
									<FormLabel>タグ</FormLabel>
									<FormControl>
										<Input
											placeholder="タグを入力してEnterで追加"
											value={tagInput}
											onChange={(e) => setTagInput(e.target.value)}
											onKeyDown={handleAddTag}
										/>
									</FormControl>
									<FormDescription>
										関連キーワードを追加してください
									</FormDescription>
									{tags.length > 0 && (
										<div className="flex flex-wrap gap-2 mt-2">
											{tags.map((tag) => (
												<Badge
													key={tag}
													variant="secondary"
													className="cursor-pointer"
													onClick={() => removeTag(tag)}
												>
													{tag} ×
												</Badge>
											))}
										</div>
									)}
								</FormItem>
							</div>
						</Card>
					</TabsContent>
				</Tabs>

				<div className="flex justify-end gap-4">
					<Button
						type="button"
						variant="outline"
						onClick={() => form.reset()}
						disabled={isSubmitting}
					>
						キャンセル
					</Button>
					<Button type="submit" disabled={isSubmitting}>
						{isSubmitting ? "作成中..." : "タスクを作成"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
