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
import { Button } from "@/components/ui/button";
import { Plus, X } from "lucide-react";
import type { TaskFormData } from "@/types/task";

type Dependency = {
	task_id: string;
	type: "required" | "optional" | "conditional";
	link_type:
		| "finish_to_start"
		| "start_to_start"
		| "finish_to_finish"
		| "start_to_finish";
	lag_time?: string;
	conditions?: string;
	id: string;
};

type Props = {
	control: Control<TaskFormData>;
};

export function DependencySection({ control }: Props) {
	return (
		<div className="space-y-4">
			<FormField
				control={control}
				name="dependencies"
				render={({ field }) => (
					<FormItem>
						<FormLabel>依存関係</FormLabel>
						<FormControl>
							<div className="space-y-4">
								{field.value?.map((dependency, index) => (
									<div
										key={dependency.id}
										className="flex items-start gap-2 rounded-md border p-4"
									>
										<div className="flex-1 space-y-4">
											<Select
												value={dependency.type}
												onValueChange={(value) => {
													const newDependencies = [...(field.value || [])];
													newDependencies[index] = {
														...dependency,
														type: value as
															| "required"
															| "optional"
															| "conditional",
													};
													field.onChange(newDependencies);
												}}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="依存タイプを選択" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="required">必須</SelectItem>
													<SelectItem value="optional">オプション</SelectItem>
													<SelectItem value="conditional">条件付き</SelectItem>
												</SelectContent>
											</Select>

											<Select
												value={dependency.link_type}
												onValueChange={(value) => {
													const newDependencies = [...(field.value || [])];
													newDependencies[index] = {
														...dependency,
														link_type: value as
															| "finish_to_start"
															| "start_to_start"
															| "finish_to_finish"
															| "start_to_finish",
													};
													field.onChange(newDependencies);
												}}
											>
												<FormControl>
													<SelectTrigger>
														<SelectValue placeholder="リンクタイプを選択" />
													</SelectTrigger>
												</FormControl>
												<SelectContent>
													<SelectItem value="finish_to_start">
														完了後に開始
													</SelectItem>
													<SelectItem value="start_to_start">
														同時に開始
													</SelectItem>
													<SelectItem value="finish_to_finish">
														同時に完了
													</SelectItem>
													<SelectItem value="start_to_finish">
														開始後に完了
													</SelectItem>
												</SelectContent>
											</Select>

											<Input
												placeholder="ラグタイム（例: PT1H）"
												value={dependency.lag_time}
												onChange={(e) => {
													const newDependencies = [...(field.value || [])];
													newDependencies[index] = {
														...dependency,
														lag_time: e.target.value,
													};
													field.onChange(newDependencies);
												}}
											/>

											{dependency.type === "conditional" && (
												<Input
													placeholder="条件"
													value={dependency.conditions}
													onChange={(e) => {
														const newDependencies = [...(field.value || [])];
														newDependencies[index] = {
															...dependency,
															conditions: e.target.value,
														};
														field.onChange(newDependencies);
													}}
												/>
											)}
										</div>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											onClick={() => {
												const newDependencies = [...(field.value || [])];
												newDependencies.splice(index, 1);
												field.onChange(newDependencies);
											}}
										>
											<X className="h-4 w-4" />
										</Button>
									</div>
								))}
								<Button
									type="button"
									variant="outline"
									className="w-full"
									onClick={() => {
										field.onChange([
											...(field.value || []),
											{
												task_id: "",
												type: "required",
												link_type: "finish_to_start",
												id: crypto.randomUUID(),
											},
										]);
									}}
								>
									<Plus className="mr-2 h-4 w-4" />
									依存関係を追加
								</Button>
							</div>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>
		</div>
	);
}
