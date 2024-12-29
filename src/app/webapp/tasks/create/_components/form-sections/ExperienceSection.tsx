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
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import type { FormData } from "../CreateTaskForm";

type Props = {
	control: Control<FormData>;
};

export function ExperienceSection({ control }: Props) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="experience_points"
				render={({ field }) => (
					<FormItem>
						<FormLabel>経験値</FormLabel>
						<FormControl>
							<Input
								type="number"
								min={0}
								{...field}
								onChange={(e) =>
									field.onChange(Number.parseInt(e.target.value))
								}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="skill_category"
				render={({ field }) => (
					<FormItem>
						<FormLabel>スキルカテゴリ</FormLabel>
						<Select onValueChange={field.onChange} defaultValue={field.value}>
							<FormControl>
								<SelectTrigger>
									<SelectValue placeholder="スキルカテゴリを選択" />
								</SelectTrigger>
							</FormControl>
							<SelectContent>
								<SelectItem value="frontend">フロントエンド</SelectItem>
								<SelectItem value="backend">バックエンド</SelectItem>
								<SelectItem value="design">デザイン</SelectItem>
								<SelectItem value="infrastructure">
									インフラストラクチャ
								</SelectItem>
								<SelectItem value="management">マネジメント</SelectItem>
								<SelectItem value="communication">
									コミュニケーション
								</SelectItem>
							</SelectContent>
						</Select>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={control}
				name="skill_distribution"
				render={({ field }) => (
					<FormItem>
						<FormLabel>スキル分配</FormLabel>
						<FormControl>
							<div className="space-y-4">
								{Object.entries(field.value || {}).map(([skill, points]) => (
									<div key={skill} className="flex items-center gap-4">
										<Badge className="w-32">{skill}</Badge>
										<div className="flex-1">
											<Slider
												value={[points]}
												onValueChange={([value]) => {
													const newDistribution = {
														...(field.value || {}),
														[skill]: value,
													};
													field.onChange(newDistribution);
												}}
												max={100}
												step={1}
											/>
										</div>
										<span className="w-12 text-right">{points}%</span>
									</div>
								))}
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
