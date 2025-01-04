"use client";

import { DashboardHero } from "@/app/webapp/_components/DashboardHero";
import { WeeklyPartyCard } from "@/app/webapp/_components/WeeklyPartyCard";
import { QuickActions } from "@/app/webapp/_components/QuickActions";
import { DailyGreetingAgent } from "@/app/webapp/_components/DailyGreetingAgent";
import { sampleDashboardData } from "./_fixtures/sample-dashboard-data";
import { samplePartyData } from "./_fixtures/sample-party-data";
import { QuestList } from "@/app/webapp/_components/QuestList";
import { TaskList } from "@/app/webapp/_components/TaskList";
import { HabitList } from "@/app/webapp/_components/HabitList";
import { useAgentManager } from "@/app/hooks/useAgentManager";

export default function WebAppPage() {
	const { getSelectedAgent } = useAgentManager();
	const selectedAgent = getSelectedAgent();

	return (
		<div className="container mx-auto p-6 space-y-8">
			<DailyGreetingAgent
				userName={sampleDashboardData.hero.name}
				agent={selectedAgent}
				todayTasks={sampleDashboardData.todayTasks}
			/>

			<div className="grid grid-cols-1 lg:grid-cols-[1fr,300px] gap-8">
				<DashboardHero
					user={sampleDashboardData.hero}
					season={sampleDashboardData.season}
				/>
				<QuickActions />
			</div>

			<WeeklyPartyCard {...samplePartyData} />

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
				<QuestList quests={sampleDashboardData.quests} />
				<TaskList tasks={sampleDashboardData.tasks} />
				<HabitList habits={sampleDashboardData.habits} />
			</div>
		</div>
	);
}
