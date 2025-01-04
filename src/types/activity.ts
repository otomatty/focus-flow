import type { Database } from "@/types/supabase";
import type { CamelCase } from "@/utils/caseConverter";

// Supabaseのアクティビティテーブルの型
type ActivityRow = Database["ff_tasks"]["Tables"]["project_activities"]["Row"];
type ActivityInsert =
	Database["ff_tasks"]["Tables"]["project_activities"]["Insert"];

// アクティビティの種類の型
export type ActivityType = ActivityRow["type"];

// キャメルケースに変換されたアクティビティの型
export type Activity = {
	[K in keyof ActivityRow as CamelCase<K & string>]: ActivityRow[K];
} & {
	user?: {
		email: string | null;
	};
};

// アクティビティ作成時の型
export type ActivityCreate = {
	[K in keyof ActivityInsert as CamelCase<K & string>]: ActivityInsert[K];
};
