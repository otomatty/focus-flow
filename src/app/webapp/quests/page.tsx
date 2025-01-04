import { PageHeader } from "@/components/custom/PageHeader";
import { QuestListClient } from "./_components/QuestListClient";
import { sampleQuests } from "./_fixtures/sample-quests";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "クエスト | Focus Flow",
	description: "タスクをこなしてクエストを達成しよう！",
};

// TODO: データ取得ロジックを実装
async function getQuests() {
	// 開発用のサンプルデータを返す
	return sampleQuests;
}

export default async function QuestsPage() {
	const quests = await getQuests();

	return (
		<div className="space-y-8 container">
			<PageHeader
				title="クエスト"
				description="タスクをこなしてクエストを達成しよう！"
				backHref="/webapp"
			/>
			<QuestListClient quests={quests} />
		</div>
	);
}
