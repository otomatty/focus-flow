"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";

interface Session {
	id: string;
	created_at: string | null;
	actual_start_time: string;
	end_time: string | null;
	session_type: string;
	actual_duration: number;
	completion_status: "PERFECT" | "COMPLETED" | "PARTIAL" | "ABANDONED";
	focus_rating: number | null;
	earned_exp: number;
	user_id: string;
}

interface SessionListProps {
	sessions: Session[];
}

export function SessionList({ sessions }: SessionListProps) {
	const getStatusColor = (status: string) => {
		switch (status) {
			case "perfect":
				return "bg-green-500";
			case "completed":
				return "bg-blue-500";
			case "partial":
				return "bg-yellow-500";
			case "abandoned":
				return "bg-red-500";
			default:
				return "bg-gray-500";
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case "perfect":
				return "完璧";
			case "completed":
				return "完了";
			case "partial":
				return "一部完了";
			case "abandoned":
				return "中断";
			default:
				return "不明";
		}
	};

	return (
		<div className="space-y-4">
			{sessions.map((session) => (
				<Card key={session.id} className="p-4">
					<div className="flex items-center justify-between">
						<div className="space-y-1">
							<div className="flex items-center space-x-2">
								<span className="font-medium">
									{session.session_type === "focus" ? "集中" : "休憩"}セッション
								</span>
								<Badge
									variant="secondary"
									className={getStatusColor(session.completion_status)}
								>
									{getStatusText(session.completion_status)}
								</Badge>
							</div>
							<p className="text-sm text-muted-foreground">
								{formatDistanceToNow(new Date(session.actual_start_time), {
									addSuffix: true,
									locale: ja,
								})}
							</p>
						</div>
						<div className="text-right">
							<div className="font-medium">{session.actual_duration}分</div>
							{session.focus_rating && (
								<div className="text-sm text-muted-foreground">
									集中度: {session.focus_rating}/5
								</div>
							)}
						</div>
					</div>
				</Card>
			))}
		</div>
	);
}
