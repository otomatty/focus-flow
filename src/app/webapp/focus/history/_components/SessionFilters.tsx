"use client";

import { useState } from "react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import type { DateRange } from "react-day-picker";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface SessionFiltersProps {
	onFilterChange: (filters: {
		dateRange: DateRange | undefined;
		sessionType: string;
		completionStatus: string;
	}) => void;
}

export function SessionFilters({ onFilterChange }: SessionFiltersProps) {
	const [dateRange, setDateRange] = useState<DateRange | undefined>();
	const [sessionType, setSessionType] = useState("all");
	const [completionStatus, setCompletionStatus] = useState("all");

	const handleFilterChange = () => {
		onFilterChange({
			dateRange,
			sessionType,
			completionStatus,
		});
	};

	return (
		<div className="space-y-6">
			<div>
				<Label>期間</Label>
				<DatePickerWithRange
					value={dateRange}
					onChange={(newDateRange) => {
						setDateRange(newDateRange);
						handleFilterChange();
					}}
				/>
			</div>

			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-2">
					<Label>セッションタイプ</Label>
					<Select
						value={sessionType}
						onValueChange={(value) => {
							setSessionType(value);
							handleFilterChange();
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="タイプを選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">すべて</SelectItem>
							<SelectItem value="focus">集中</SelectItem>
							<SelectItem value="break">休憩</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<div className="space-y-2">
					<Label>完了状態</Label>
					<Select
						value={completionStatus}
						onValueChange={(value) => {
							setCompletionStatus(value);
							handleFilterChange();
						}}
					>
						<SelectTrigger>
							<SelectValue placeholder="状態を選択" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="all">すべて</SelectItem>
							<SelectItem value="perfect">完璧</SelectItem>
							<SelectItem value="completed">完了</SelectItem>
							<SelectItem value="partial">一部完了</SelectItem>
							<SelectItem value="abandoned">中断</SelectItem>
						</SelectContent>
					</Select>
				</div>
			</div>
		</div>
	);
}
