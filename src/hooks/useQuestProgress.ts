import { createClient } from "@/lib/supabase/client";
import { useCallback } from "react";

interface QuestProgress {
	completed_steps: string[];
	current_step: string;
}

type Json =
	| string
	| number
	| boolean
	| { [key: string]: Json | undefined }
	| Json[]
	| null;

interface UpdateProgressParams {
	userId: string;
	questId: string;
	completedStep: string;
	nextStep: string;
}

export function useQuestProgress() {
	const supabase = createClient();

	const updateProgress = useCallback(
		async ({
			userId,
			questId,
			completedStep,
			nextStep,
		}: UpdateProgressParams) => {
			try {
				// 現在のクエスト情報を取得
				const { data: currentQuest, error: fetchError } = await supabase
					.from("user_quests")
					.select("progress, quest_id")
					.eq("user_id", userId)
					.eq("quest_id", questId)
					.single();

				if (fetchError) throw fetchError;

				const progress = currentQuest?.progress as unknown as QuestProgress;

				// 進行状況を更新
				const updatedProgress = {
					completed_steps: [
						...(progress?.completed_steps || []),
						completedStep,
					],
					current_step: nextStep,
				} as Json;

				// クエストの進行状況を更新
				const { error: updateError } = await supabase
					.from("user_quests")
					.update({
						progress: updatedProgress,
						status: nextStep ? "in_progress" : "completed",
						...(nextStep ? {} : { completed_at: new Date().toISOString() }),
					})
					.eq("user_id", userId)
					.eq("quest_id", questId);

				if (updateError) throw updateError;

				// クエストが完了した場合、経験値を付与
				if (!nextStep) {
					const { data: quest } = await supabase
						.from("quests")
						.select("reward_exp")
						.eq("id", questId)
						.single();

					if (quest) {
						const { error: expError } = await supabase.rpc(
							"add_experience_points",
							{
								p_user_id: userId,
								p_exp_points: quest.reward_exp,
							},
						);

						if (expError) throw expError;
					}
				}

				return { success: true };
			} catch (error) {
				console.error("Failed to update quest progress:", error);
				return {
					error:
						error instanceof Error
							? error.message
							: "クエストの更新に失敗しました",
				};
			}
		},
		[supabase],
	);

	return { updateProgress };
}
