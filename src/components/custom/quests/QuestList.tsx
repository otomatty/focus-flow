"use client";

import { QuestCard } from "@/components/quests/QuestCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useState, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const supabase = createClient();

interface QuestStep {
	id: string;
	title: string;
	description: string;
	action_type: "notification" | "focus_session" | "task";
}

interface QuestRequirements {
	steps: QuestStep[];
}

interface Quest {
	id: string;
	title: string;
	description: string;
	quest_type: string;
	requirements: {
		steps: QuestStep[];
	};
	reward_exp: number;
}

interface UserQuest {
	quest_id: string;
	status: "not_started" | "in_progress" | "completed";
	progress: {
		completed_steps: string[];
		current_step: string;
	};
	end_date: string;
}

export function QuestList() {
	const [quests, setQuests] = useState<(Quest & UserQuest)[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const loadQuests = useCallback(async () => {
		try {
			const {
				data: { user },
			} = await supabase.auth.getUser();

			if (!user) return;

			// ユーザーのクエストを取得
			const { data: userQuests, error: userQuestsError } = await supabase
				.from("user_quests")
				.select(
					`
					quest_id,
					status,
					progress,
					end_date,
					quests (
						id,
						title,
						description,
						quest_type,
						requirements,
						reward_exp
					)
				`,
				)
				.eq("user_id", user.id);

			if (userQuestsError) throw userQuestsError;

			// データを整形
			const formattedQuests = userQuests.map((uq) => ({
				...uq.quests,
				quest_id: uq.quest_id,
				status: uq.status as "not_started" | "in_progress" | "completed",
				progress: uq.progress as {
					completed_steps: string[];
					current_step: string;
				},
				end_date: uq.end_date,
				requirements: {
					steps: (uq.quests.requirements as unknown as QuestRequirements).steps,
				},
			}));

			setQuests(formattedQuests);
		} catch (error) {
			console.error("Failed to load quests:", error);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		loadQuests();
	}, [loadQuests]);

	if (isLoading) {
		return (
			<div className="flex items-center justify-center h-48">
				<div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
			</div>
		);
	}

	return (
		<ScrollArea className="h-[calc(100vh-12rem)]">
			<div className="space-y-4 p-4">
				{quests.map((quest) => (
					<QuestCard
						key={quest.id}
						id={quest.id}
						title={quest.title}
						description={quest.description}
						steps={quest.requirements.steps}
						currentStep={quest.progress.current_step}
						completedSteps={quest.progress.completed_steps}
						endDate={quest.end_date}
						rewardExp={quest.reward_exp}
						status={quest.status}
						onUpdate={loadQuests}
					/>
				))}
			</div>
		</ScrollArea>
	);
}
