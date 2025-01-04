"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Clock } from "lucide-react";
import type { ScheduleTemplate } from "./types";

const sampleTemplates: ScheduleTemplate[] = [
	{
		id: "1",
		name: "平日のルーチン",
		description: "月曜日 - 金曜日",
		applyTo: {
			days: [1, 2, 3, 4, 5], // 月-金
		},
		slots: [
			{
				id: "1",
				startTime: "07:00",
				endTime: "08:00",
				title: "朝の運動",
			},
			{
				id: "2",
				startTime: "09:00",
				endTime: "12:00",
				title: "仕事開始",
			},
			{
				id: "3",
				startTime: "12:00",
				endTime: "13:00",
				title: "ランチブレイク",
			},
		],
	},
	{
		id: "2",
		name: "週末のルーチン",
		description: "土曜日 - 日曜日",
		applyTo: {
			days: [0, 6], // 日,土
		},
		slots: [
			{
				id: "1",
				startTime: "08:00",
				endTime: "09:00",
				title: "朝食",
			},
			{
				id: "2",
				startTime: "10:00",
				endTime: "12:00",
				title: "趣味の時間",
			},
		],
	},
];

interface Props {
	onApplyTemplate: (template: ScheduleTemplate) => void;
}

export function TemplateEditor({ onApplyTemplate }: Props) {
	return (
		<Card className="p-4">
			<div className="space-y-4">
				<div className="flex justify-between items-center">
					<h2 className="text-lg font-semibold">テンプレート</h2>
					<Button size="sm" variant="outline">
						<Plus className="h-4 w-4 mr-2" />
						新規作成
					</Button>
				</div>

				<div className="space-y-2">
					{sampleTemplates.map((template) => (
						<Card
							key={template.id}
							className="p-3 hover:bg-accent/50 cursor-pointer transition-colors relative group"
						>
							<div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
								<Button
									size="sm"
									variant="secondary"
									onClick={() => onApplyTemplate(template)}
								>
									適用
								</Button>
							</div>
							<div>
								<h3 className="font-medium">{template.name}</h3>
								<p className="text-sm text-muted-foreground">
									{template.description}
								</p>
							</div>
							<div className="mt-2 space-y-1">
								{template.slots.map((slot) => (
									<div
										key={slot.id}
										className="flex items-center text-sm text-muted-foreground"
									>
										<Clock className="h-3 w-3 mr-1" />
										<span>
											{slot.startTime} - {slot.endTime} {slot.title}
										</span>
									</div>
								))}
							</div>
						</Card>
					))}
				</div>
			</div>
		</Card>
	);
}
