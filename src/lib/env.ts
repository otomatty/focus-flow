/**
 * 必須の環境変数を取得する
 * @param key - 環境変数のキー
 * @returns 環境変数の値
 * @throws 環境変数が未設定の場合
 */
export const getRequiredEnvVar = (key: keyof NodeJS.ProcessEnv): string => {
	const value = process.env[key];
	if (!value) {
		throw new Error(`Missing required environment variable: ${key}`);
	}
	return value;
};

/**
 * オプショナルの環境変数を取得する
 * @param key - 環境変数のキー
 * @param defaultValue - デフォルト値
 * @returns 環境変数の値またはデフォルト値
 */
export const getOptionalEnvVar = (
	key: keyof NodeJS.ProcessEnv,
	defaultValue: string,
): string => {
	const value = process.env[key];
	return value ?? defaultValue;
};

/**
 * 数値型の環境変数を取得する
 * @param key - 環境変数のキー
 * @param defaultValue - デフォルト値
 * @returns 数値に変換された環境変数の値
 */
export const getNumberEnvVar = (
	key: keyof NodeJS.ProcessEnv,
	defaultValue: number,
): number => {
	const value = process.env[key];
	if (!value) {
		return defaultValue;
	}
	const num = Number.parseInt(value, 10);
	return Number.isNaN(num) ? defaultValue : num;
};

/**
 * ブール型の環境変数を取得する
 * @param key - 環境変数のキー
 * @param defaultValue - デフォルト値
 * @returns ブール値に変換された環境変数の値
 */
export const getBooleanEnvVar = (
	key: keyof NodeJS.ProcessEnv,
	defaultValue: boolean,
): boolean => {
	const value = process.env[key]?.toLowerCase();
	if (!value) {
		return defaultValue;
	}
	return value === "true" || value === "1";
};

/**
 * アプリケーションの設定を取得する
 */
export const getAppConfig = () => ({
	url: getRequiredEnvVar("NEXT_PUBLIC_APP_URL"),
	name: getRequiredEnvVar("NEXT_PUBLIC_APP_NAME"),
	description: getRequiredEnvVar("NEXT_PUBLIC_APP_DESCRIPTION"),
});

/**
 * セッションの設定を取得する
 */
export const getSessionConfig = () => ({
	sessionDurationMinutes: getNumberEnvVar(
		"NEXT_PUBLIC_SESSION_DURATION_MINUTES",
		25,
	),
	shortBreakDurationMinutes: getNumberEnvVar(
		"NEXT_PUBLIC_SHORT_BREAK_DURATION_MINUTES",
		5,
	),
	longBreakDurationMinutes: getNumberEnvVar(
		"NEXT_PUBLIC_LONG_BREAK_DURATION_MINUTES",
		15,
	),
	sessionsUntilLongBreak: getNumberEnvVar(
		"NEXT_PUBLIC_SESSIONS_UNTIL_LONG_BREAK",
		4,
	),
});
