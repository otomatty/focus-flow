"use client";

import { Button } from "@/components/ui/button";
import { useQuestProgress } from "@/hooks/useQuestProgress";
import { createClient } from "@/lib/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useCallback, useEffect, useState } from "react";

interface QuestStepActionProps {
	questId: string;
	stepId: string;
	nextStepId: string | null;
	actionType: "notification" | "focus_session" | "task";
	onComplete?: () => void;
}

export function QuestStepAction({
	questId,
	stepId,
	nextStepId,
	actionType,
	onComplete,
}: QuestStepActionProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [userId, setUserId] = useState<string | null>(null);
	const { updateProgress } = useQuestProgress();
	const { toast } = useToast();
	const supabase = createClient();

	useEffect(() => {
		async function getUserId() {
			const {
				data: { user },
			} = await supabase.auth.getUser();
			if (user) {
				setUserId(user.id);
			}
		}

		getUserId();
	}, [supabase.auth]);

	const handleAction = useCallback(async () => {
		if (!userId) return;

		setIsLoading(true);
		try {
			let actionCompleted = false;

			// アクションタイプに応じた処理
			switch (actionType) {
				case "notification":
					// 通知設定の確認
					if ("Notification" in window) {
						const permission = await Notification.requestPermission();
						actionCompleted = permission === "granted";
					}
					break;

				case "focus_session": {
					// フォーカスセッションの確認
					const { data: sessions } = await supabase
						.schema("ff_focus")
						.from("focus_sessions")
						.select("id")
						.eq("user_id", userId)
						.limit(1);
					actionCompleted = Boolean(sessions?.length);
					break;
				}

				case "task": {
					// タスクの作成確認
					const { data: tasks } = await supabase
						.schema("ff_tasks")
						.from("tasks")
						.select("id")
						.eq("user_id", userId)
						.limit(1);
					actionCompleted = Boolean(tasks?.length);
					break;
				}
			}

			if (actionCompleted) {
				const result = await updateProgress({
					userId,
					questId,
					completedStep: stepId,
					nextStep: nextStepId || "",
				});

				if (result.error) {
					throw new Error(result.error);
				}

				toast({
					title: "ステップを完了しました",
					description: "次のステップに進みましょう！",
				});

				onComplete?.();
			} else {
				toast({
					title: "アクションが必要です",
					description: "このステップを完了するには必要な操作を行ってください。",
					variant: "destructive",
				});
			}
		} catch (error) {
			console.error("Failed to complete step:", error);
			toast({
				title: "エラーが発生しました",
				description:
					error instanceof Error
						? error.message
						: "ステップの完了に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	}, [
		userId,
		actionType,
		supabase,
		updateProgress,
		questId,
		stepId,
		nextStepId,
		toast,
		onComplete,
	]);

	if (!userId) return null;

	return (
		<Button
			onClick={handleAction}
			disabled={isLoading}
			className="w-full mt-2"
			variant="secondary"
		>
			{isLoading ? (
				<div className="h-4 w-4 animate-spin rounded-full border-b-2 border-current" />
			) : (
				"完了する"
			)}
		</Button>
	);
}
