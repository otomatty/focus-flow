"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createSchedule } from "@/app/_actions/schedules";
import { ScheduleForm } from "../_components/ScheduleForm";
import type { Schedule } from "../types";
import { format } from "date-fns";

export default function NewSchedulePage() {
	const router = useRouter();
	const { user } = useAuth();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const handleSubmit = async (
		data: Omit<
			Schedule,
			| "id"
			| "userId"
			| "createdAt"
			| "updatedAt"
			| "isGoogleSynced"
			| "googleEventData"
			| "googleSyncError"
			| "googleLastModified"
		>,
	) => {
		if (!user) return;
		try {
			setIsSubmitting(true);
			await createSchedule({
				userId: user.id,
				title: data.title,
				description: data.description,
				startDate: format(data.startDate, "yyyy-MM-dd"),
				startTime: data.startTime,
				endDate: format(data.endDate, "yyyy-MM-dd"),
				endTime: data.endTime,
				isAllDay: data.isAllDay,
				categoryId: data.categoryId,
				priority: data.priority,
				colorId: data.colorId,
				projectId: data.projectId,
				taskId: data.taskId,
				habitId: data.habitId,
			});
			router.push("/webapp/schedules");
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "スケジュールの作成に失敗しました",
			);
		} finally {
			setIsSubmitting(false);
		}
	};

	if (!user) {
		return <div>ログインが必要です</div>;
	}

	return (
		<div className="container mx-auto p-4">
			<h1 className="text-2xl font-bold mb-4">新規スケジュール作成</h1>
			{error && (
				<div className="bg-destructive/10 text-destructive p-4 rounded mb-4">
					{error}
				</div>
			)}
			<ScheduleForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
		</div>
	);
}
