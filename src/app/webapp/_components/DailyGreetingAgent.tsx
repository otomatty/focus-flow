import { Avatar } from "@/components/ui/avatar";
import { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import type { Agent, AgentResponse } from "@/app/types/agent";
import Image from "next/image";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { generateResponse } from "@/lib/gemini/client";
import { Send, Trash2 } from "lucide-react";
import { ResetChatDialog } from "./ResetChatDialog";

interface DailyGreetingAgentProps {
	userName: string;
	agent: Agent;
	todayTasks: {
		title: string;
		priority: "high" | "medium" | "low";
		dueTime?: string;
		description?: string;
		estimatedTime?: number;
		tags?: string[];
	}[];
}

interface ScheduleItem {
	id: string;
	time: string;
	title: string;
	priority: "high" | "medium" | "low";
	status: "upcoming" | "current" | "past";
	timeBlock: "morning" | "afternoon" | "evening";
	description?: string;
	estimatedTime?: number;
	tags?: string[];
	isExpanded?: boolean;
}

interface TimeBlock {
	id: "morning" | "afternoon" | "evening";
	title: string;
	timeRange: string;
	items: ScheduleItem[];
}

interface Message {
	id: string;
	text: string;
	isTyping?: boolean;
	sender: "user" | "agent";
	timestamp: number;
}

export function DailyGreetingAgent({
	userName,
	agent,
	todayTasks,
}: DailyGreetingAgentProps) {
	const [greeting, setGreeting] = useState("");
	const [messages, setMessages] = useState<Message[]>([]);
	const [isTyping, setIsTyping] = useState(false);
	const [inputValue, setInputValue] = useState("");
	const messagesEndRef = useRef<HTMLDivElement>(null);
	const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>([
		{
			id: "morning",
			title: "午前",
			timeRange: "5:00 - 12:00",
			items: [],
		},
		{
			id: "afternoon",
			title: "午後",
			timeRange: "12:00 - 17:00",
			items: [],
		},
		{
			id: "evening",
			title: "夕方・夜",
			timeRange: "17:00 - 24:00",
			items: [],
		},
	]);

	const [expandedTaskId, setExpandedTaskId] = useState<string | null>(null);

	useEffect(() => {
		const hour = new Date().getHours();
		if (hour >= 5 && hour < 12) {
			setGreeting("おはようございます");
		} else if (hour >= 12 && hour < 17) {
			setGreeting("こんにちは");
		} else {
			setGreeting("こんばんは");
		}
	}, []);

	useEffect(() => {
		const now = new Date();
		const items = todayTasks
			.filter((task) => task.dueTime)
			.map((task) => {
				const dueTime = new Date(task.dueTime || "");
				const hour = dueTime.getHours();
				const diffHours =
					(dueTime.getTime() - now.getTime()) / (1000 * 60 * 60);

				let timeBlock: ScheduleItem["timeBlock"] = "morning";
				if (hour >= 17) timeBlock = "evening";
				else if (hour >= 12) timeBlock = "afternoon";

				return {
					id: `${task.title}-${task.dueTime}`,
					time: dueTime.toLocaleTimeString("ja-JP", {
						hour: "2-digit",
						minute: "2-digit",
					}),
					title: task.title,
					priority: task.priority,
					status:
						diffHours < 0 ? "past" : diffHours <= 0.5 ? "current" : "upcoming",
					timeBlock,
					description: task.description,
					estimatedTime: task.estimatedTime,
					tags: task.tags,
				} as ScheduleItem;
			})
			.sort((a, b) => {
				const timeA = new Date(`1970/01/01 ${a.time}`);
				const timeB = new Date(`1970/01/01 ${b.time}`);
				return timeA.getTime() - timeB.getTime();
			});

		setTimeBlocks((prev) =>
			prev.map((block) => ({
				...block,
				items: items.filter((item) => item.timeBlock === block.id),
			})),
		);
	}, [todayTasks]);

	const getStatusColor = (
		status: ScheduleItem["status"],
		priority: ScheduleItem["priority"],
	) => {
		if (status === "current") return "emerald";
		if (status === "past") return "slate";
		return priority === "high" ? "red" : "amber";
	};

	const getStatusIcon = (status: ScheduleItem["status"]) => {
		switch (status) {
			case "current":
				return "🎯";
			case "upcoming":
				return "⏰";
			case "past":
				return "✓";
		}
	};

	const getPriorityLabel = (priority: ScheduleItem["priority"]) => {
		switch (priority) {
			case "high":
				return "優先度: 高";
			case "medium":
				return "優先度: 中";
			case "low":
				return "優先度: 低";
		}
	};

	const formatEstimatedTime = (minutes?: number) => {
		if (!minutes) return null;
		if (minutes < 60) return `${minutes}分`;
		const hours = Math.floor(minutes / 60);
		const remainingMinutes = minutes % 60;
		return remainingMinutes
			? `${hours}時間${remainingMinutes}分`
			: `${hours}時間`;
	};

	const handleTaskClick = (taskId: string) => {
		setExpandedTaskId(expandedTaskId === taskId ? null : taskId);
	};

	const scrollToBottom = useCallback(() => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, []);

	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottom();
		}
	}, [messages.length, scrollToBottom]);

	const formatMessage = (text: string): string[] => {
		return text
			.split(/[。！？\n]/)
			.filter((sentence) => sentence.trim().length > 0)
			.map((sentence) => `${sentence.trim()}。`);
	};

	const handleSendMessage = async (text: string) => {
		if (!text.trim() || isTyping) return;

		const currentTime = Date.now();
		setInputValue("");
		setMessages((prev) => [
			...prev,
			{
				id: `user-${currentTime}`,
				text: text.trim(),
				sender: "user",
				timestamp: currentTime,
			},
		]);
		setIsTyping(true);

		try {
			// 直近の会話履歴を取得（最大5件）
			const recentMessages = messages
				.slice(-5)
				.map(
					(msg) =>
						`${msg.sender === "user" ? "ユーザー" : agent.name}: ${msg.text}`,
				)
				.join("\n");

			const context = `
				あなたは${agent.name}として振る舞ってください。

				以下があなたの設定です：
				- 性格: ${agent.character?.traits?.join(", ")}
				- 話し方: ${agent.character?.speakingStyle}
				- 経歴: ${agent.character?.backgroundInfo?.career}
				- 専門分野: ${agent.character?.skillset?.skills?.join(", ")}
				- キャッチフレーズ: ${agent.character?.catchphrase}
				
				以下の点に注意して返答してください：
				1. 上記の性格設定に基づいて一貫した口調で話してください
				2. 必要に応じて相槌や感情表現を含めてください
				3. ユーザーの発言に共感を示してください
				4. 文脈に応じて過去の会話を参照してください
				5. 専門分野に関する話題では、より詳しい説明や提案をしてください

				直近の会話履歴：
				${recentMessages}

				システムプロンプト：
				${agent.systemPrompt}

				ユーザーの最新の発言：
				${text}
			`;

			const response = await generateResponse(text, context);
			const formattedResponse = formatMessage(response);

			// タイピングアニメーション
			for (const sentence of formattedResponse) {
				const messageId = `agent-${Date.now()}-${Math.random()}`;
				setMessages((prev) => [
					...prev,
					{
						id: messageId,
						text: sentence,
						isTyping: true,
						sender: "agent",
						timestamp: Date.now(),
					},
				]);
				await new Promise((resolve) => setTimeout(resolve, 500));
				setMessages((prev) =>
					prev.map((msg) =>
						msg.id === messageId ? { ...msg, isTyping: false } : msg,
					),
				);
			}
		} catch (error) {
			console.error("Failed to generate response:", error);
			setMessages((prev) => [
				...prev,
				{
					id: `error-${Date.now()}`,
					text: "申し訳ありません。応答の生成中にエラーが発生しました。",
					sender: "agent",
					timestamp: Date.now(),
				},
			]);
		} finally {
			setIsTyping(false);
		}
	};

	return (
		<motion.div
			initial={{ opacity: 0, y: -20 }}
			animate={{ opacity: 1, y: 0 }}
			className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950/40 dark:via-purple-950/40 dark:to-pink-950/40 rounded-xl p-6 border border-indigo-200 dark:border-indigo-500/20 backdrop-blur-sm"
		>
			<div className="flex items-start gap-6">
				<ResponsiveDialog
					trigger={
						<motion.div
							whileHover={{ scale: 1.1 }}
							whileTap={{ scale: 0.9 }}
							className="relative cursor-pointer"
						>
							<div className="absolute -inset-0.5 bg-gradient-to-r from-pink-500 to-purple-500 rounded-full blur opacity-30" />
							<Avatar className="w-16 h-16 relative">
								<div className="w-16 h-16 rounded-full flex items-center justify-center border-2 border-white/20 overflow-hidden">
									<Image
										src={agent.avatarUrl}
										alt={agent.name}
										width={64}
										height={64}
										className="object-cover"
									/>
								</div>
							</Avatar>
						</motion.div>
					}
					title={agent.name}
					description={agent.personality}
				>
					<ScrollArea className="h-[60vh] p-6">
						<div className="space-y-6">
							<div className="flex justify-center">
								<div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white/20">
									<Image
										src={agent.avatarUrl}
										alt={agent.name}
										fill
										className="object-cover"
									/>
								</div>
							</div>
							<div className="space-y-4">
								{agent.character && (
									<>
										<div>
											<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
												キャラクター設定
											</h3>
											<div className="space-y-2 mt-2">
												<div className="flex gap-4 text-sm">
													<span className="text-gray-500 dark:text-gray-400">
														年齢:
													</span>
													<span className="text-gray-700 dark:text-gray-300">
														{agent.character.age}
													</span>
												</div>
												<div className="flex gap-4 text-sm">
													<span className="text-gray-500 dark:text-gray-400">
														性別:
													</span>
													<span className="text-gray-700 dark:text-gray-300">
														{agent.character.gender}
													</span>
												</div>
												<div className="space-y-1">
													<span className="text-sm text-gray-500 dark:text-gray-400">
														経歴:
													</span>
													<p className="text-sm text-gray-700 dark:text-gray-300">
														{agent.character.backgroundInfo?.career}
													</p>
												</div>
											</div>
										</div>
										<div>
											<h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
												性格特性
											</h4>
											<div className="flex flex-wrap gap-2 mt-2">
												{agent.character.traits?.map((trait) => (
													<span
														key={trait}
														className="px-2 py-1 text-xs rounded-full bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
													>
														{trait}
													</span>
												))}
											</div>
										</div>
										<div>
											<h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
												話し方の特徴
											</h4>
											<p className="text-sm text-gray-700 dark:text-gray-300 mt-2">
												{agent.character.speakingStyle}
											</p>
										</div>
										<div>
											<h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
												興味・関心
											</h4>
											<div className="flex flex-wrap gap-2 mt-2">
												{agent.character.interests?.map((interest) => (
													<span
														key={interest}
														className="px-2 py-1 text-xs rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
													>
														{interest}
													</span>
												))}
											</div>
										</div>
										<div>
											<h4 className="text-md font-semibold text-gray-900 dark:text-gray-100">
												専門分野
											</h4>
											<div className="flex flex-wrap gap-2 mt-2">
												{agent.character.skillset?.skills?.map((exp) => (
													<span
														key={exp}
														className="px-2 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800"
													>
														{exp}
													</span>
												))}
											</div>
										</div>
									</>
								)}
								<div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										パーソナリティ
									</h3>
									<p className="text-gray-600 dark:text-gray-400">
										{agent.personality}
									</p>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
										システムプロンプト
									</h3>
									<div className="bg-gray-50 dark:bg-gray-900/50 rounded-lg p-4 text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap">
										{agent.systemPrompt}
									</div>
								</div>
								{!agent.isDefault && (
									<div>
										<h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
											作成日時
										</h3>
										<p className="text-gray-600 dark:text-gray-400">
											{agent.createdAt.toLocaleDateString("ja-JP", {
												year: "numeric",
												month: "long",
												day: "numeric",
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
								)}
							</div>
						</div>
					</ScrollArea>
				</ResponsiveDialog>

				<div className="flex-1 space-y-4">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.2 }}
					>
						<h3 className="text-xl font-bold bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
							{greeting}、{userName}さん！
						</h3>
						<p className="text-muted-foreground font-medium">
							{new Date().toLocaleDateString("ja-JP", {
								year: "numeric",
								month: "long",
								day: "numeric",
								weekday: "long",
							})}
						</p>
					</motion.div>

					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ delay: 0.4 }}
						className="space-y-3"
					>
						{timeBlocks.some((block) => block.items.length > 0) ? (
							<>
								<p className="text-sm text-muted-foreground font-medium">
									今日のスケジュールはこちらです：
								</p>
								<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
									{timeBlocks.map((block) => (
										<motion.div
											key={block.id}
											initial={{ opacity: 0, y: 20 }}
											animate={{ opacity: 1, y: 0 }}
											transition={{ delay: 0.4 }}
											className="bg-white dark:bg-gray-900/50 rounded-lg p-4 border border-gray-200 dark:border-gray-800 shadow-sm"
										>
											<div className="flex items-center gap-2 mb-3">
												<div>
													<h4 className="font-bold text-gray-900 dark:text-gray-100">
														{block.title}
													</h4>
													<p className="text-xs text-gray-500 dark:text-gray-400">
														{block.timeRange}
													</p>
												</div>
											</div>
											<div className="space-y-2">
												{block.items.length > 0 ? (
													block.items.map((item) => {
														const color = getStatusColor(
															item.status,
															item.priority,
														);
														return (
															<div key={item.id} className="space-y-1">
																<motion.div
																	onClick={() => handleTaskClick(item.id)}
																	className={`flex items-center gap-2 bg-${color}-50 dark:bg-${color}-900/30 px-3 py-2 rounded-md border border-${color}-200 dark:border-${color}-900/50 cursor-pointer hover:bg-${color}-100 dark:hover:bg-${color}-900/50 transition-colors`}
																>
																	<span className="text-base">
																		{getStatusIcon(item.status)}
																	</span>
																	<div className="flex-1">
																		<p
																			className={`font-medium text-sm text-${color}-700 dark:text-${color}-300`}
																		>
																			{item.time} - {item.title}
																		</p>
																		{item.status === "current" && (
																			<p className="text-xs text-emerald-600 dark:text-emerald-400">
																				現在進行中
																			</p>
																		)}
																	</div>
																	<motion.div
																		animate={{
																			rotate:
																				expandedTaskId === item.id ? 180 : 0,
																		}}
																		className="text-gray-500 dark:text-gray-400"
																	>
																		▼
																	</motion.div>
																</motion.div>
																<AnimatePresence>
																	{expandedTaskId === item.id && (
																		<motion.div
																			initial={{ height: 0, opacity: 0 }}
																			animate={{ height: "auto", opacity: 1 }}
																			exit={{ height: 0, opacity: 0 }}
																			transition={{ duration: 0.2 }}
																			className="overflow-hidden"
																		>
																			<div
																				className={`bg-${color}-50/50 dark:bg-gray-900/50 rounded-md p-3 space-y-2 text-sm border border-${color}-100/50 dark:border-gray-800`}
																			>
																				{item.description && (
																					<p className="text-gray-700 dark:text-gray-300">
																						{item.description}
																					</p>
																				)}
																				<div className="flex flex-wrap gap-2">
																					<span
																						className={`px-2 py-1 rounded-full text-xs bg-${color}-100 dark:bg-${color}-900/50 text-${color}-700 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-900`}
																					>
																						{getPriorityLabel(item.priority)}
																					</span>
																					{item.estimatedTime && (
																						<span
																							className={`px-2 py-1 rounded-full text-xs bg-${color}-100 dark:bg-${color}-900/50 text-${color}-700 dark:text-${color}-300 border border-${color}-200 dark:border-${color}-900`}
																						>
																							予定時間:{" "}
																							{formatEstimatedTime(
																								item.estimatedTime,
																							)}
																						</span>
																					)}
																				</div>
																				{item.tags && item.tags.length > 0 && (
																					<div className="flex flex-wrap gap-1">
																						{item.tags.map((tag) => (
																							<span
																								key={tag}
																								className="px-2 py-0.5 rounded-full text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700"
																							>
																								#{tag}
																							</span>
																						))}
																					</div>
																				)}
																				<div className="flex justify-end gap-2 pt-2">
																					<Button
																						variant="ghost"
																						size="sm"
																						className={`text-${color}-700 dark:text-${color}-300 hover:text-${color}-800 dark:hover:text-${color}-200 hover:bg-${color}-100 dark:hover:bg-${color}-900/50`}
																					>
																						編集
																					</Button>
																					<Button
																						variant="ghost"
																						size="sm"
																						className={`text-${color}-700 dark:text-${color}-300 hover:text-${color}-800 dark:hover:text-${color}-200 hover:bg-${color}-100 dark:hover:bg-${color}-900/50`}
																					>
																						完了
																					</Button>
																				</div>
																			</div>
																		</motion.div>
																	)}
																</AnimatePresence>
															</div>
														);
													})
												) : (
													<p className="text-sm text-gray-400 dark:text-gray-500 text-center py-2">
														予定なし
													</p>
												)}
											</div>
										</motion.div>
									))}
								</div>
							</>
						) : (
							<div className="flex items-center gap-2 bg-blue-50 dark:bg-blue-950/50 px-4 py-2 rounded-lg border border-blue-200 dark:border-blue-900">
								<p className="font-medium text-blue-700 dark:text-blue-300">
									今日予定されているタスクはありません。新しいタスクを追加しましょう！
								</p>
							</div>
						)}
					</motion.div>

					{timeBlocks.some((block) => block.items.length > 0) && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
							className="text-sm font-medium bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent"
						>
							{agent.personality}として、あなたの目標達成をサポートします。
						</motion.div>
					)}

					<div className="mt-4 space-y-4">
						<div className="flex items-center justify-between mb-2">
							<p className="text-sm text-muted-foreground">
								{messages.length > 0
									? "会話履歴"
									: "メッセージを入力してください"}
							</p>
							{messages.length > 0 && (
								<ResetChatDialog onReset={() => setMessages([])} />
							)}
						</div>
						<div className="space-y-2 max-h-[300px] overflow-y-auto p-2">
							{messages.map((message) => (
								<motion.div
									key={message.id}
									initial={{ opacity: 0, y: 10 }}
									animate={{ opacity: 1, y: 0 }}
									className={`rounded-lg p-3 ${
										message.id.startsWith("user-")
											? "bg-blue-50 dark:bg-blue-900/30 ml-auto max-w-[80%]"
											: "bg-white dark:bg-gray-900/50 mr-auto max-w-[80%]"
									}`}
								>
									<p className="text-gray-700 dark:text-gray-300">
										{message.text}
										{message.isTyping && (
											<span className="inline-flex ml-1">
												<span className="animate-bounce">.</span>
												<span className="animate-bounce delay-100">.</span>
												<span className="animate-bounce delay-200">.</span>
											</span>
										)}
									</p>
								</motion.div>
							))}
							<div ref={messagesEndRef} />
						</div>
						<div className="flex gap-2">
							<input
								type="text"
								value={inputValue}
								onChange={(e) => setInputValue(e.target.value)}
								placeholder="メッセージを入力..."
								className="flex-1 rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/50 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
								onKeyPress={(e) => {
									if (e.key === "Enter" && !e.shiftKey) {
										e.preventDefault();
										handleSendMessage(inputValue);
									}
								}}
							/>
							<Button
								size="icon"
								variant="ghost"
								onClick={() => handleSendMessage(inputValue)}
								disabled={isTyping || !inputValue.trim()}
								className="shrink-0"
							>
								{isTyping ? (
									<div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-500 border-t-transparent" />
								) : (
									<Send className="h-5 w-5" />
								)}
							</Button>
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}
