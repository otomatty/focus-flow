import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!API_KEY) {
	throw new Error("Missing Gemini API key");
}

const genAI = new GoogleGenerativeAI(API_KEY);

export async function generateEmbedding(text: string) {
	try {
		if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
			throw new Error("Gemini API key is not set");
		}

		const model = genAI.getGenerativeModel({ model: "embedding-001" });
		console.log("Generating embedding for:", text);
		const result = await model.embedContent(text);
		console.log("Embedding generated successfully");
		return result.embedding;
	} catch (error) {
		console.error("Gemini embedding error:", error);
		throw error;
	}
}

export async function generateResponse(question: string, context: string) {
	const model = genAI.getGenerativeModel({ model: "gemini-pro" });
	const prompt = `
    Context: ${context}
    
    Question: ${question}
    
    Please provide a helpful response based on the context above.
  `;

	const result = await model.generateContent(prompt);
	const response = await result.response;
	return response.text();
}
