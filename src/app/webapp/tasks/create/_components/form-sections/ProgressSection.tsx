"use client";

import type { Control } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
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

export function ProgressSection({ control }: Props) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="status"
				render={({ field }) => (
					<FormItem>
						<FormLabel>ステータス</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="ステータスを選択" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="not_started">未着手</SelectItem>
								<SelectItem value="in_progress">進行中</SelectItem>
								<SelectItem value="in_review">レビュー中</SelectItem>
								<SelectItem value="blocked">ブロック中</SelectItem>
								<SelectItem value="completed">完了</SelectItem>
								<SelectItem value="cancelled">キャンセル</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="progress_percentage"
				render={({ field }) => (
					<FormItem>
						<FormLabel>進捗率 ({field.value}%)</FormLabel>
						<FormControl>
							<Slider
								value={[field.value ?? 0]}
								onValueChange={([value]) => field.onChange(value)}
								max={100}
								step={1}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="actual_duration"
				render={({ field }) => (
					<FormItem>
						<FormLabel>実際の所要時間</FormLabel>
						<FormControl>
							<Input
								type="text"
								placeholder="例: PT2H30M（2時間30分）"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
