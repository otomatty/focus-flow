"use client";

import React, { type ReactNode } from "react";
import type {
	QuestDifficulty,
	QuestType,
	QuestWithDetails,
} from "@/types/quest";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
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
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const questFormSchema = z.object({
	title: z.string().min(1, "必須項目です"),
	description: z.string().min(1, "必須項目です"),
	questTypeId: z
		.string()
		.refine((val) => val !== "none", "クエストタイプを選択してください"),
	difficultyId: z
		.string()
		.refine((val) => val !== "none", "難易度を選択してください"),
	requirements: z.record(z.number()),
	baseRewardExp: z.number().min(1, "1以上の値を入力してください"),
	durationType: z.enum(["daily", "weekly", "monthly"]),
	isPartyQuest: z.boolean(),
	minLevel: z.number().min(1, "1以上の値を入力してください"),
	maxParticipants: z.number().optional(),
	isActive: z.boolean(),
});

type QuestFormValues = z.infer<typeof questFormSchema>;

interface QuestDialogProps {
	trigger: ReactNode;
	questTypes: QuestType[];
	difficulties: QuestDifficulty[];
	quest?: QuestWithDetails;
	onCreated?: (quest: QuestWithDetails) => void;
	onUpdated?: (quest: QuestWithDetails) => void;
}

export function QuestDialog({
	trigger,
	questTypes,
	difficulties,
	quest,
	onCreated,
	onUpdated,
}: QuestDialogProps) {
	const { toast } = useToast();
	const defaultValues = quest
		? {
				...quest,
				maxParticipants: quest.maxParticipants ?? undefined,
			}
		: {
				title: "",
				description: "",
				questTypeId: "none",
				difficultyId: "none",
				requirements: {},
				baseRewardExp: 100,
				durationType: "daily" as const,
				isPartyQuest: false,
				minLevel: 1,
				maxParticipants: undefined,
				isActive: true,
			};

	console.log("Form default values:", defaultValues);

	const form = useForm<QuestFormValues>({
		resolver: zodResolver(questFormSchema),
		defaultValues,
	});

	// Watch for form value changes
	React.useEffect(() => {
		const subscription = form.watch((value, { name, type }) =>
			console.log(
				`Form field changed - Name: ${name}, Type: ${type}, Value:`,
				value,
			),
		);
		return () => subscription.unsubscribe();
	}, [form]);

	const onSubmit = async (values: QuestFormValues) => {
		try {
			const response = await fetch(
				`/api/quests${quest ? `/${quest.id}` : ""}`,
				{
					method: quest ? "PUT" : "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify(values),
				},
			);

			if (!response.ok) {
				throw new Error("APIエラーが発生しました");
			}

			const data = await response.json();

			if (quest) {
				onUpdated?.(data);
				toast({
					title: "クエストを更新しました",
					description: "クエストの更新が完了しました。",
				});
			} else {
				onCreated?.(data);
				toast({
					title: "クエストを作成しました",
					description: "クエストの作成が完了しました。",
				});
			}
			form.reset();
		} catch (error) {
			toast({
				title: "エラーが発生しました",
				description: "クエストの保存に失敗しました。",
				variant: "destructive",
			});
		}
	};

	return (
		<Dialog>
			<DialogTrigger asChild>{trigger}</DialogTrigger>
			<DialogContent className="max-w-2xl">
				<DialogHeader>
					<DialogTitle>
						{quest ? "クエストの編集" : "クエストの作成"}
					</DialogTitle>
				</DialogHeader>
				<Form {...form}>
					<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
								name="questTypeId"
								render={({ field }) => {
									console.log("questTypeId field value:", field.value);
									return (
										<FormItem>
											<FormLabel>クエストタイプ</FormLabel>
											<Select
												onValueChange={(value) => {
													console.log("questTypeId selected value:", value);
													field.onChange(value);
												}}
												defaultValue={field.value || "none"}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="選択してください" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="none">選択してください</SelectItem>
													{questTypes.map((type) => {
														console.log("questType item:", type.id, type.name);
														return (
															<SelectItem key={type.id} value={type.id || ""}>
																{type.name}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									);
								}}
							/>

							<FormField
								control={form.control}
								name="difficultyId"
								render={({ field }) => {
									console.log("difficultyId field value:", field.value);
									return (
										<FormItem>
											<FormLabel>難易度</FormLabel>
											<Select
												onValueChange={(value) => {
													console.log("difficultyId selected value:", value);
													field.onChange(value);
												}}
												defaultValue={field.value || "none"}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="選択してください" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="none">選択してください</SelectItem>
													{difficulties.map((difficulty) => {
														console.log(
															"difficulty item:",
															difficulty.id,
															difficulty.name,
														);
														return (
															<SelectItem
																key={difficulty.id}
																value={difficulty.id || ""}
															>
																{difficulty.name}
															</SelectItem>
														);
													})}
												</SelectContent>
											</Select>
											<FormMessage />
										</FormItem>
									);
								}}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="baseRewardExp"
								render={({ field }) => (
									<FormItem>
										<FormLabel>基本経験値</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(Number.parseInt(e.target.value, 10))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="durationType"
								render={({ field }) => (
									<FormItem>
										<FormLabel>期間タイプ</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger>
													<SelectValue placeholder="選択してください" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												<SelectItem value="daily">デイリー</SelectItem>
												<SelectItem value="weekly">ウィークリー</SelectItem>
												<SelectItem value="monthly">マンスリー</SelectItem>
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="grid grid-cols-2 gap-4">
							<FormField
								control={form.control}
								name="minLevel"
								render={({ field }) => (
									<FormItem>
										<FormLabel>最小レベル</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(Number.parseInt(e.target.value, 10))
												}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="maxParticipants"
								render={({ field }) => (
									<FormItem>
										<FormLabel>最大参加人数</FormLabel>
										<FormControl>
											<Input
												type="number"
												{...field}
												onChange={(e) =>
													field.onChange(
														e.target.value
															? Number.parseInt(e.target.value, 10)
															: undefined,
													)
												}
												disabled={!form.watch("isPartyQuest")}
											/>
										</FormControl>
										<FormDescription>
											パーティークエストの場合のみ設定可能です
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>

						<div className="flex space-x-4">
							<FormField
								control={form.control}
								name="isPartyQuest"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>パーティークエスト</FormLabel>
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="isActive"
								render={({ field }) => (
									<FormItem className="flex items-center space-x-2">
										<FormControl>
											<Switch
												checked={field.value}
												onCheckedChange={field.onChange}
											/>
										</FormControl>
										<FormLabel>有効</FormLabel>
									</FormItem>
								)}
							/>
						</div>

						<div className="flex justify-end space-x-2">
							<DialogTrigger asChild>
								<Button variant="outline">キャンセル</Button>
							</DialogTrigger>
							<Button type="submit">{quest ? "更新する" : "作成する"}</Button>
						</div>
					</form>
				</Form>
			</DialogContent>
		</Dialog>
	);
}
