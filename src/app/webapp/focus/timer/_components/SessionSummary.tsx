import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CheckCircle, Clock, Star } from "lucide-react";
import type { Database } from "@/types/supabase";

type FocusSession = Database["ff_focus"]["Tables"]["focus_sessions"]["Row"];

interface SessionSummaryProps {
	sessions: FocusSession[];
}

export function SessionSummary({ sessions }: SessionSummaryProps) {
	// 今日の統計を計算
	const totalSessions = sessions.length;
	const completedSessions = sessions.filter(
		(s) =>
			s.completion_status === "PERFECT" || s.completion_status === "COMPLETED",
	).length;
	const totalMinutes = sessions.reduce((acc, session) => {
		if (session.actual_duration) {
			const minutes = Number.parseInt(
				session.actual_duration.toString().split(" ")[0],
			);
			return acc + minutes;
		}
		return acc;
	}, 0);

	return (
		<div className="space-y-6">
			{/* 今日の統計 */}
			<div className="grid grid-cols-2 gap-4">
				<div className="space-y-1">
					<p className="text-sm text-muted-foreground">完了セッション</p>
					<p className="text-2xl font-bold">
						{completedSessions}/{totalSessions}
					</p>
				</div>
				<div className="space-y-1">
					<p className="text-sm text-muted-foreground">総集中時間</p>
					<p className="text-2xl font-bold">{totalMinutes}分</p>
				</div>
			</div>

			{/* 最近のセッション */}
			<div className="space-y-4">
				{sessions.map((session) => (
					<div
						key={session.id}
						className="flex items-center justify-between p-3 rounded-lg bg-card/50"
					>
						<div className="flex items-center gap-3">
							<div
								className={`p-2 rounded-full ${
									session.completion_status === "PERFECT"
										? "bg-green-500/10"
										: session.completion_status === "COMPLETED"
											? "bg-blue-500/10"
											: session.completion_status === "PARTIAL"
												? "bg-yellow-500/10"
												: "bg-red-500/10"
								}`}
							>
								<CheckCircle
									className={`h-4 w-4 ${
										session.completion_status === "PERFECT"
											? "text-green-500"
											: session.completion_status === "COMPLETED"
												? "text-blue-500"
												: session.completion_status === "PARTIAL"
													? "text-yellow-500"
													: "text-red-500"
									}`}
								/>
							</div>
							<div>
								<p className="text-sm font-medium">
									{format(new Date(session.actual_start_time), "p", {
										locale: ja,
									})}
								</p>
								<div className="flex items-center gap-2 text-xs text-muted-foreground">
									<Clock className="h-3 w-3" />
									<span>
										{session.actual_duration
											? `${session.actual_duration.toString().split(" ")[0]}分`
											: "-"}
									</span>
									<Star className="h-3 w-3" />
									<span>{session.focus_rating}/5</span>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
