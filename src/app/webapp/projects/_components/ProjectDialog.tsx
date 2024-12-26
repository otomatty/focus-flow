import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
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
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Sparkles } from "lucide-react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/project";
import { generateProjectFormValues } from "@/lib/gemini/project-assistant";
import { useDebounce } from "@/hooks/useDebounce";
import { useToast } from "@/hooks/use-toast";

const projectFormSchema = z.object({
	name: z.string().min(1, "プロジェクト名をしてください"),
	description: z.string().optional(),
	status: z.enum(["not_started", "in_progress", "completed", "on_hold"]),
	priority: z.enum(["high", "medium", "low"]),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
	color: z.string().optional(),
});

export interface ProjectFormValues {
	name: string;
	description?: string;
	status?: "not_started" | "in_progress" | "completed" | "on_hold";
	priority?: "high" | "medium" | "low";
	color?: string;
	startDate?: Date;
	endDate?: Date;
	isArchived?: boolean;
}

interface ProjectDialogProps {
	project?: Project;
	trigger: React.ReactNode;
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
	onSubmit?: (data: ProjectFormValues) => Promise<{ error: string | null }>;
}

export function ProjectDialog({
	project,
	trigger,
	open,
	onOpenChange,
	onSubmit,
}: ProjectDialogProps) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isOpen, setIsOpen] = useState(false);
	const [isGenerating, setIsGenerating] = useState(false);
	const isEditing = !!project;
	const { toast } = useToast();

	const form = useForm<ProjectFormValues>({
		resolver: zodResolver(projectFormSchema),
		defaultValues: {
			name: project?.name ?? "",
			description: project?.description ?? "",
			status:
				(project?.status as
					| "not_started"
					| "in_progress"
					| "completed"
					| "on_hold") ?? "not_started",
			priority: (project?.priority as "high" | "medium" | "low") ?? "medium",
			startDate: project?.startDate ? new Date(project.startDate) : new Date(),
			endDate: project?.endDate ? new Date(project.endDate) : undefined,
			color: project?.color ?? "default",
		},
	});

	const projectName = form.watch("name");
	const debouncedProjectName = useDebounce(projectName, 1000);

	useEffect(() => {
		if (!isEditing && debouncedProjectName && debouncedProjectName.length > 0) {
			const generateSuggestion = async () => {
				try {
					setIsGenerating(true);
					const suggestion =
						await generateProjectFormValues(debouncedProjectName);
					for (const [key, value] of Object.entries(suggestion)) {
						form.setValue(key as keyof ProjectFormValues, value);
					}
				} catch (error) {
					console.error("Failed to generate project suggestion:", error);
				} finally {
					setIsGenerating(false);
				}
			};
			generateSuggestion();
		}
	}, [debouncedProjectName, isEditing, form]);

	const handleGenerateSuggestion = async () => {
		if (!projectName) {
			toast({
				title: "プロジェクト名を入力してください",
				variant: "destructive",
			});
			return;
		}

		try {
			setIsGenerating(true);
			const suggestion = await generateProjectFormValues(projectName);
			for (const [key, value] of Object.entries(suggestion)) {
				form.setValue(key as keyof ProjectFormValues, value);
			}
			toast({
				title: "AI提案を反映しました",
				variant: "default",
			});
		} catch (error) {
			console.error("Failed to generate project suggestion:", error);
			toast({
				title: "AI提案の生成に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsGenerating(false);
		}
	};

	const handleSubmit = async (data: ProjectFormValues) => {
		try {
			setIsSubmitting(true);
			const { error } = (await onSubmit?.(data)) ?? {};

			if (error) {
				toast({
					title: error,
					variant: "destructive",
				});
				return;
			}

			toast({
				title: isEditing
					? "プロジェクトを更新しました"
					: "プロジェクトを作成しました",
				variant: "default",
			});
			handleOpenChange(false);
		} finally {
			setIsSubmitting(false);
		}
	};

	const handleOpenChange = (open: boolean) => {
		setIsOpen(open);
		onOpenChange?.(open);
	};

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={handleOpenChange}
			trigger={trigger}
			title={isEditing ? "プロジェクトを編集" : "新規プロジェクト"}
			description={
				isEditing
					? "プロジェクトの情報を編集します"
					: "新しいプロジェクトを作成します"
			}
		>
			<ScrollArea className="h-full">
				<div className="p-4 space-y-6">
					<Form {...form}>
						<form
							onSubmit={form.handleSubmit(handleSubmit)}
							className="space-y-4"
						>
							<FormField
								control={form.control}
								name="name"
								render={({ field }) => (
									<FormItem>
										<FormLabel>プロジェクト名</FormLabel>
										<div className="flex gap-2">
											<FormControl>
												<Input {...field} placeholder="プロジェクト名を入力" />
											</FormControl>
											{!isEditing && (
												<Button
													type="button"
													variant="outline"
													size="icon"
													disabled={isGenerating}
													onClick={handleGenerateSuggestion}
												>
													<Sparkles className="h-4 w-4" />
												</Button>
											)}
										</div>
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
											<Textarea
												{...field}
												placeholder="プロジェクトの説明を入力"
												rows={3}
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="grid grid-cols-2 gap-4">
								<FormField
									control={form.control}
									name="status"
									render={({ field }) => (
										<FormItem>
											<FormLabel>ステータス</FormLabel>
											<Select
												onValueChange={field.onChange}
												defaultValue={field.value}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="ステータスを選択" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="not_started">未着手</SelectItem>
													<SelectItem value="in_progress">進行中</SelectItem>
													<SelectItem value="completed">完了</SelectItem>
													<SelectItem value="on_hold">保留中</SelectItem>
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
																format(field.value, "PPP", { locale: ja })
															) : (
																<span>開始日を選択</span>
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
														locale={ja}
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>

								<FormField
									control={form.control}
									name="endDate"
									render={({ field }) => (
										<FormItem>
											<FormLabel>期限日</FormLabel>
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
																format(field.value, "PPP", { locale: ja })
															) : (
																<span>期限日を選択</span>
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
														locale={ja}
													/>
												</PopoverContent>
											</Popover>
											<FormMessage />
										</FormItem>
									)}
								/>
							</div>

							<div className="flex justify-end gap-2 pt-4">
								<Button
									type="button"
									variant="outline"
									onClick={() => onOpenChange?.(false)}
								>
									キャンセル
								</Button>
								<Button type="submit" disabled={isSubmitting}>
									{isSubmitting ? "保存中..." : isEditing ? "更新" : "作成"}
								</Button>
							</div>
						</form>
					</Form>
				</div>
			</ScrollArea>
		</ResponsiveDialog>
	);
}
