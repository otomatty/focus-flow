"use client";

import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
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
import type { Database } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createTemplate } from "@/app/_actions/notifications/queries";
import { toast } from "sonner";

type Template = Database["ff_notifications"]["Tables"]["templates"]["Row"];
type Category = Database["ff_notifications"]["Tables"]["categories"]["Row"];

const formSchema = z.object({
	categoryId: z.string().min(1, "カテゴリは必須です"),
	name: z.string().min(1, "名前は必須です"),
	titleTemplate: z.string().min(1, "タイトルテンプレートは必須です"),
	bodyTemplate: z.string().min(1, "本文テンプレートは必須です"),
	actionType: z.string().optional(),
	actionData: z.string().optional(),
	priority: z.coerce.number().int().min(0).default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface TemplateFormDialogProps {
	children: React.ReactNode;
	initialCategories: Category[];
}

export function TemplateFormDialog({
	children,
	initialCategories,
}: TemplateFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			categoryId: "",
			name: "",
			titleTemplate: "",
			bodyTemplate: "",
			actionType: "",
			actionData: "",
			priority: 0,
		},
	});

	const createMutation = useMutation({
		mutationFn: createTemplate,
		onSuccess: () => {
			toast.success("テンプレートを作成しました");
			setOpen(false);
			form.reset();
			queryClient.invalidateQueries({ queryKey: ["notification-templates"] });
		},
		onError: () => {
			toast.error("テンプレートの作成に失敗しました");
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsLoading(true);
		createMutation.mutate({
			categoryId: values.categoryId,
			name: values.name,
			titleTemplate: values.titleTemplate,
			bodyTemplate: values.bodyTemplate,
			actionType: values.actionType,
			actionData: values.actionData ? JSON.parse(values.actionData) : undefined,
			priority: values.priority,
			isActive: true,
		});
		setIsLoading(false);
	};

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={setOpen}
			title="通知テンプレートの作成"
			description="新しい通知テンプレートを作成します。"
			trigger={children}
		>
			<div className="p-4 space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="categoryId"
							render={({ field }) => (
								<FormItem>
									<FormLabel>カテゴリ</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="カテゴリを選択" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{initialCategories?.map((category) => (
												<SelectItem key={category.id} value={category.id}>
													{category.display_name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>名前</FormLabel>
									<FormControl>
										<Input placeholder="season_end" {...field} />
									</FormControl>
									<FormDescription>
										システム内で使用する識別子です。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="titleTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>タイトルテンプレート</FormLabel>
									<FormControl>
										<Input
											placeholder="シーズン{{season_number}}が終了します"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										変数は {"{{variable_name}}"} の形式で指定します。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bodyTemplate"
							render={({ field }) => (
								<FormItem>
									<FormLabel>本文テンプレート</FormLabel>
									<FormControl>
										<Textarea
											placeholder="シーズン{{season_number}}は{{end_date}}に終了します。"
											{...field}
										/>
									</FormControl>
									<FormDescription>
										変数は {"{{variable_name}}"} の形式で指定します。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="actionType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>アクションタイプ</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="アクションタイプを選択" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value="link">リンク</SelectItem>
											<SelectItem value="modal">モーダル</SelectItem>
											<SelectItem value="toast">トースト</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="actionData"
							render={({ field }) => (
								<FormItem>
									<FormLabel>アクションデータ</FormLabel>
									<FormControl>
										<Textarea
											placeholder='{"path": "/seasons/{{season_id}}"}'
											{...field}
										/>
									</FormControl>
									<FormDescription>
										JSON形式で指定します。変数も使用できます。
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
										<Input type="number" min="0" {...field} />
									</FormControl>
									<FormDescription>
										数値が大きいほど優先度が高くなります。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<div className="flex justify-end gap-4">
							<Button
								type="button"
								variant="outline"
								onClick={() => setOpen(false)}
								disabled={isLoading}
							>
								キャンセル
							</Button>
							<Button type="submit" disabled={isLoading}>
								作成
							</Button>
						</div>
					</form>
				</Form>
			</div>
		</ResponsiveDialog>
	);
}
