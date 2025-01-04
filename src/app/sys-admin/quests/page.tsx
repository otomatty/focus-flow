import type { Metadata } from "next";
import {
	getQuests,
	getQuestTypes,
	getQuestDifficulties,
} from "@/app/_actions/admin/quests";
import { QuestList } from "./_components/QuestList";

export const metadata: Metadata = {
	title: "クエスト管理 | Focus Flow",
	description: "クエストの作成、編集、削除を行います。",
};

export default async function QuestsPage() {
	const quests = await getQuests();
	const questTypes = await getQuestTypes();
	const difficulties = await getQuestDifficulties();

	return (
		<QuestList
			initialQuests={quests}
			questTypes={questTypes}
			difficulties={difficulties}
		/>
	);
}
