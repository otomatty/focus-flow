"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Medal, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

interface Activity {
	id: string;
	type: "task" | "focus" | "badge" | "quest";
	title: string;
	description: string;
	timestamp: Date;
	metadata?: {
		taskId?: string;
		focusSessionId?: string;
		badgeId?: string;
		questId?: string;
	};
}

interface ActivityTimelineProps {
	activities: Activity[];
}

export function ActivityTimeline({ activities }: ActivityTimelineProps) {
	const getActivityIcon = (type: Activity["type"]) => {
		const iconClasses = "w-6 h-6";
		switch (type) {
			case "task":
				return <CheckCircle className={cn(iconClasses, "text-emerald-500")} />;
			case "focus":
				return <Clock className={cn(iconClasses, "text-blue-500")} />;
			case "badge":
				return <Medal className={cn(iconClasses, "text-amber-500")} />;
			case "quest":
				return <Target className={cn(iconClasses, "text-purple-500")} />;
		}
	};

	const getActivityColor = (type: Activity["type"]) => {
		switch (type) {
			case "task":
				return "from-emerald-500/20 to-emerald-500/5";
			case "focus":
				return "from-blue-500/20 to-blue-500/5";
			case "badge":
				return "from-amber-500/20 to-amber-500/5";
			case "quest":
				return "from-purple-500/20 to-purple-500/5";
		}
	};

	if (activities.length === 0) {
		return (
			<Card className="bg-card/50 backdrop-blur-sm border-border/50">
				<CardHeader>
					<CardTitle className="text-primary">アクティビティログ</CardTitle>
				</CardHeader>
				<CardContent>
					<p className="text-muted-foreground text-center">
						アクティビティはありません
					</p>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className="bg-card/50 backdrop-blur-sm border-border/50">
			<CardHeader>
				<CardTitle className="text-primary">アクティビティログ</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-6">
					{activities.map((activity, index) => (
						<motion.div
							key={activity.id}
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: index * 0.1 }}
							className={cn(
								"relative p-4 rounded-lg transition-all",
								"bg-gradient-to-b",
								getActivityColor(activity.type),
								"hover:shadow-lg hover:scale-[1.02]",
							)}
						>
							<div className="flex items-start space-x-4">
								<div className="mt-1 p-2 rounded-full bg-background/50 backdrop-blur-sm">
									{getActivityIcon(activity.type)}
								</div>
								<div className="flex-1 space-y-1">
									<p className="font-medium text-foreground">
										{activity.title}
									</p>
									<p className="text-sm text-muted-foreground">
										{activity.description}
									</p>
									<p className="text-xs text-muted-foreground">
										{activity.timestamp.toLocaleString()}
									</p>
								</div>
							</div>
						</motion.div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
