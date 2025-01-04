import { NextResponse } from "next/server";
import { createQuest } from "@/app/_actions/admin/quests";

export async function POST(request: Request) {
	try {
		const data = await request.json();
		const quest = await createQuest(data);
		return NextResponse.json(quest);
	} catch (error) {
		return NextResponse.json(
			{ error: "クエストの作成に失敗しました" },
			{ status: 500 },
		);
	}
}
