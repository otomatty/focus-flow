import { NextResponse } from "next/server";
import { toggleQuestActive } from "@/app/_actions/admin/quests";

interface RouteParams {
	params: {
		id: string;
	};
}

export async function PUT(request: Request, { params }: RouteParams) {
	try {
		const { isActive } = await request.json();
		const quest = await toggleQuestActive(params.id, isActive);
		return NextResponse.json(quest);
	} catch (error) {
		return NextResponse.json(
			{ error: "クエストの状態更新に失敗しました" },
			{ status: 500 },
		);
	}
}
