"use server";

import { createClient } from "@/lib/supabase/server";
import type { Database } from "@/types/supabase";

type GoogleCalendarConnection =
	Database["ff_schedules"]["Tables"]["google_calendar_connections"]["Row"];
type GoogleCalendar =
	Database["ff_schedules"]["Tables"]["google_calendars"]["Row"];
type ScheduleGoogleEvent =
	Database["ff_schedules"]["Tables"]["schedule_google_events"]["Row"];
type SyncStatus = Database["ff_schedules"]["Enums"]["sync_status"];

/**
 * Googleカレンダー連携を作成
 */
export async function createGoogleConnection(params: {
	userId: string;
	googleAccountEmail: string;
	accessToken: string;
	refreshToken: string;
	tokenExpiresAt: string;
	syncRangeMonths?: number;
}): Promise<GoogleCalendarConnection> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("google_calendar_connections")
		.insert({
			user_id: params.userId,
			google_account_email: params.googleAccountEmail,
			access_token: params.accessToken,
			refresh_token: params.refreshToken,
			token_expires_at: params.tokenExpiresAt,
			sync_range_months: params.syncRangeMonths,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to create Google connection: ${error.message}`);
	}

	return data;
}

/**
 * Googleカレンダー連携を更新
 */
export async function updateGoogleConnection(
	connectionId: string,
	params: {
		accessToken?: string;
		refreshToken?: string;
		tokenExpiresAt?: string;
		isEnabled?: boolean;
		syncRangeMonths?: number;
	},
): Promise<GoogleCalendarConnection> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("google_calendar_connections")
		.update({
			access_token: params.accessToken,
			refresh_token: params.refreshToken,
			token_expires_at: params.tokenExpiresAt,
			is_enabled: params.isEnabled,
			sync_range_months: params.syncRangeMonths,
			last_synced_at: params.tokenExpiresAt
				? new Date().toISOString()
				: undefined,
		})
		.eq("id", connectionId)
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update Google connection: ${error.message}`);
	}

	return data;
}

/**
 * Googleカレンダー連携を削除
 */
export async function deleteGoogleConnection(connectionId: string) {
	const supabase = await createClient();

	const { error } = await supabase
		.schema("ff_schedules")
		.from("google_calendar_connections")
		.delete()
		.eq("id", connectionId);

	if (error) {
		throw new Error(`Failed to delete Google connection: ${error.message}`);
	}
}

/**
 * Googleカレンダーを登録
 */
export async function registerGoogleCalendar(params: {
	connectionId: string;
	googleCalendarId: string;
	calendarName: string;
	description?: string;
	colorId?: string;
	isPrimary?: boolean;
}): Promise<GoogleCalendar> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("google_calendars")
		.insert({
			connection_id: params.connectionId,
			google_calendar_id: params.googleCalendarId,
			calendar_name: params.calendarName,
			description: params.description,
			color_id: params.colorId,
			is_primary: params.isPrimary,
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to register Google calendar: ${error.message}`);
	}

	return data;
}

/**
 * Googleカレンダーの選択状態を更新
 */
export async function updateGoogleCalendarSelection(
	calendarId: string,
	isSelected: boolean,
): Promise<GoogleCalendar> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("google_calendars")
		.update({ is_selected: isSelected })
		.eq("id", calendarId)
		.select()
		.single();

	if (error) {
		throw new Error(
			`Failed to update Google calendar selection: ${error.message}`,
		);
	}

	return data;
}

/**
 * スケジュールのGoogleイベント同期状態を更新
 */
export async function updateGoogleEventSync(params: {
	scheduleId: string;
	googleCalendarId: string;
	googleEventId: string;
	syncStatus: SyncStatus;
}): Promise<ScheduleGoogleEvent> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_google_events")
		.upsert({
			schedule_id: params.scheduleId,
			google_calendar_id: params.googleCalendarId,
			google_event_id: params.googleEventId,
			sync_status: params.syncStatus,
			last_synced_at: new Date().toISOString(),
		})
		.select()
		.single();

	if (error) {
		throw new Error(`Failed to update Google event sync: ${error.message}`);
	}

	return data;
}

/**
 * スケジュールのGoogle同期状態を取得
 */
export async function getGoogleEventSync(
	scheduleId: string,
): Promise<ScheduleGoogleEvent[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("schedule_google_events")
		.select("*")
		.eq("schedule_id", scheduleId);

	if (error) {
		throw new Error(`Failed to fetch Google event sync: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーのGoogle連携情報を取得
 */
export async function getUserGoogleConnection(
	userId: string,
): Promise<GoogleCalendarConnection | null> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("google_calendar_connections")
		.select("*")
		.eq("user_id", userId)
		.eq("is_enabled", true)
		.single();

	if (error && error.code !== "PGRST116") {
		throw new Error(`Failed to fetch Google connection: ${error.message}`);
	}

	return data;
}

/**
 * ユーザーの選択済みGoogleカレンダー一覧を取得
 */
export async function getUserSelectedCalendars(
	userId: string,
): Promise<GoogleCalendar[]> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_schedules")
		.from("google_calendars")
		.select("*, connection:google_calendar_connections!inner(*)")
		.eq("google_calendar_connections.user_id", userId)
		.eq("is_selected", true);

	if (error) {
		throw new Error(`Failed to fetch selected calendars: ${error.message}`);
	}

	return data;
}
