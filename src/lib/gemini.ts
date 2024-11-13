import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

export async function subdivideTask(taskTitle: string): Promise<string[]> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
以下のタスクを具体的な小さなサブタスクに分解してください。
各サブタスクは実行可能な単位で、1行に1つずつ記載してください。
サブタスクの数は3-5個程度が望ましいです。

タスク: ${taskTitle}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return text.split('\n').filter(line => line.trim() !== '');
  } catch (error) {
    console.error('タスクの細分化に失敗しました:', error);
    return [];
  }
}

export async function estimateTaskDuration(taskTitle: string): Promise<number> {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `
以下のタスクの所要時間を分単位で推定してください。
回答は数字のみを返してください。

タスク: ${taskTitle}
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const minutes = parseInt(response.text().trim(), 10);
    return isNaN(minutes) ? 30 : minutes; // デフォルト値として30分を返す
  } catch (error) {
    console.error('タスクの所要時間推定に失敗しました:', error);
    return 30;
  }
}