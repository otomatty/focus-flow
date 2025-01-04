"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import { Label } from "@/components/ui/label";
import type {
	Schedule,
	CreateScheduleInput,
	ScheduleCategory,
	SchedulePriority,
	RecurrencePattern,
} from "../types";

interface Props {
	schedule?: Schedule;
	onSubmit: (data: CreateScheduleInput) => void;
	onCancel: () => void;
}

export function ScheduleForm({ schedule, onSubmit, onCancel }: Props) {
	const [formData, setFormData] = useState<CreateScheduleInput>({
		title: schedule?.title ?? "",
		description: schedule?.description ?? "",
		startDate: schedule?.startDate ?? new Date().toISOString().split("T")[0],
		startTime: schedule?.startTime ?? "09:00",
		endDate: schedule?.endDate ?? new Date().toISOString().split("T")[0],
		endTime: schedule?.endTime ?? "10:00",
		category: schedule?.category ?? "other",
		priority: schedule?.priority ?? "medium",
		isAllDay: schedule?.isAllDay ?? false,
		recurrence: schedule?.recurrence ?? {
			pattern: "none",
		},
		reminder: schedule?.reminder ?? {
			enabled: false,
			minutesBefore: 30,
		},
	});

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onSubmit(formData);
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="space-y-4">
				<div>
					<Label>タイトル</Label>
					<Input
						value={formData.title}
						onChange={(e) =>
							setFormData({ ...formData, title: e.target.value })
						}
						placeholder="予定のタイトル"
						required
					/>
				</div>

				<div>
					<Label>説明</Label>
					<Textarea
						value={formData.description}
						onChange={(e) =>
							setFormData({ ...formData, description: e.target.value })
						}
						placeholder="予定の説明"
					/>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label>開始日</Label>
						<Input
							type="date"
							value={formData.startDate}
							onChange={(e) =>
								setFormData({ ...formData, startDate: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<Label>開始時間</Label>
						<Input
							type="time"
							value={formData.startTime}
							onChange={(e) =>
								setFormData({ ...formData, startTime: e.target.value })
							}
							required
							disabled={formData.isAllDay}
						/>
					</div>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label>終了日</Label>
						<Input
							type="date"
							value={formData.endDate}
							onChange={(e) =>
								setFormData({ ...formData, endDate: e.target.value })
							}
							required
						/>
					</div>
					<div>
						<Label>終了時間</Label>
						<Input
							type="time"
							value={formData.endTime}
							onChange={(e) =>
								setFormData({ ...formData, endTime: e.target.value })
							}
							required
							disabled={formData.isAllDay}
						/>
					</div>
				</div>

				<div className="flex items-center space-x-2">
					<Switch
						checked={formData.isAllDay}
						onCheckedChange={(checked) =>
							setFormData({ ...formData, isAllDay: checked })
						}
					/>
					<Label>終日</Label>
				</div>

				<div className="grid grid-cols-2 gap-4">
					<div>
						<Label>カテゴリー</Label>
						<Select
							value={formData.category}
							onValueChange={(value: ScheduleCategory) =>
								setFormData({ ...formData, category: value })
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="work">仕事</SelectItem>
								<SelectItem value="personal">個人</SelectItem>
								<SelectItem value="habit">習慣</SelectItem>
								<SelectItem value="other">その他</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<div>
						<Label>優先度</Label>
						<Select
							value={formData.priority}
							onValueChange={(value: SchedulePriority) =>
								setFormData({ ...formData, priority: value })
							}
						>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="high">高</SelectItem>
								<SelectItem value="medium">中</SelectItem>
								<SelectItem value="low">低</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>

				<div>
					<Label>繰り返し</Label>
					<Select
						value={formData.recurrence.pattern}
						onValueChange={(value: RecurrencePattern) =>
							setFormData({
								...formData,
								recurrence: { ...formData.recurrence, pattern: value },
							})
						}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="none">繰り返しなし</SelectItem>
							<SelectItem value="daily">毎日</SelectItem>
							<SelectItem value="weekly">毎週</SelectItem>
							<SelectItem value="monthly">毎月</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center space-x-2">
					<Switch
						checked={formData.reminder?.enabled}
						onCheckedChange={(checked) =>
							setFormData({
								...formData,
								reminder: {
									...formData.reminder!,
									enabled: checked,
								},
							})
						}
					/>
					<Label>リマインダー</Label>
				</div>
			</div>

			<div className="flex justify-end space-x-2">
				<Button type="button" variant="outline" onClick={onCancel}>
					キャンセル
				</Button>
				<Button type="submit">保存</Button>
			</div>
		</form>
	);
}
