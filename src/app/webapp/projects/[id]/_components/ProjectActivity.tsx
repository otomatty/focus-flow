"use client";

import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { projectAtom } from "@/stores/project";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getProjectActivities } from "@/app/_actions/activities.action";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import {
	FileEdit,
	ListTodo,
	CheckCircle2,
	Trash2,
	Users,
	AlertCircle,
} from "lucide-react";
import type { Activity } from "@/types/activity";
import { Skeleton } from "@/components/ui/skeleton";

const activityIconMap = {
	project_update: <FileEdit className="h-4 w-4" />,
	task_create: <ListTodo className="h-4 w-4" />,
	task_update: <CheckCircle2 className="h-4 w-4" />,
	task_delete: <Trash2 className="h-4 w-4" />,
	member_update: <Users className="h-4 w-4" />,
} as const;

function ActivitySkeleton() {
	return (
		<div className="space-y-4">
			<div className="flex items-start gap-3">
				<Skeleton className="h-4 w-4 mt-0.5" />
				<div className="flex-1 space-y-1">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Skeleton className="h-4 w-4 mt-0.5" />
				<div className="flex-1 space-y-1">
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-3 w-1/3" />
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Skeleton className="h-4 w-4 mt-0.5" />
				<div className="flex-1 space-y-1">
					<Skeleton className="h-4 w-4/5" />
					<Skeleton className="h-3 w-2/5" />
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Skeleton className="h-4 w-4 mt-0.5" />
				<div className="flex-1 space-y-1">
					<Skeleton className="h-4 w-3/4" />
					<Skeleton className="h-3 w-1/2" />
				</div>
			</div>
			<div className="flex items-start gap-3">
				<Skeleton className="h-4 w-4 mt-0.5" />
				<div className="flex-1 space-y-1">
					<Skeleton className="h-4 w-2/3" />
					<Skeleton className="h-3 w-1/3" />
				</div>
			</div>
		</div>
	);
}

export function ProjectActivity() {
	const [project] = useAtom(projectAtom);
	const [activities, setActivities] = useState<Activity[]>([]);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (!project) return;

		const fetchActivities = async () => {
			setIsLoading(true);
			const { activities: rawActivities, error } = await getProjectActivities(
				project.id,
			);
			if (error) {
				setError(error);
			} else if (rawActivities) {
				const convertedActivities = rawActivities.map((activity) => {
					const { user, ...rest } = activity;
					return {
						id: rest.id,
						projectId: rest.project_id,
						type: rest.type,
						action: rest.action,
						details: rest.details,
						createdAt: rest.created_at,
						updatedAt: rest.updated_at,
						userId: rest.user_id,
						user: user ? { email: user.email } : undefined,
					} as Activity;
				});
				setActivities(convertedActivities);
			}
			setIsLoading(false);
		};

		fetchActivities();
	}, [project]);

	if (!project) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>最近のアクティビティ</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<ActivitySkeleton />
				) : error ? (
					<div className="flex items-center justify-center gap-2 py-6 text-sm text-destructive">
						<AlertCircle className="h-4 w-4" />
						<span>{error}</span>
					</div>
				) : activities.length > 0 ? (
					<div className="space-y-4">
						{activities.map((activity) => (
							<div key={activity.id} className="flex items-start gap-3 text-sm">
								<div className="flex-none mt-0.5">
									{activityIconMap[activity.type]}
								</div>
								<div className="flex-1 space-y-1">
									<div>{activity.action}</div>
									<div className="text-xs text-muted-foreground">
										{format(
											new Date(activity.createdAt ?? ""),
											"yyyy/MM/dd HH:mm",
											{ locale: ja },
										)}
										{activity.user?.email && <> by {activity.user.email}</>}
									</div>
								</div>
							</div>
						))}
					</div>
				) : (
					<div className="text-center py-6 text-sm text-muted-foreground">
						アクティビティはまだありません
					</div>
				)}
			</CardContent>
		</Card>
	);
}
