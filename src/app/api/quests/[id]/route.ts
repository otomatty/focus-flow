import { NextResponse } from "next/server";
import { updateQuest, deleteQuest } from "@/app/_actions/admin/quests";

interface RouteParams {
	params: {
		id: string;
	};
}

export async function PUT(request: Request, { params }: RouteParams) {
	try {
		const data = await request.json();
		const quest = await updateQuest(params.id, data);
		return NextResponse.json(quest);
	} catch (error) {
		return NextResponse.json(
			{ error: "クエストの更新に失敗しました" },
			{ status: 500 },
		);
	}
}

export async function DELETE(_request: Request, { params }: RouteParams) {
	try {
		await deleteQuest(params.id);
		return NextResponse.json({ success: true });
	} catch (error) {
		return NextResponse.json(
			{ error: "クエストの削除に失敗しました" },
			{ status: 500 },
		);
	}
}
