"use server";

import { generateResponse } from "@/lib/gemini/client";

export async function enhancePromptAction(prompt: string) {
	try {
		const context = `
あなたはタスク分解のエキスパートです。
以下のタスクプロンプトをより詳細で分析しやすい形式(Markdown)に強化してください。

強化のポイント：
1. 目的と期待される成果を明確に
2. 具体的な要件と制約条件の追加
3. 技術的な詳細の補完
4. 依存関係や前提条件の明確化
5. 成功基準の追加

元のプロンプトの意図や文脈は保持しつつ、より構造化された形式にしてください。
`;

		const response = await generateResponse(prompt, context);
		return { success: true, data: response };
	} catch (error) {
		console.error("プロンプト強化エラー:", error);
		return {
			success: false,
			error: error instanceof Error ? error.message : "Unknown error",
		};
	}
}
