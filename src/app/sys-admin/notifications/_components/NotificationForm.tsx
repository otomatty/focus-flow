"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DatePicker } from "@/components/ui/date-picker";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import {
	fetchCategories,
	fetchTemplates,
	sendNotification,
	sendFilteredNotification,
	sendNotificationToAll,
} from "@/app/_actions/notifications/queries";
import { useToast } from "@/hooks/use-toast";
import type {
	NotificationCategory,
	NotificationTemplate,
} from "@/types/notifications";

const formSchema = z.object({
	sendType: z.enum(["single", "filtered", "all"]),
	userId: z.string().optional(),
	filters: z
		.object({
			roles: z.array(z.string()).optional(),
			lastActiveAfter: z.date().optional(),
			lastActiveBefore: z.date().optional(),
			createdAfter: z.date().optional(),
			createdBefore: z.date().optional(),
			hasCompletedOnboarding: z.boolean().optional(),
		})
		.optional(),
	categoryName: z.string(),
	templateName: z.string(),
	templateData: z.record(z.string()),
});

type FormValues = z.infer<typeof formSchema>;

interface NotificationFormProps {
	initialCategories: NotificationCategory[];
	initialTemplates: NotificationTemplate[];
}

export default function NotificationForm({
	initialCategories,
	initialTemplates,
}: NotificationFormProps) {
	const { toast } = useToast();

	const { data: categories = [] } = useQuery({
		queryKey: ["notification-categories"],
		queryFn: () => fetchCategories({ isActive: true }),
		initialData: initialCategories,
	});

	const { data: templates = [] } = useQuery({
		queryKey: ["notification-templates"],
		queryFn: () => fetchTemplates({ isActive: true }),
		initialData: initialTemplates,
	});

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			sendType: "single",
			templateData: {},
		},
	});

	const handleSubmit = async (values: FormValues) => {
		try {
			switch (values.sendType) {
				case "single":
					if (!values.userId) {
						throw new Error("ユーザーIDは必須です");
					}
					await sendNotification({
						userId: values.userId,
						categoryName: values.categoryName,
						templateName: values.templateName,
						templateData: values.templateData,
					});
					break;
				case "filtered":
					if (!values.filters) {
						throw new Error("フィルター条件は必須です");
					}
					await sendFilteredNotification({
						filters: values.filters,
						categoryName: values.categoryName,
						templateName: values.templateName,
						templateData: values.templateData,
					});
					break;
				case "all":
					await sendNotificationToAll({
						categoryName: values.categoryName,
						templateName: values.templateName,
						templateData: values.templateData,
					});
					break;
			}
			form.reset();
			toast({
				title: "通知送信",
				description: "通知を送信しました",
			});
		} catch (error) {
			console.error("通知送信エラー:", error);
			toast({
				title: "エラー",
				description:
					error instanceof Error ? error.message : "通知の送信に失敗しました",
				variant: "destructive",
			});
		}
	};

	const selectedCategory = categories.find(
		(category) => category.name === form.watch("categoryName"),
	);

	const selectedTemplate = templates.find(
		(template) => template.name === form.watch("templateName"),
	);

	// テンプレートから変数を抽出する関数
	const extractTemplateVariables = (template?: NotificationTemplate) => {
		if (!template) return [];
		const variables = new Set<string>();
		const pattern = /\{\{([^}]+)\}\}/g;

		// タイトルと本文から変数を抽出
		for (const text of [template.title_template, template.body_template]) {
			let match = pattern.exec(text);
			while (match !== null) {
				variables.add(match[1]);
				match = pattern.exec(text);
			}
		}

		return Array.from(variables);
	};

	const templateVariables = extractTemplateVariables(selectedTemplate);

	console.log({
		watchedCategoryName: form.watch("categoryName"),
		categories,
		selectedCategory,
		templates,
		selectedTemplate,
		templateVariables,
	});

	const filteredTemplates = selectedCategory
		? templates.filter(
				(template) => template.category_id === selectedCategory.id,
			)
		: templates;

	// プレビューを生成する関数
	const generatePreview = () => {
		if (!selectedTemplate) return null;

		const templateData = form.watch("templateData");
		let title = selectedTemplate.title_template;
		let body = selectedTemplate.body_template;

		for (const [key, value] of Object.entries(templateData)) {
			const pattern = new RegExp(`\\{\\{${key}\\}\\}`, "g");
			title = title.replace(pattern, value);
			body = body.replace(pattern, value);
		}

		return { title, body };
	};

	const preview = generatePreview();

	return (
		<Card>
			<CardHeader>
				<CardTitle>通知作成</CardTitle>
			</CardHeader>
			<CardContent>
				<Form {...form}>
					<form
						onSubmit={form.handleSubmit(handleSubmit)}
						className="space-y-6"
					>
						<FormField
							control={form.control}
							name="sendType"
							render={({ field }) => (
								<FormItem>
									<FormLabel>送信タイプ</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className="grid grid-cols-3 gap-4"
										>
											<div>
												<RadioGroupItem
													value="single"
													id="single"
													className="peer sr-only"
												/>
												<Label
													htmlFor="single"
													className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
												>
													個別送信
												</Label>
											</div>
											<div>
												<RadioGroupItem
													value="filtered"
													id="filtered"
													className="peer sr-only"
												/>
												<Label
													htmlFor="filtered"
													className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
												>
													フィルター送信
												</Label>
											</div>
											<div>
												<RadioGroupItem
													value="all"
													id="all"
													className="peer sr-only"
												/>
												<Label
													htmlFor="all"
													className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
												>
													全体送信
												</Label>
											</div>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>

						{form.watch("sendType") === "single" && (
							<FormField
								control={form.control}
								name="userId"
								render={({ field }) => (
									<FormItem>
										<FormLabel>ユーザーID</FormLabel>
										<FormControl>
											<Input {...field} />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						)}

						{form.watch("sendType") === "filtered" && (
							<div className="space-y-4">
								<FormField
									control={form.control}
									name="filters.roles"
									render={({ field }) => (
										<FormItem>
											<FormLabel>ユーザーロール</FormLabel>
											<FormControl>
												<Select
													onValueChange={(value) => field.onChange([value])}
													value={field.value?.[0]}
												>
													<SelectTrigger>
														<SelectValue placeholder="ロールを選択" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="user">一般ユーザー</SelectItem>
														<SelectItem value="premium_user">
															プレミアムユーザー
														</SelectItem>
													</SelectContent>
												</Select>
											</FormControl>
											<FormMessage />
										</FormItem>
									)}
								/>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="filters.lastActiveAfter"
										render={({ field }) => (
											<FormItem>
												<FormLabel>最終アクティブ（開始）</FormLabel>
												<FormControl>
													<DatePicker
														date={field.value}
														onSelect={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="filters.lastActiveBefore"
										render={({ field }) => (
											<FormItem>
												<FormLabel>最終アクティブ（終了）</FormLabel>
												<FormControl>
													<DatePicker
														date={field.value}
														onSelect={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<div className="grid grid-cols-2 gap-4">
									<FormField
										control={form.control}
										name="filters.createdAfter"
										render={({ field }) => (
											<FormItem>
												<FormLabel>登録日（開始）</FormLabel>
												<FormControl>
													<DatePicker
														date={field.value}
														onSelect={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>

									<FormField
										control={form.control}
										name="filters.createdBefore"
										render={({ field }) => (
											<FormItem>
												<FormLabel>登録日（終了）</FormLabel>
												<FormControl>
													<DatePicker
														date={field.value}
														onSelect={field.onChange}
													/>
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								</div>

								<FormField
									control={form.control}
									name="filters.hasCompletedOnboarding"
									render={({ field }) => (
										<FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
											<div className="space-y-0.5">
												<FormLabel className="text-base">
													オンボーディング完了
												</FormLabel>
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
							</div>
						)}

						<FormField
							control={form.control}
							name="categoryName"
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
											{categories.map((category) => (
												<SelectItem key={category.id} value={category.name}>
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
							name="templateName"
							render={({ field }) => (
								<FormItem>
									<FormLabel>テンプレート</FormLabel>
									<Select
										onValueChange={field.onChange}
										defaultValue={field.value}
									>
										<FormControl>
											<SelectTrigger>
												<SelectValue placeholder="テンプレートを選択" />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{filteredTemplates.map((template) => (
												<SelectItem key={template.id} value={template.name}>
													{template.title_template}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>

						{selectedTemplate && templateVariables.length > 0 && (
							<div className="space-y-4">
								<div className="text-sm font-medium">テンプレート変数</div>
								{templateVariables.map((variable) => (
									<FormField
										key={variable}
										control={form.control}
										name={`templateData.${variable}`}
										render={({ field }) => (
											<FormItem>
												<FormLabel>{variable}</FormLabel>
												<FormControl>
													<Input {...field} />
												</FormControl>
												<FormMessage />
											</FormItem>
										)}
									/>
								))}
							</div>
						)}

						{preview && (
							<div className="space-y-4 rounded-lg border p-4">
								<div className="text-sm font-medium">プレビュー</div>
								<div className="space-y-2">
									<div className="font-medium">{preview.title}</div>
									<div className="text-sm text-muted-foreground whitespace-pre-wrap">
										{preview.body}
									</div>
								</div>
							</div>
						)}

						<div className="flex justify-end">
							<Button type="submit">送信</Button>
						</div>
					</form>
				</Form>
			</CardContent>
		</Card>
	);
}
