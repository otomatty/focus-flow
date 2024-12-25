// src/utils/caseConverter.ts

// スネークケースをキャメルケースに変換するユーティリティ関数
function toCamelCase(str: string): string {
	return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

// オャメルケースをスネークケースに変換するユーティリティ関数
function toSnakeCase(str: string): string {
	return str.replace(/([A-Z])/g, "_$1").toLowerCase();
}

// 既存のコードの前に型定義を追加
export type CamelCase<S extends string> = S extends `${infer P}_${infer Q}`
	? `${P}${Capitalize<CamelCase<Q>>}`
	: S;

// オブジェクトのプロパティを再帰的にキャメルケースに変換する関数
export function convertToCamelCase<T>(obj: T): T {
	if (Array.isArray(obj)) {
		return obj.map((item) => convertToCamelCase(item)) as unknown as T;
	}
	if (obj !== null && typeof obj === "object") {
		return Object.keys(obj).reduce((acc, key) => {
			const camelCaseKey = toCamelCase(key);
			(acc as Record<string, unknown>)[camelCaseKey] = convertToCamelCase(
				(obj as Record<string, unknown>)[key],
			);
			return acc;
		}, {} as T);
	}
	return obj;
}

// オブジェクトのプロパティを再帰的にスネークケースに変換する関数
export function convertToSnakeCase<T>(obj: T): T {
	if (Array.isArray(obj)) {
		return obj.map((item) => convertToSnakeCase(item)) as unknown as T;
	}
	if (obj !== null && typeof obj === "object") {
		return Object.keys(obj).reduce((acc, key) => {
			const snakeCaseKey = toSnakeCase(key);
			(acc as Record<string, unknown>)[snakeCaseKey] = convertToSnakeCase(
				(obj as Record<string, unknown>)[key],
			);
			return acc;
		}, {} as T);
	}
	return obj;
}

// 導入方法
// 型をキャメルケースに変換するにはconvertToCamelCase関数を使用します。
// 例えば、以下のように使用します。
// const camelCaseObject = convertToCamelCase(snakeCaseObject);
// 結果:
// { camelCaseKey: value }

// 型をスネークケースに変換するにはconvertToSnakeCase関数を使用します。
// 例えば、以下のように使用します。
// const snakeCaseObject = convertToSnakeCase(camelCaseObject);
// 結果:
// { snake_case_key: value }
