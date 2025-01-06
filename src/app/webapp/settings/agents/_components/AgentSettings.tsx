import { useState } from "react";
import { useAgentManager } from "@/app/hooks/useAgentManager";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Image from "next/image";
import type { Agent } from "@/types/agent";

export function AgentSettings() {
	const {
		selectedAgentId,
		setSelectedAgentId,
		customAgents,
		agentSettings,
		getAllAgents,
		createCustomAgent,
		updateCustomAgent,
		deleteCustomAgent,
		updateAgentSettings,
	} = useAgentManager();

	const [newAgent, setNewAgent] = useState<Partial<Agent>>({
		name: "",
		avatarUrl: "",
		personality: "",
		systemPrompt: "",
	});

	const allAgents = getAllAgents();

	const handleCreateAgent = async () => {
		if (
			!newAgent.name ||
			!newAgent.avatarUrl ||
			!newAgent.personality ||
			!newAgent.systemPrompt
		) {
			return;
		}

		await createCustomAgent(
			newAgent as Omit<Agent, "id" | "isDefault" | "createdAt" | "updatedAt">,
		);
		setNewAgent({
			name: "",
			avatarUrl: "",
			personality: "",
			systemPrompt: "",
		});
	};

	return (
		<Tabs defaultValue="agents" className="space-y-6">
			<TabsList>
				<TabsTrigger value="agents">エージェント一覧</TabsTrigger>
				<TabsTrigger value="create">新規作成</TabsTrigger>
				<TabsTrigger value="settings">設定</TabsTrigger>
			</TabsList>

			<TabsContent value="agents" className="space-y-6">
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					{allAgents.map((agent) => (
						<Card key={agent.id} className="p-6">
							<div className="flex items-start gap-4">
								<div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-gray-200">
									<Image
										src={agent.avatarUrl}
										alt={agent.name}
										fill
										className="object-cover"
									/>
								</div>
								<div className="flex-1">
									<h3 className="font-bold text-lg">{agent.name}</h3>
									<p className="text-sm text-gray-500 mb-2">
										{agent.personality}
									</p>
									<div className="flex items-center gap-2">
										<Button
											variant={
												selectedAgentId === agent.id ? "default" : "outline"
											}
											size="sm"
											onClick={() => setSelectedAgentId(agent.id)}
										>
											{selectedAgentId === agent.id ? "使用中" : "選択"}
										</Button>
										{!agent.isDefault && (
											<Button
												variant="ghost"
												size="sm"
												onClick={() => deleteCustomAgent(agent.id)}
											>
												削除
											</Button>
										)}
									</div>
								</div>
							</div>
						</Card>
					))}
				</div>
			</TabsContent>

			<TabsContent value="create" className="space-y-6">
				<Card className="p-6">
					<div className="space-y-4">
						<div>
							<Label htmlFor="name">エージェント名</Label>
							<Input
								id="name"
								value={newAgent.name}
								onChange={(e) =>
									setNewAgent((prev) => ({ ...prev, name: e.target.value }))
								}
								placeholder="例: プロジェクトマネージャー"
							/>
						</div>
						<div>
							<Label htmlFor="avatarUrl">アバター画像URL</Label>
							<Input
								id="avatarUrl"
								value={newAgent.avatarUrl}
								onChange={(e) =>
									setNewAgent((prev) => ({
										...prev,
										avatarUrl: e.target.value,
									}))
								}
								placeholder="https://example.com/avatar.png"
							/>
						</div>
						<div>
							<Label htmlFor="personality">性格・特徴</Label>
							<Input
								id="personality"
								value={newAgent.personality}
								onChange={(e) =>
									setNewAgent((prev) => ({
										...prev,
										personality: e.target.value,
									}))
								}
								placeholder="例: 効率的で細かい気配りができる"
							/>
						</div>
						<div>
							<Label htmlFor="systemPrompt">システムプロンプト</Label>
							<Textarea
								id="systemPrompt"
								value={newAgent.systemPrompt}
								onChange={(e) =>
									setNewAgent((prev) => ({
										...prev,
										systemPrompt: e.target.value,
									}))
								}
								placeholder="エージェントの振る舞いを定義するプロンプトを入力してください"
								rows={5}
							/>
						</div>
						<Button onClick={handleCreateAgent}>作成</Button>
					</div>
				</Card>
			</TabsContent>

			<TabsContent value="settings" className="space-y-6">
				<Card className="p-6">
					<div className="space-y-6">
						<div>
							<h3 className="font-bold text-lg mb-4">通知設定</h3>
							<div className="space-y-4">
								<div className="flex items-center justify-between">
									<Label htmlFor="taskReminders">タスクリマインダー</Label>
									<Switch
										id="taskReminders"
										checked={
											agentSettings.notificationPreferences.taskReminders
										}
										onCheckedChange={(checked) =>
											updateAgentSettings({
												notificationPreferences: {
													...agentSettings.notificationPreferences,
													taskReminders: checked,
												},
											})
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label htmlFor="dailyUpdates">デイリーアップデート</Label>
									<Switch
										id="dailyUpdates"
										checked={agentSettings.notificationPreferences.dailyUpdates}
										onCheckedChange={(checked) =>
											updateAgentSettings({
												notificationPreferences: {
													...agentSettings.notificationPreferences,
													dailyUpdates: checked,
												},
											})
										}
									/>
								</div>
								<div className="flex items-center justify-between">
									<Label htmlFor="weeklyReports">週次レポート</Label>
									<Switch
										id="weeklyReports"
										checked={
											agentSettings.notificationPreferences.weeklyReports
										}
										onCheckedChange={(checked) =>
											updateAgentSettings({
												notificationPreferences: {
													...agentSettings.notificationPreferences,
													weeklyReports: checked,
												},
											})
										}
									/>
								</div>
							</div>
						</div>
						<div>
							<h3 className="font-bold text-lg mb-4">
								インタラクションスタイル
							</h3>
							<div className="flex items-center gap-4">
								<Button
									variant={
										agentSettings.interactionStyle === "proactive"
											? "default"
											: "outline"
									}
									onClick={() =>
										updateAgentSettings({ interactionStyle: "proactive" })
									}
								>
									プロアクティブ
								</Button>
								<Button
									variant={
										agentSettings.interactionStyle === "reactive"
											? "default"
											: "outline"
									}
									onClick={() =>
										updateAgentSettings({ interactionStyle: "reactive" })
									}
								>
									リアクティブ
								</Button>
							</div>
						</div>
					</div>
				</Card>
			</TabsContent>
		</Tabs>
	);
}
