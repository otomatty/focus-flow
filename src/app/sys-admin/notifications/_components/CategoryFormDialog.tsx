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
import type { Database } from "@/types/supabase";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createCategory } from "@/app/_actions/notifications/queries";
import { toast } from "sonner";

type Category = Database["ff_notifications"]["Tables"]["categories"]["Row"];

const formSchema = z.object({
	name: z.string().min(1, "名前は必須です"),
	displayName: z.string().min(1, "表示名は必須です"),
	description: z.string().optional(),
	icon: z.string().optional(),
	color: z.string().optional(),
	priority: z.coerce.number().int().min(0).default(0),
});

type FormValues = z.infer<typeof formSchema>;

interface CategoryFormDialogProps {
	children: React.ReactNode;
}

export function CategoryFormDialog({ children }: CategoryFormDialogProps) {
	const [open, setOpen] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const queryClient = useQueryClient();

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			name: "",
			displayName: "",
			description: "",
			icon: "",
			color: "",
			priority: 0,
		},
	});

	const createMutation = useMutation({
		mutationFn: createCategory,
		onSuccess: () => {
			toast.success("カテゴリを作成しました");
			setOpen(false);
			form.reset();
			queryClient.invalidateQueries({ queryKey: ["notification-categories"] });
		},
		onError: () => {
			toast.error("カテゴリの作成に失敗しました");
		},
	});

	const onSubmit = async (values: FormValues) => {
		setIsLoading(true);
		createMutation.mutate({
			name: values.name,
			displayName: values.displayName,
			description: values.description,
			icon: values.icon,
			color: values.color,
			priority: values.priority,
			isActive: true,
		});
		setIsLoading(false);
	};

	return (
		<ResponsiveDialog
			open={open}
			onOpenChange={setOpen}
			title="通知カテゴリの作成"
			description="新しい通知カテゴリを作成します。"
			trigger={children}
		>
			<div className="p-4 space-y-4">
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
						<FormField
							control={form.control}
							name="name"
							render={({ field }) => (
								<FormItem>
									<FormLabel>名前</FormLabel>
									<FormControl>
										<Input placeholder="season" {...field} />
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
							name="displayName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>表示名</FormLabel>
									<FormControl>
										<Input placeholder="シーズン" {...field} />
									</FormControl>
									<FormDescription>
										ユーザーに表示される名前です。
									</FormDescription>
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
										<Input placeholder="シーズン関連の通知" {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="icon"
							render={({ field }) => (
								<FormItem>
									<FormLabel>アイコン</FormLabel>
									<FormControl>
										<Input placeholder="calendar" {...field} />
									</FormControl>
									<FormDescription>
										Lucideアイコンの名前を指定します。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="color"
							render={({ field }) => (
								<FormItem>
									<FormLabel>カラー</FormLabel>
									<FormControl>
										<Input placeholder="#4CAF50" {...field} />
									</FormControl>
									<FormDescription>カラーコードを指定します。</FormDescription>
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
