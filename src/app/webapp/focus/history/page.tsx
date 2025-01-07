import { getFocusSessionHistory } from "@/app/_actions/focus/sessions";
import { createClient } from "@/lib/supabase/server";
import { SessionList } from "./_components/SessionList";

export default async function HistoryPage() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) return null;

	const endDate = new Date();
	const startDate = new Date();
	startDate.setDate(startDate.getDate() - 30); // 過去30日分を表示

	const sessions = await getFocusSessionHistory(
		user.id,
		startDate,
		endDate,
		50,
	);

	const formattedSessions = sessions.map((session) => ({
		...session,
		actual_duration: Number(session.actual_duration),
	}));

	return (
		<div className="space-y-6">
			<div>
				<h1 className="text-2xl font-bold tracking-tight">セッション履歴</h1>
				<p className="text-muted-foreground">
					過去のフォーカスセッションの記録を確認できます
				</p>
			</div>

			<SessionList sessions={formattedSessions} />
		</div>
	);
}
