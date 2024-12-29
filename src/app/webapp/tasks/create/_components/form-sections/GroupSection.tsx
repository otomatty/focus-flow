"use client";

import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { TaskFormData } from "@/types/task";

type Props = {
	control: Control<TaskFormData>;
};

export function GroupSection({ control }: Props) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="project_id"
				render={({ field }) => (
					<FormItem>
						<FormLabel>プロジェクト</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="プロジェクトを選択" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="project1">プロジェクト1</SelectItem>
								<SelectItem value="project2">プロジェクト2</SelectItem>
								<SelectItem value="project3">プロジェクト3</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="parent_group_id"
				render={({ field }) => (
					<FormItem>
						<FormLabel>親グループ</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="親グループを選択" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="group1">グループ1</SelectItem>
								<SelectItem value="group2">グループ2</SelectItem>
								<SelectItem value="group3">グループ3</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="view_type"
				render={({ field }) => (
					<FormItem>
						<FormLabel>ビュータイプ</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="ビュータイプを選択" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="list">リスト</SelectItem>
								<SelectItem value="kanban">カンバン</SelectItem>
								<SelectItem value="gantt">ガントチャート</SelectItem>
								<SelectItem value="mindmap">マインドマップ</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
