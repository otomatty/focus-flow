import { Suspense } from "react";
import type { Metadata } from "next";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ApiKeyForm } from "./_components/api-key-form";
import { createClient } from "@/lib/supabase/server";
import type { ApiProvider, ApiKey } from "@/types/api-keys";

export const metadata: Metadata = {
	title: "API設定 - Focus Flow",
	description: "LLMプロバイダーのAPIキーを設定します。",
};

const providers: { id: ApiProvider; name: string; description: string }[] = [
	{
		id: "google",
		name: "Google Gemini",
		description: "デフォルトで使用されるLLMプロバイダーです。",
	},
	{
		id: "openai",
		name: "OpenAI",
		description: "GPT-4などのモデルを使用できます。",
	},
	{
		id: "anthropic",
		name: "Anthropic",
		description: "Claude 3などのモデルを使用できます。",
	},
];

async function getApiKeys() {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) return null;

	const { data } = await supabase
		.schema("ff_users")
		.from("api_keys")
		.select("*")
		.eq("user_id", user.id);

	return data as ApiKey[] | null;
}

export default async function ApiKeysPage() {
	const apiKeys = await getApiKeys();

	return (
		<div className="container mx-auto py-6">
			<div className="mb-8">
				<h1 className="text-2xl font-bold">API設定</h1>
				<p className="text-muted-foreground">
					各LLMプロバイダーのAPIキーを設定します。設定したAPIキーは暗号化して保存されます。
				</p>
			</div>

			<Tabs defaultValue="google" className="w-full">
				<TabsList className="w-full">
					{providers.map((provider) => (
						<TabsTrigger
							key={provider.id}
							value={provider.id}
							className="flex-1"
						>
							{provider.name}
						</TabsTrigger>
					))}
				</TabsList>

				{providers.map((provider) => (
					<TabsContent key={provider.id} value={provider.id}>
						<Card>
							<CardHeader>
								<CardTitle>{provider.name}</CardTitle>
								<CardDescription>{provider.description}</CardDescription>
							</CardHeader>
							<CardContent>
								<Suspense fallback={<div>読み込み中...</div>}>
									<ApiKeyForm
										provider={provider.id}
										currentKey={
											apiKeys?.find((key) => key.provider === provider.id) ||
											null
										}
										onSave={() => {
											// サーバーコンポーネントの再レンダリングはNext.jsが自動的に処理
										}}
									/>
								</Suspense>
							</CardContent>
						</Card>
					</TabsContent>
				))}
			</Tabs>
		</div>
	);
}
