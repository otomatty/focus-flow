"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserPlus, Settings, AlertTriangle, CheckCircle } from "lucide-react";
import type { TimelineEvent } from "@/app/_actions/admin/metrics";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface ActivityTimelineProps {
	events: TimelineEvent[];
}

function getEventIcon(type: TimelineEvent["type"]) {
	switch (type) {
		case "user":
			return <UserPlus className="h-4 w-4" />;
		case "system":
			return <Settings className="h-4 w-4" />;
		case "error":
			return <AlertTriangle className="h-4 w-4 text-destructive" />;
		case "success":
			return <CheckCircle className="h-4 w-4 text-success" />;
	}
}

export function ActivityTimeline({ events }: ActivityTimelineProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle>最近のアクティビティ</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[400px] pr-4">
					<div className="space-y-8">
						{events.map((event) => (
							<div key={event.id} className="flex gap-4">
								<div className="flex h-8 w-8 items-center justify-center rounded-full border">
									{getEventIcon(event.type)}
								</div>
								<div className="space-y-1.5">
									<p className="text-sm font-medium leading-none">
										{event.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{event.description}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatDistanceToNow(new Date(event.timestamp), {
											addSuffix: true,
											locale: ja,
										})}
									</p>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
