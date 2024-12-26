"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { formatDuration } from "@/lib/utils";
import { useEffect, useState } from "react";

interface TaskBreakdownPreviewProps {
	title: string;
	description: string;
	analysis: {
		suggestedPriority: "high" | "medium" | "low";
		suggestedCategory: string;
		suggestedDueDate: string;
		totalEstimatedDuration: string;
		totalExperiencePoints: number;
		skillDistribution: Record<string, number>;
		breakdowns: {
			orderIndex: number;
			title: string;
			description?: string;
			estimatedDuration: string;
			experiencePoints: number;
			skillCategory: string;
		}[];
	} | null;
	isLoading: boolean;
}

export function TaskBreakdownPreview({
	title,
	description,
	analysis,
	isLoading,
}: TaskBreakdownPreviewProps) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return null;
	}

	if (isLoading) {
		return (
			<Card>
				<CardHeader>
					<CardTitle>
						<Skeleton className="h-6 w-32" />
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="space-y-2">
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!analysis) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle>タスクの分解</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				<div className="rounded-lg border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead className="w-[100px]">順序</TableHead>
								<TableHead>タスク</TableHead>
								<TableHead>所要時間</TableHead>
								<TableHead>経験値</TableHead>
								<TableHead>スキル</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{analysis.breakdowns.map((breakdown) => (
								<TableRow key={breakdown.orderIndex}>
									<TableCell>{breakdown.orderIndex}</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{breakdown.title}</div>
											{breakdown.description && (
												<div className="text-sm text-muted-foreground">
													{breakdown.description}
												</div>
											)}
										</div>
									</TableCell>
									<TableCell>
										{formatDuration(breakdown.estimatedDuration)}
									</TableCell>
									<TableCell>{breakdown.experiencePoints} XP</TableCell>
									<TableCell>
										<Badge variant="outline">{breakdown.skillCategory}</Badge>
									</TableCell>
								</TableRow>
							))}
						</TableBody>
					</Table>
				</div>

				<div className="space-y-4">
					<h4 className="text-sm font-medium">スキル分布</h4>
					<div className="space-y-2">
						{Object.entries(analysis.skillDistribution).map(
							([skill, percentage]) => (
								<div key={skill} className="flex items-center gap-2">
									<div className="w-24 text-sm">{skill}</div>
									<Progress value={percentage} className="flex-1" />
									<div className="w-12 text-sm text-right">
										{percentage.toFixed(1)}%
									</div>
								</div>
							),
						)}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
