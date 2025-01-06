export type ApiProvider = "openai" | "anthropic" | "google";

export interface ApiKey {
	id: string;
	userId: string;
	provider: ApiProvider;
	isActive: boolean | null;
	createdAt: string | null;
	updatedAt: string | null;
}

export interface ApiKeyInput {
	provider: ApiProvider;
	apiKey: string;
}

export interface ApiKeyResponse {
	success: boolean;
	message: string;
	data?: ApiKey;
}
