// Server Actions
import { getDashboardHeroData } from "@/app/_actions/dashboard/hero";

// Components
import { DashboardHero } from "./_components/DashboardHero";
import { WeeklyPartyCard } from "./_components/WeeklyPartyCard";
import { QuickActions } from "./_components/QuickActions";
import { DailyGreetingAgent } from "./_components/DailyGreetingAgent";
import { QuestList } from "./_components/QuestList";
import { TaskList } from "./_components/TaskList";
import { HabitList } from "./_components/HabitList";

export default async function WebAppPage() {
	const heroData = await getDashboardHeroData();

	return (
		<main className="container mx-auto p-4 space-y-4">
			<div className="grid gap-4 grid-cols-1 md:grid-cols-2">
				<DashboardHero
					profile={heroData.profile}
					weeklyStats={heroData.weeklyStats}
					season={heroData.season}
				/>
				<WeeklyPartyCard />
			</div>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-3">
				<QuickActions />
				<DailyGreetingAgent />
			</div>
			<div className="grid gap-4 grid-cols-1 md:grid-cols-3">
				<QuestList />
				<TaskList />
				<HabitList />
			</div>
		</main>
	);
}
