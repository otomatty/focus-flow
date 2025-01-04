"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { ScheduleSection } from "./form-sections/ScheduleSection";
import { DetailsSection } from "./form-sections/DetailsSection";
import { StyleSection } from "./form-sections/StyleSection";
import { PrioritySelect } from "./form-sections/PrioritySelect";
import { ProjectSelect } from "./form-sections/ProjectSelect";
import { taskSchema } from "@/schemas/taskSchema";
import type { StandardTaskFormData } from "@/types/task";
import { createTaskAction } from "@/app/_actions/tasks/creation";

export function StandardTaskForm() {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showDetails, setShowDetails] = useState(false);
	const { toast } = useToast();
	const router = useRouter();

	const form = useForm<StandardTaskFormData>({
		resolver: zodResolver(taskSchema),
		defaultValues: {
			title: "",
			description: "",
			priority: "medium",
			is_recurring: false,
		},
	});

	const onSubmit = async (data: StandardTaskFormData) => {
		console.log("=== タスク作成開始 ===");
		console.log("フォームデータ:", data);

		setIsSubmitting(true);
		try {
			const result = await createTaskAction(data);
			console.log("作成結果:", result);

			if (result.success) {
				toast({
					title: "タスクを作成しました",
					description: "タスクの作成に成功しました。",
				});
				router.push("/webapp/tasks");
			} else {
				toast({
					title: "エラー",
					description: result.error || "タスクの作成に失敗しました",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("タスク作成エラー:", error);
			toast({
				title: "エラー",
				description: "タスクの作成中にエラーが発生しました",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="space-y-6">
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					{/* 基本入力フィールド */}
					<div className="grid gap-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>タイトル</FormLabel>
									<FormControl>
										<Input placeholder="タスクのタイトル" {...field} />
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
										<TextareaAutosize
											placeholder="タスクの詳細な説明"
											className="min-h-[100px] resize-y"
											{...field}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						<div className="space-y-4">
							<PrioritySelect control={form.control} />
							<ProjectSelect control={form.control} />
							<ScheduleSection control={form.control} />
						</div>
					</div>

					{/* 詳細設定 */}
					<Card className="p-4">
						<Button
							type="button"
							variant="ghost"
							className="w-full mb-4"
							onClick={() => setShowDetails(!showDetails)}
						>
							{showDetails ? "詳細設定を隠す" : "詳細設定を表示"}
						</Button>

						{showDetails && (
							<div className="space-y-6">
								<DetailsSection control={form.control} />
								<StyleSection control={form.control} />
							</div>
						)}
					</Card>

					<Button type="submit" className="w-full" disabled={isSubmitting}>
						{isSubmitting ? (
							<>
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
								作成中...
							</>
						) : (
							"タスクを作成"
						)}
					</Button>
				</form>
			</Form>
		</div>
	);
}
