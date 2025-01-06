"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database, Json } from "@/types/supabase";

type SystemLog = Database["ff_logs"]["Tables"]["system_logs"]["Row"];
type ErrorLog = Database["ff_logs"]["Tables"]["error_logs"]["Row"];

/**
 * システムログを記録
 */
export async function createSystemLog(params: {
	eventType: string;
	eventSource: string;
	eventData: Record<string, string | number | boolean | null>;
	severity?: "INFO" | "WARNING" | "ERROR" | "CRITICAL";
}) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_logs")
		.from("system_logs")
		.insert({
			event_type: params.eventType,
			event_source: params.eventSource,
			event_data: params.eventData as Json,
			severity: params.severity ?? "INFO",
		});

	if (error) {
		throw new Error(`Failed to create system log: ${error.message}`);
	}
}

/**
 * エラーログを記録
 */
export async function createErrorLog(params: {
	functionName: string;
	errorMessage: string;
	errorDetail?: string;
	errorHint?: string;
	errorContext?: string;
}) {
	const supabase = await createClient();

	const { error } = await supabase.schema("ff_logs").rpc("log_error", {
		p_function_name: params.functionName,
		p_error_message: params.errorMessage,
		p_error_detail: params.errorDetail,
		p_error_hint: params.errorHint,
		p_error_context: params.errorContext,
	});

	if (error) {
		throw new Error(`Failed to create error log: ${error.message}`);
	}
}

/**
 * システムログを取得
 */
export async function getSystemLogs(params?: {
	eventType?: string;
	severity?: string;
	limit?: number;
	offset?: number;
}): Promise<SystemLog[]> {
	const supabase = await createClient();
	let query = supabase
		.schema("ff_logs")
		.from("system_logs")
		.select("*")
		.order("created_at", { ascending: false });

	if (params?.eventType) {
		query = query.eq("event_type", params.eventType);
	}
	if (params?.severity) {
		query = query.eq("severity", params.severity);
	}
	if (params?.limit) {
		query = query.limit(params.limit);
	}
	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch system logs: ${error.message}`);
	}

	return data;
}

/**
 * エラーログを取得
 */
export async function getErrorLogs(params?: {
	functionName?: string;
	limit?: number;
	offset?: number;
}): Promise<ErrorLog[]> {
	const supabase = await createClient();
	let query = supabase
		.schema("ff_logs")
		.from("error_logs")
		.select("*")
		.order("created_at", { ascending: false });

	if (params?.functionName) {
		query = query.eq("function_name", params.functionName);
	}
	if (params?.limit) {
		query = query.limit(params.limit);
	}
	if (params?.offset) {
		query = query.range(
			params.offset,
			params.offset + (params.limit ?? 10) - 1,
		);
	}

	const { data, error } = await query;

	if (error) {
		throw new Error(`Failed to fetch error logs: ${error.message}`);
	}

	return data;
}

/**
 * 古いシステムログをクリーンアップ
 */
export async function cleanupSystemLogs(retentionDays = 90) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_logs")
		.rpc("cleanup_old_logs", { retention_days: retentionDays });

	if (error) {
		throw new Error(`Failed to cleanup system logs: ${error.message}`);
	}
}

/**
 * 古いエラーログをクリーンアップ
 */
export async function cleanupErrorLogs(daysToKeep = 30) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_logs")
		.rpc("cleanup_error_logs", { p_days_to_keep: daysToKeep });

	if (error) {
		throw new Error(`Failed to cleanup error logs: ${error.message}`);
	}
}
