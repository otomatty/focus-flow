"use client";

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
	fetchTemplates,
	updateTemplate,
} from "@/app/_actions/notifications/queries";
import { TemplateFormDialog } from "./TemplateFormDialog";
import { toast } from "sonner";

type Template = Database["ff_notifications"]["Tables"]["templates"]["Row"];
type Category = Database["ff_notifications"]["Tables"]["categories"]["Row"];

interface TemplateListProps {
	initialTemplates: Template[];
	initialCategories: Category[];
}

export default function TemplateList({
	initialTemplates,
	initialCategories,
}: TemplateListProps) {
	const { data: templates } = useQuery({
		queryKey: ["notification-templates"],
		queryFn: () => fetchTemplates(),
		initialData: initialTemplates,
		staleTime: 5000,
	});

	const queryClient = useQueryClient();
	const updateMutation = useMutation({
		mutationFn: ({
			templateId,
			isActive,
		}: { templateId: string; isActive: boolean }) =>
			updateTemplate(templateId, { isActive }),
		onMutate: async ({ templateId, isActive }) => {
			await queryClient.cancelQueries({ queryKey: ["notification-templates"] });
			const previousTemplates = queryClient.getQueryData<Template[]>([
				"notification-templates",
			]);

			queryClient.setQueryData<Template[]>(["notification-templates"], (old) =>
				old?.map((template) =>
					template.id === templateId
						? { ...template, is_active: isActive }
						: template,
				),
			);

			return { previousTemplates };
		},
		onError: (err, variables, context) => {
			if (context?.previousTemplates) {
				queryClient.setQueryData(
					["notification-templates"],
					context.previousTemplates,
				);
			}
			toast.error("更新に失敗しました");
		},
		onSuccess: () => {
			toast.success("更新しました");
		},
		onSettled: () => {
			queryClient.invalidateQueries({ queryKey: ["notification-templates"] });
		},
	});

	const handleToggleActive = (templateId: string, isActive: boolean) => {
		updateMutation.mutate({ templateId, isActive });
	};

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<div>
						<CardTitle>通知テンプレート</CardTitle>
						<CardDescription>
							通知テンプレートの管理を行います。
						</CardDescription>
					</div>
					<TemplateFormDialog initialCategories={initialCategories}>
						<Button>新規作成</Button>
					</TemplateFormDialog>
				</div>
			</CardHeader>
			<CardContent>
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>名前</TableHead>
							<TableHead>タイトルテンプレート</TableHead>
							<TableHead>本文テンプレート</TableHead>
							<TableHead>アクションタイプ</TableHead>
							<TableHead>優先度</TableHead>
							<TableHead>有効/無効</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{templates?.map((template) => (
							<TableRow key={template.id}>
								<TableCell>{template.name}</TableCell>
								<TableCell>{template.title_template}</TableCell>
								<TableCell>{template.body_template}</TableCell>
								<TableCell>{template.action_type}</TableCell>
								<TableCell>{template.priority}</TableCell>
								<TableCell>
									<Switch
										checked={template.is_active ?? false}
										onCheckedChange={(checked) =>
											handleToggleActive(template.id, checked)
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
