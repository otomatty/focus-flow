"use client";

import { useEffect, useState } from "react";
import { getSchedules } from "@/app/_actions/schedules";
import { useAuth } from "@/hooks/useAuth";
import type { Schedule, PriorityLevel } from "./types";
import { CalendarView } from "./_components/Calendar/CalendarView";
import { FilterBar } from "./_components/FilterBar";

export default function SchedulesPage() {
	const { user } = useAuth();
	const [schedules, setSchedules] = useState<Schedule[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const [selectedPriority, setSelectedPriority] =
		useState<PriorityLevel | null>(null);

	const fetchSchedules = async () => {
		if (!user) return;
		try {
			setIsLoading(true);
			const data = await getSchedules({
				userId: user.id,
				categoryId: selectedCategory || undefined,
				priority: selectedPriority || undefined,
			});
			setSchedules(data);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "スケジュールの取得に失敗しました",
			);
		} finally {
			setIsLoading(false);
		}
	};

	useEffect(() => {
		fetchSchedules();
	}, [user, selectedCategory, selectedPriority]);

	if (!user) {
		return <div>ログインが必要です</div>;
	}

	if (isLoading) {
		return <div>読み込み中...</div>;
	}

	if (error) {
		return <div>エラー: {error}</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">スケジュール</h1>
			<FilterBar
				onCategoryChange={setSelectedCategory}
				onPriorityChange={setSelectedPriority}
				selectedCategory={selectedCategory}
				selectedPriority={selectedPriority}
			/>
			<CalendarView schedules={schedules} />
		</div>
	);
}
