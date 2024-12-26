import { GoogleGenerativeAI } from "@google/generative-ai";
import { addDays } from "date-fns";
import type { ProjectFormValues } from "@/app/webapp/projects/_components/ProjectDialog";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
	throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(API_KEY);

interface ProjectSuggestion {
	description: string;
	status: "not_started" | "in_progress" | "completed" | "on_hold";
	priority: "high" | "medium" | "low";
	estimatedDays: number;
}

export async function generateProjectSuggestion(
	projectName: string,
): Promise<ProjectSuggestion> {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });

	const prompt = `
    プロジェクト名: "${projectName}"

    このプロジェクトについて以下の情報を予測してJSON形式で返してください：
    1. description: プロジェクトの説明文（100文字以内）
    2. status: プロジェクトの状態（"not_started", "in_progress", "completed", "on_hold"のいずれか）
    3. priority: プロジェクトの優先度（"high", "medium", "low"のいずれか）
    4. estimatedDays: プロジェクト完了までの予想日数（数値）

    プロジェクト名から判断して、適切な情報を生成してください。
    レスポンスは以下の形式で返してください：
    {
      "description": "説明文",
      "status": "ステータス",
      "priority": "優先度",
      "estimatedDays": 予想日数
    }
  `;

	try {
		const result = await model.generateContent(prompt);
		const response = await result.response;
		const suggestion = JSON.parse(response.text()) as ProjectSuggestion;
		return suggestion;
	} catch (error) {
		console.error("Failed to generate project suggestion:", error);
		throw new Error("プロジェクト情報の生成に失敗しました");
	}
}

export async function generateProjectFormValues(
	projectName: string,
): Promise<Partial<ProjectFormValues>> {
	const suggestion = await generateProjectSuggestion(projectName);
	const startDate = new Date();
	const endDate = addDays(startDate, suggestion.estimatedDays);

	return {
		name: projectName,
		description: suggestion.description,
		status: suggestion.status,
		priority: suggestion.priority,
		startDate,
		endDate,
	};
}
