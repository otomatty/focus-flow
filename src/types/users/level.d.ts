import type { Database } from "@/lib/database.types";

type UserLevelRow = Database["ff_gamification"]["Tables"]["user_levels"]["Row"];
type LevelSettingRow =
	Database["ff_gamification"]["Tables"]["level_settings"]["Row"];

export type UserLevel = UserLevelRow;
export type LevelSetting = LevelSettingRow;
