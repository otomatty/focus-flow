// Server Actions
import { getDashboardHeroData } from "@/app/_actions/dashboard/hero";
import { getWeeklyPartyData } from "@/app/_actions/dashboard/party";
import { getDefaultAgent } from "@/app/_actions/agents/agents";
import { getTasks } from "@/app/_actions/tasks/core";
import type { AgentCharacter } from "@/types/agent";
import type { Task } from "@/types/task";

// Components
import { DashboardHero } from "./_components/DashboardHero";
import { WeeklyPartyCard } from "./_components/WeeklyPartyCard";
import { QuickActions } from "./_components/QuickActions";
import { DailyGreetingAgent } from "./_components/DailyGreetingAgent";
import { QuestList } from "./_components/QuestList";
import { TaskList } from "./_components/TaskList";
import { HabitList } from "./_components/HabitList";

export default async function WebAppPage() {
	const [heroData, partyData, agent] = await Promise.all([
		getDashboardHeroData(),
		getWeeklyPartyData(),
		getDefaultAgent(),
	]);

	// タスクの取得（エラー時は空配列を返す）
	let tasks: Task[] = [];
	try {
		tasks = await getTasks();
	} catch (error) {
		console.error("タスクの取得に失敗しました:", error);
	}

	// 今日のタスクをフィルタリング
	const today = new Date();
	today.setHours(0, 0, 0, 0);
	const tomorrow = new Date(today);
	tomorrow.setDate(tomorrow.getDate() + 1);

	const todayTasks = tasks
		.filter((task) => {
			const dueDate = task.due_date ? new Date(task.due_date) : null;
			return (
				dueDate &&
				dueDate >= today &&
				dueDate < tomorrow &&
				task.status !== "completed"
			);
		})
		.map((task) => ({
			title: task.title,
			priority: task.priority || "medium",
			dueTime: task.due_date || undefined,
			description: task.description || undefined,
			estimatedTime: task.estimated_duration
				? Number.parseInt(task.estimated_duration.toString())
				: undefined,
		}));

	return (
		<main className="container mx-auto p-4 space-y-4">
			<DailyGreetingAgent
				userName={heroData.profile.displayName ?? ""}
				agent={{
					id: agent.id,
					name: agent.name,
					personality: agent.personality ?? "",
					character: (agent.character as unknown as AgentCharacter) ?? {
						age: "",
						gender: "",
						traits: [],
						speakingStyle: "",
						interests: [],
						skillset: { skills: [] },
						backgroundInfo: { career: "" },
						catchphrase: "",
					},
					avatarUrl: agent.avatar_url ?? "/images/default-agent-avatar.png",
					systemPrompt:
						agent.system_prompt ?? "デフォルトのシステムプロンプトです。",
					isDefault: agent.is_default ?? true,
					createdAt: new Date(agent.created_at ?? new Date()),
					updatedAt: new Date(agent.updated_at ?? new Date()),
				}}
				todayTasks={todayTasks}
			/>

			<div className="grid gap-4 grid-cols-1 md:grid-cols-3">
				<DashboardHero
					profile={heroData.profile}
					weeklyStats={heroData.weeklyStats}
					season={heroData.season}
				/>
				<QuickActions />
			</div>
			<WeeklyPartyCard members={partyData.members} goal={partyData.goal} />

			<div className="grid gap-4 grid-cols-1 md:grid-cols-3">
				<QuestList quests={[]} />
				<TaskList
					tasks={tasks.map((task) => ({
						...task,
						description: task.description ?? undefined,
						difficulty: task.difficulty_level || 1,
						estimatedTime: task.estimated_duration
							? Number.parseInt(task.estimated_duration.toString())
							: 0,
						progress: task.progress_percentage || 0,
					}))}
				/>
				<HabitList habits={[]} />
			</div>
		</main>
	);
}
