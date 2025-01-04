import { Suspense } from "react";
import { AgentSettings } from "./_components/AgentSettings";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AgentSettingsPage() {
	return (
		<div className="container mx-auto py-8">
			<h1 className="text-3xl font-bold mb-8">AIエージェント設定</h1>
			<Suspense fallback={<LoadingSpinner />}>
				<AgentSettings />
			</Suspense>
		</div>
	);
}
