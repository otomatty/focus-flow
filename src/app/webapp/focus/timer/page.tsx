import { Suspense } from "react";
import { MainTimer } from "./_components/MainTimer";
import { TaskConnection } from "./_components/TaskConnection";
import { SessionSummary } from "./_components/SessionSummary";
import { Card } from "@/components/ui/card";
import { getFocusSessionHistory } from "@/app/_actions/focus/sessions";
import { createClient } from "@/lib/supabase/server";

export default async function TimerPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	// 今日のセッション履歴を取得
	const endDate = new Date();
	const startDate = new Date();
	startDate.setHours(0, 0, 0, 0);
	const todaysSessions = await getFocusSessionHistory(
		user.id,
		startDate,
		endDate,
		5,
	);

	// 現在進行中のセッションがあるかチェック
	const activeSession = todaysSessions.find((session) => !session.end_time);

	return (
		<div className="space-y-6">
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
				{/* メインタイマーエリア */}
				<div className="lg:col-span-2 space-y-6">
					<Card className="p-6">
						<Suspense fallback={<div>Loading...</div>}>
							<MainTimer activeSession={activeSession} />
						</Suspense>
					</Card>

					{/* タスク連携エリア */}
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">タスク連携</h2>
						<Suspense fallback={<div>Loading...</div>}>
							<TaskConnection />
						</Suspense>
					</Card>
				</div>

				{/* セッションサマリーエリア */}
				<div>
					<Card className="p-6">
						<h2 className="text-lg font-semibold mb-4">今日のセッション</h2>
						<Suspense fallback={<div>Loading...</div>}>
							<SessionSummary sessions={todaysSessions} />
						</Suspense>
					</Card>
				</div>
			</div>
		</div>
	);
}
