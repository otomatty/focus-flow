import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { QuestDetails } from "./_components/QuestDetails";
import { QuestProgress } from "./_components/QuestProgress";
import { QuestRequirements } from "./_components/QuestRequirements";
import { QuestRewards } from "./_components/QuestRewards";
import type { Quest, UserQuest } from "@/types/quests";

interface QuestPageProps {
	params: {
		id: string;
	};
}

export const metadata: Metadata = {
	title: "クエスト詳細 | Focus Flow",
	description: "クエストの詳細情報と進捗状況を確認できます。",
};

// TODO: 実際のデータ取得ロジックを実装
const mockQuest: Quest = {
	id: "1",
	title: "タスクマスター",
	description: "10個のタスクを完了しよう",
	quest_type: "TASK_COMPLETION" as const,
	requirements: [
		{
			type: "task_count",
			target: 10,
			current: 3,
		},
	],
	reward_exp: 100,
	reward_badge_id: "badge-1",
	created_at: new Date().toISOString(),
	duration_type: "weekly",
};

const mockUserQuest: UserQuest = {
	id: "uq-1",
	user_id: "user-1",
	quest_id: "1",
	status: "IN_PROGRESS",
	progress: {
		current: 3,
		target: 10,
		percentage: 30,
	},
	start_date: new Date().toISOString(),
	end_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
	completed_at: null,
	created_at: new Date().toISOString(),
	updated_at: new Date().toISOString(),
};

export default function QuestPage({ params }: QuestPageProps) {
	// TODO: クエスト情報の取得ロジックを実装
	const questId = params.id;

	// TODO: 実際のクエストデータ取得後に削除
	if (questId !== "1") {
		notFound();
	}

	return (
		<div className="container mx-auto py-6 space-y-6">
			<QuestDetails quest={mockQuest} userQuest={mockUserQuest} />
			<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
				<QuestProgress quest={mockQuest} userQuest={mockUserQuest} />
				<QuestRewards quest={mockQuest} />
			</div>
			<QuestRequirements quest={mockQuest} userQuest={mockUserQuest} />
		</div>
	);
}
