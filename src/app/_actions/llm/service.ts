import OpenAI from "openai";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { getApiKey } from "../settings/api-keys";
import type { ApiProvider } from "@/types/api-keys";

// 環境変数の型チェック
const GEMINI_API_KEY = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

if (!GEMINI_API_KEY) throw new Error("NEXT_PUBLIC_GEMINI_API_KEY is not set");

// OpenAIクライアントの取得（ユーザー設定のみ）
export async function getOpenAIClient(): Promise<OpenAI | null> {
	const userApiKey = await getApiKey("openai");
	if (!userApiKey) return null;
	return new OpenAI({ apiKey: userApiKey });
}

// Anthropicクライアントの取得（ユーザー設定のみ）
export async function getAnthropicClient(): Promise<Anthropic | null> {
	const userApiKey = await getApiKey("anthropic");
	if (!userApiKey) return null;
	return new Anthropic({ apiKey: userApiKey });
}

// Google AIクライアントの取得（デフォルトまたはユーザー設定）
export async function getGoogleAIClient(): Promise<GoogleGenerativeAI> {
	const userApiKey = await getApiKey("google");
	return new GoogleGenerativeAI(userApiKey || (GEMINI_API_KEY as string));
}

// LLMクライアントの取得
export async function getLLMClient(provider: ApiProvider) {
	switch (provider) {
		case "openai": {
			const client = await getOpenAIClient();
			if (!client) throw new Error("OpenAI API key is not set");
			return client;
		}
		case "anthropic": {
			const client = await getAnthropicClient();
			if (!client) throw new Error("Anthropic API key is not set");
			return client;
		}
		case "google":
			return getGoogleAIClient();
		default:
			throw new Error(`Unsupported provider: ${provider}`);
	}
}
