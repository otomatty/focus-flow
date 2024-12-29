"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { TextareaAutosize } from "@/components/ui/textarea-autosize";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Loader2, Sparkles, FileText } from "lucide-react";
import type { Control } from "react-hook-form";
import type { TaskFormData } from "@/types/task";
import { enhancePromptAction } from "@/app/_actions/tasks/enhance";
import { TASK_TEMPLATES } from "@/constants/taskTemplates";

interface TaskPromptFieldProps {
	control: Control<TaskFormData>;
	isAnalyzing: boolean;
}

export function TaskPromptField({
	control,
	isAnalyzing,
}: TaskPromptFieldProps) {
	const [isEnhancing, setIsEnhancing] = useState(false);

	const handleTemplateSelect = (
		category: string,
		onChange: (value: string) => void,
	) => {
		const template = TASK_TEMPLATES[category]?.[0];
		if (template) {
			onChange(template.description);
		}
	};

	const handleEnhancePrompt = async (
		value: string,
		onChange: (value: string) => void,
	) => {
		if (!value.trim()) return;
		setIsEnhancing(true);
		try {
			const result = await enhancePromptAction(value);
			if (result.success && result.data) {
				onChange(result.data);
			}
		} catch (error) {
			console.error("プロンプト強化エラー:", error);
		} finally {
			setIsEnhancing(false);
		}
	};

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-4">
				<div className="flex gap-2">
					<FormField
						control={control}
						name="description"
						render={({ field }) => (
							<>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="outline" size="sm" className="gap-2">
											<FileText className="h-4 w-4" />
											テンプレート
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-80">
										<div className="space-y-4">
											<h4 className="font-medium">テンプレートを選択</h4>
											<Select
												onValueChange={(value) =>
													handleTemplateSelect(value, field.onChange)
												}
											>
												<SelectTrigger>
													<SelectValue placeholder="テンプレートを選択" />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="開発">新機能開発</SelectItem>
													<SelectItem value="レビュー">
														コードレビュー
													</SelectItem>
													<SelectItem value="学習">新技術の学習</SelectItem>
													<SelectItem value="プロジェクト管理">
														スプリント計画
													</SelectItem>
													<SelectItem value="ドキュメント">
														技術文書作成
													</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</PopoverContent>
								</Popover>
								<Popover>
									<PopoverTrigger asChild>
										<Button
											variant="outline"
											size="sm"
											className="gap-2"
											disabled={isEnhancing}
											onClick={() =>
												handleEnhancePrompt(field.value || "", field.onChange)
											}
										>
											{isEnhancing ? (
												<Loader2 className="h-4 w-4 animate-spin" />
											) : (
												<Sparkles className="h-4 w-4" />
											)}
											プロンプトを強化
										</Button>
									</PopoverTrigger>
									<PopoverContent className="w-80">
										<div className="space-y-2">
											<h4 className="font-medium">プロンプト強化</h4>
											<p className="text-sm text-muted-foreground">
												AIがプロンプトを分析し、より詳細で効果的な記述に強化します。
											</p>
										</div>
									</PopoverContent>
								</Popover>
							</>
						)}
					/>
				</div>
				<FormField
					control={control}
					name="description"
					render={({ field }) => (
						<FormItem>
							<FormLabel>タスクのプロンプト</FormLabel>
							<FormControl>
								<TextareaAutosize
									placeholder="実現したいタスクの内容を詳しく記述してください。目的、要件、制約条件などを含めることで、より正確な分析と分解が可能になります。"
									className="min-h-[150px] resize-y"
									{...field}
									disabled={isAnalyzing}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</div>
		</div>
	);
}
