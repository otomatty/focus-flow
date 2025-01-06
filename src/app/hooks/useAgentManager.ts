import { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import type { Agent, AgentSettings } from "@/types/agent";
import { defaultAgents } from "@/app/webapp/_fixtures/defaultAgents";

const selectedAgentIdAtom = atom<string>("focus-companion");
const customAgentsAtom = atom<Agent[]>([]);
const agentSettingsAtom = atom<AgentSettings>({
	preferredAgent: "focus-companion",
	interactionStyle: "proactive",
	notificationPreferences: {
		taskReminders: true,
		dailyUpdates: true,
		weeklyReports: true,
	},
});

export function useAgentManager() {
	const [selectedAgentId, setSelectedAgentId] = useAtom(selectedAgentIdAtom);
	const [customAgents, setCustomAgents] = useAtom(customAgentsAtom);
	const [agentSettings, setAgentSettings] = useAtom(agentSettingsAtom);
	const [isLoading, setIsLoading] = useState(true);

	// 全てのエージェントを取得
	const getAllAgents = () => {
		return [...defaultAgents, ...customAgents];
	};

	// 現在選択されているエージェントを取得
	const getSelectedAgent = () => {
		const allAgents = getAllAgents();
		return (
			allAgents.find((agent) => agent.id === selectedAgentId) ||
			defaultAgents[0]
		);
	};

	// カスタムエージェントを作成
	const createCustomAgent = async (
		newAgent: Omit<Agent, "id" | "isDefault" | "createdAt" | "updatedAt">,
	) => {
		const agent: Agent = {
			...newAgent,
			id: `custom-${Date.now()}`,
			isDefault: false,
			createdAt: new Date(),
			updatedAt: new Date(),
		};
		setCustomAgents((prev) => [...prev, agent]);
		return agent;
	};

	// カスタムエージェントを更新
	const updateCustomAgent = async (
		agentId: string,
		updates: Partial<Agent>,
	) => {
		setCustomAgents((prev) =>
			prev.map((agent) =>
				agent.id === agentId
					? { ...agent, ...updates, updatedAt: new Date() }
					: agent,
			),
		);
	};

	// カスタムエージェントを削除
	const deleteCustomAgent = async (agentId: string) => {
		setCustomAgents((prev) => prev.filter((agent) => agent.id !== agentId));
		if (selectedAgentId === agentId) {
			setSelectedAgentId(defaultAgents[0].id);
		}
	};

	// エージェント設定を更新
	const updateAgentSettings = (updates: Partial<AgentSettings>) => {
		setAgentSettings((prev) => ({ ...prev, ...updates }));
	};

	// 初期化時にローカルストレージからカスタムエージェントと設定を読み込む
	useEffect(() => {
		const loadStoredData = () => {
			try {
				const storedCustomAgents = localStorage.getItem("customAgents");
				const storedSettings = localStorage.getItem("agentSettings");
				const storedSelectedAgentId = localStorage.getItem("selectedAgentId");

				if (storedCustomAgents) {
					setCustomAgents(JSON.parse(storedCustomAgents));
				}
				if (storedSettings) {
					setAgentSettings(JSON.parse(storedSettings));
				}
				if (storedSelectedAgentId) {
					setSelectedAgentId(storedSelectedAgentId);
				}
			} catch (error) {
				console.error("Failed to load agent data:", error);
			} finally {
				setIsLoading(false);
			}
		};

		loadStoredData();
	}, [setCustomAgents, setAgentSettings, setSelectedAgentId]);

	// カスタムエージェント、設定、選択されたエージェントIDの変更をローカルストレージに保存
	useEffect(() => {
		if (!isLoading) {
			localStorage.setItem("customAgents", JSON.stringify(customAgents));
			localStorage.setItem("agentSettings", JSON.stringify(agentSettings));
			localStorage.setItem("selectedAgentId", selectedAgentId);
		}
	}, [customAgents, agentSettings, selectedAgentId, isLoading]);

	return {
		selectedAgentId,
		setSelectedAgentId,
		customAgents,
		agentSettings,
		isLoading,
		getAllAgents,
		getSelectedAgent,
		createCustomAgent,
		updateCustomAgent,
		deleteCustomAgent,
		updateAgentSettings,
	};
}
