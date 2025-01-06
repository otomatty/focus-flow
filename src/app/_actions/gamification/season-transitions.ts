"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type SeasonTransition =
	Database["ff_gamification"]["Tables"]["season_transitions"]["Row"];
type TransitionCheckpoint =
	Database["ff_gamification"]["Tables"]["transition_checkpoints"]["Row"];
type TransitionNotification =
	Database["ff_gamification"]["Tables"]["transition_notifications"]["Row"];

interface ErrorLog {
	timestamp: string;
	message: string;
	details?: Record<string, unknown>;
}

interface TransitionStatus {
	status: string;
	progress: {
		archiveData: string;
		calculateRewards: string;
		distributeRewards: string;
		resetProgress: string;
		initializeNewSeason: string;
	};
	errorLogs: ErrorLog[];
}

/**
 * シーズン移行を開始
 * @param fromSeasonId - 移行元シーズンID
 * @param toSeasonId - 移行先シーズンID
 */
export async function startSeasonTransition(
	fromSeasonId: string,
	toSeasonId: string,
): Promise<SeasonTransition> {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.rpc("execute_season_transition", {
			p_from_season_id: fromSeasonId,
			p_to_season_id: toSeasonId,
		});

	if (error) {
		throw new Error(`Failed to start season transition: ${error.message}`);
	}

	// 移行状態を取得
	const { data: transition, error: fetchError } = await supabase
		.schema("ff_gamification")
		.from("season_transitions")
		.select("*")
		.eq("from_season_id", fromSeasonId)
		.eq("to_season_id", toSeasonId)
		.single();

	if (fetchError) {
		throw new Error(`Failed to fetch transition status: ${fetchError.message}`);
	}

	return transition;
}

/**
 * 移行の進捗状況を取得
 * @param transitionId - 移行ID
 */
export async function getTransitionProgress(
	transitionId: string,
): Promise<TransitionStatus> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("season_transitions")
		.select("status, transition_steps, error_logs")
		.eq("id", transitionId)
		.single();

	if (error) {
		throw new Error(`Failed to fetch transition progress: ${error.message}`);
	}

	return {
		status: data.status,
		progress: data.transition_steps as TransitionStatus["progress"],
		errorLogs: (data.error_logs as unknown as ErrorLog[]) ?? [],
	};
}

/**
 * チェックポイントの状態を取得
 * @param transitionId - 移行ID
 */
export async function getTransitionCheckpoints(
	transitionId: string,
): Promise<TransitionCheckpoint[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("transition_checkpoints")
		.select("*")
		.eq("transition_id", transitionId)
		.order("created_at", { ascending: true });

	if (error) {
		throw new Error(`Failed to fetch transition checkpoints: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの移行通知を取得
 * @param userId - ユーザーID
 * @param transitionId - 移行ID
 */
export async function getUserTransitionNotifications(
	userId: string,
	transitionId: string,
): Promise<TransitionNotification[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("transition_notifications")
		.select("*")
		.eq("user_id", userId)
		.eq("transition_id", transitionId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(
			`Failed to fetch transition notifications: ${error.message}`,
		);
	}

	return data;
}

/**
 * 通知を既読にする
 * @param notificationId - 通知ID
 */
export async function markNotificationAsRead(notificationId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_gamification")
		.from("transition_notifications")
		.update({ read: true })
		.eq("id", notificationId);

	if (error) {
		throw new Error(`Failed to mark notification as read: ${error.message}`);
	}
}

/**
 * データ整合性チェックの結果を取得
 * @param transitionId - 移行ID
 */
export async function getDataIntegrityCheckResults(transitionId: string) {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_gamification")
		.from("data_integrity_checks")
		.select("*")
		.eq("transition_id", transitionId)
		.order("created_at", { ascending: false });

	if (error) {
		throw new Error(
			`Failed to fetch integrity check results: ${error.message}`,
		);
	}

	return data;
}
