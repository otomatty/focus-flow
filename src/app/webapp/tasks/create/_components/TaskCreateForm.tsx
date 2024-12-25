"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
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
import { Card } from "@/components/ui/card";
import { createTask } from "@/app/_actions/task.action";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
	ChevronDown,
	ChevronUp,
	Rocket,
	Clock,
	Calendar,
	Wand2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TaskBreakdownPreview } from "./TaskBreakdownPreview";
import { analyzeTask } from "@/lib/gemini/task-analyzer";
import type { AIAnalysis } from "@/lib/gemini/task-analyzer";

const taskFormSchema = z.object({
	title: z.string().min(1, "タイトルを入力してください"),
	description: z.string().optional(),
	priority: z.enum(["high", "medium", "low"]).optional(),
	category: z.string().optional(),
	due_date: z.string().optional(),
	estimated_duration: z.string().optional(),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

const defaultValues: Partial<TaskFormValues> = {
	title: "",
	description: "",
	priority: "medium",
	category: "",
	due_date: "",
	estimated_duration: "",
};

interface TaskCreateFormProps {
	onTitleChange?: (title: string) => void;
	onDescriptionChange?: (description: string) => void;
}

const priorityCards = [
	{
		value: "high",
		icon: Rocket,
		title: "最優先で取り組む",
		description: "今すぐ着手が必要なタスク",
	},
	{
		value: "medium",
		icon: Clock,
		title: "可能であれば今から始める",
		description: "近いうちに着手したいタスク",
	},
	{
		value: "low",
		icon: Calendar,
		title: "いつかやるもの",
		description: "時間に余裕があるときに取り組むタスク",
	},
] as const;

export function TaskCreateForm({
	onTitleChange,
	onDescriptionChange,
}: TaskCreateFormProps) {
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const [isAnalyzing, setIsAnalyzing] = useState(false);
	const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
	const [showDetails, setShowDetails] = useState(false);
	const { user } = useAuth();
	const { toast } = useToast();
	const form = useForm<TaskFormValues>({
		resolver: zodResolver(taskFormSchema),
		defaultValues,
	});

	const { watch } = form;

	const handleAnalyze = async () => {
		const title = form.getValues("title");
		if (!title) {
			toast({
				title: "エラー",
				description: "タイトルを入力してください",
				variant: "destructive",
			});
			return;
		}

		setIsAnalyzing(true);
		try {
			const result = await analyzeTask(title, form.getValues("description"));
			setAnalysis(result);
			form.setValue("priority", result.suggestedPriority);
			form.setValue("category", result.suggestedCategory);
			form.setValue("due_date", result.suggestedDueDate);
			form.setValue("estimated_duration", result.totalEstimatedDuration);
			toast({
				title: "成功",
				description: "タスクの分析が完了しました",
			});
		} catch (error) {
			console.error("タスク分析に失敗しました:", error);
			toast({
				title: "エラー",
				description: "タスクの分析に失敗しました",
				variant: "destructive",
			});
			setAnalysis(null);
		} finally {
			setIsAnalyzing(false);
		}
	};

	useEffect(() => {
		const subscription = watch((value, { name }) => {
			if (name === "title" && onTitleChange) {
				onTitleChange(value.title || "");
			}
			if (name === "description" && onDescriptionChange) {
				onDescriptionChange(value.description || "");
			}
		});
		return () => subscription.unsubscribe();
	}, [watch, onTitleChange, onDescriptionChange]);

	async function onSubmit(data: TaskFormValues) {
		if (!user) {
			toast({
				title: "ログインが必要です",
				description: "ログインしてから再度お試しください",
				variant: "destructive",
			});
			return;
		}

		setIsLoading(true);
		try {
			const task = await createTask({
				...data,
				user_id: user.id,
				status: "not_started",
				priority: data.priority || "medium",
				due_date: data.due_date ? new Date(data.due_date).toISOString() : null,
				ai_generated: true,
			});
			toast({
				title: "タスクを作成しました",
				description: "タスクの詳細ページに移動します",
			});
			router.push(`/webapp/tasks/${task.id}`);
		} catch (error) {
			toast({
				title: "タスクの作成に失敗しました",
				description:
					error instanceof Error ? error.message : "エラーが発生しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<FormField
					control={form.control}
					name="title"
					render={({ field }) => (
						<FormItem>
							<FormLabel>タイトル</FormLabel>
							<div className="flex gap-2">
								<FormControl>
									<Input placeholder="タスクのタイトル" {...field} />
								</FormControl>
								<Button
									onClick={handleAnalyze}
									disabled={!field.value || isAnalyzing}
									size="sm"
								>
									{isAnalyzing ? (
										"分析中..."
									) : (
										<>
											<Wand2 className="mr-2 h-4 w-4" />
											タスクを分析
										</>
									)}
								</Button>
							</div>
							<FormDescription>
								タイトルを入力し、分析ボタンをクリックするとAIが自動的にタスクを分析します
							</FormDescription>
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
							<FormControl>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{priorityCards.map((priority) => {
										const Icon = priority.icon;
										return (
											<Card
												key={priority.value}
												className={cn(
													"relative p-4 cursor-pointer hover:border-primary transition-colors",
													field.value === priority.value
														? "border-primary bg-primary/5"
														: "border-muted",
												)}
												onClick={() => field.onChange(priority.value)}
											>
												<div className="flex items-start gap-4">
													<Icon className="h-6 w-6 text-primary shrink-0" />
													<div className="space-y-1">
														<h4 className="font-medium">{priority.title}</h4>
														<p className="text-sm text-muted-foreground">
															{priority.description}
														</p>
													</div>
												</div>
											</Card>
										);
									})}
								</div>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="border-t pt-6">
					<Button
						type="button"
						variant="ghost"
						className="w-full"
						onClick={() => setShowDetails(!showDetails)}
					>
						{showDetails ? (
							<>
								<ChevronUp className="mr-2 h-4 w-4" />
								詳細設定を閉じる
							</>
						) : (
							<>
								<ChevronDown className="mr-2 h-4 w-4" />
								詳細を設定する
							</>
						)}
					</Button>
				</div>

				{showDetails && (
					<div className="space-y-8 animate-in slide-in-from-top-4">
						<FormField
							control={form.control}
							name="description"
							render={({ field }) => (
								<FormItem>
									<FormLabel>説明（任意）</FormLabel>
									<FormControl>
										<Textarea placeholder="タスクの説明" {...field} />
									</FormControl>
									<FormDescription>
										説明を追加すると、AIがより正確にタスクを分析できます
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="category"
								render={({ field }) => (
									<FormItem>
										<FormLabel>カテゴリー（任意）</FormLabel>
										<FormControl>
											<Input placeholder="AIが自動設定" {...field} />
										</FormControl>
										<FormDescription>
											未設定の場合、AIが自動的に設定します
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
							<FormField
								control={form.control}
								name="due_date"
								render={({ field }) => (
									<FormItem>
										<FormLabel>期限（任意）</FormLabel>
										<FormControl>
											<Input type="datetime-local" {...field} />
										</FormControl>
										<FormDescription>
											未設定の場合、AIが推奨期限を設定します
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
										<FormLabel>予定時間（任意）</FormLabel>
										<FormControl>
											<Input
												type="text"
												placeholder="AIが自動設定"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											未設定の場合、AIが自動的に設定します
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				)}

				<div className="space-y-8">
					<TaskBreakdownPreview analysis={analysis} isLoading={isAnalyzing} />
				</div>

				<div className="flex justify-end gap-4">
					<Button type="button" variant="outline" onClick={() => router.back()}>
						キャンセル
					</Button>
					<Button type="submit" disabled={isLoading}>
						{isLoading ? "作成中..." : "タスクを作成"}
					</Button>
				</div>
			</form>
		</Form>
	);
}
