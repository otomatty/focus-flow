"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import type { Database } from "@/types/supabase";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
	fetchCategories,
	updateCategory,
} from "@/app/_actions/notifications/queries";
import { toast } from "@/hooks/use-toast";
import { CategoryFormDialog } from "./CategoryFormDialog";

type Category = Database["ff_notifications"]["Tables"]["categories"]["Row"];

interface CategoryListProps {
	initialCategories: Category[];
}

export default function CategoryList({ initialCategories }: CategoryListProps) {
	const { data: categories } = useQuery({
		queryKey: ["notification-categories"],
		queryFn: () => fetchCategories(),
		initialData: initialCategories,
		staleTime: 5000,
	});

	const queryClient = useQueryClient();
	const updateMutation = useMutation({
		mutationFn: ({
			categoryId,
			isActive,
		}: { categoryId: string; isActive: boolean }) =>
			updateCategory(categoryId, { isActive }),
		onMutate: async ({ categoryId, isActive }) => {
			await queryClient.cancelQueries({
				queryKey: ["notification-categories"],
			});
			const previousCategories = queryClient.getQueryData<Category[]>([
				"notification-categories",
			]);

			queryClient.setQueryData<Category[]>(["notification-categories"], (old) =>
				old?.map((category) =>
					category.id === categoryId
						? { ...category, is_active: isActive }
						: category,
				),
			);

			return { previousCategories };
		},
		onError: (err, variables, context) => {
			if (context?.previousCategories) {
				queryClient.setQueryData(
					["notification-categories"],
					context.previousCategories,
				);
			}
			toast({
				title: "更新に失敗しました",
				variant: "destructive",
			});
		},
		onSuccess: () => {
			toast({
				title: "更新しました",
			});
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["notification-categories"] });
		},
	});

	const handleToggleActive = (categoryId: string, isActive: boolean) => {
		updateMutation.mutate({ categoryId, isActive });
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>通知カテゴリ</CardTitle>
						<CardDescription>通知カテゴリの管理を行います。</CardDescription>
					</div>
					<CategoryFormDialog>
						<Button>新規作成</Button>
					</CategoryFormDialog>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>名前</TableHead>
							<TableHead>表示名</TableHead>
							<TableHead>説明</TableHead>
							<TableHead>優先度</TableHead>
							<TableHead>有効/無効</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{categories?.map((category) => (
							<TableRow key={category.id}>
								<TableCell>{category.name}</TableCell>
								<TableCell>{category.display_name}</TableCell>
								<TableCell>{category.description}</TableCell>
								<TableCell>{category.priority}</TableCell>
								<TableCell>
									<Switch
										checked={category.is_active ?? false}
										onCheckedChange={(checked) =>
											handleToggleActive(category.id, checked)
										}
									/>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
