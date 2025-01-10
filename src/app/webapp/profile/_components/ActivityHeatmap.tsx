"use client";

import { useEffect, useState } from "react";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	type ActivityHeatmapData,
	getActivityHeatmap,
} from "@/app/_actions/users/activity-heatmap";
import { cn } from "@/lib/utils";

interface ActivityHeatmapProps {
	userId: string;
}

export function ActivityHeatmap({ userId }: ActivityHeatmapProps) {
	const [activities, setActivities] = useState<ActivityHeatmapData[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				// 過去1年間のデータを取得
				const endDate = new Date().toISOString().split("T")[0];
				const startDate = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000)
					.toISOString()
					.split("T")[0];

				const data = await getActivityHeatmap(userId, startDate, endDate);
				setActivities(data);
			} catch (error) {
				console.error("Failed to fetch activity heatmap:", error);
			} finally {
				setIsLoading(false);
			}
		};

		fetchActivities();
	}, [userId]);

	// 週ごとにデータをグループ化
	const weeks = activities
		.reduce<ActivityHeatmapData[][]>((acc, activity) => {
			const date = new Date(activity.activityDate);
			const weekIndex = Math.floor(
				(activities.length - 1 - activities.indexOf(activity)) / 7,
			);
			acc[weekIndex] = acc[weekIndex] || [];
			acc[weekIndex].push(activity);
			return acc;
		}, [])
		.map((week) => {
			// 週の最初の日付をキーとして使用
			const weekKey = week[0]?.activityDate || "";
			return { key: weekKey, data: week };
		});

	if (isLoading) {
		return <div className="h-32 animate-pulse bg-muted rounded-lg" />;
	}

	const activityLevelColors = {
		0: "bg-muted hover:bg-muted/80",
		1: "bg-emerald-200/20 hover:bg-emerald-200/30",
		2: "bg-emerald-300/30 hover:bg-emerald-300/40",
		3: "bg-emerald-400/40 hover:bg-emerald-400/50",
		4: "bg-emerald-500/50 hover:bg-emerald-500/60",
	};

	return (
		<div className="space-y-2">
			<h3 className="text-sm font-medium">活動履歴</h3>
			<div className="flex gap-1">
				{weeks.map((week) => (
					<div key={week.key} className="flex flex-col gap-1">
						{week.data.map((day) => (
							<TooltipProvider key={day.activityDate}>
								<Tooltip>
									<TooltipTrigger asChild>
										<div
											className={cn(
												"w-3 h-3 rounded-sm transition-colors",
												activityLevelColors[
													day.activityLevel as keyof typeof activityLevelColors
												],
											)}
										/>
									</TooltipTrigger>
									<TooltipContent>
										<div className="text-xs">
											<p className="font-medium">
												{new Date(day.activityDate).toLocaleDateString("ja-JP")}
											</p>
											<p>活動レベル: {day.activityLevel}</p>
											<p>タスク完了: {day.completedTasks}</p>
											<p>フォーカス時間: {day.focusMinutes}分</p>
											<p>習慣完了: {day.completedHabits}</p>
										</div>
									</TooltipContent>
								</Tooltip>
							</TooltipProvider>
						))}
					</div>
				))}
			</div>
			<div className="flex items-center gap-2 text-xs text-muted-foreground">
				<span>活動レベル:</span>
				<div className="flex gap-1">
					{Object.entries(activityLevelColors).map(([level, color]) => (
						<div
							key={level}
							className={cn("w-3 h-3 rounded-sm", color)}
							title={`レベル ${level}`}
						/>
					))}
				</div>
			</div>
		</div>
	);
}
