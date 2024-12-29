import { parse, toSeconds } from "iso8601-duration";

// ISO8601形式の期間を人間が読みやすい形式に変換
export function formatDuration(duration: string): string {
	try {
		const parsed = parse(duration);
		const seconds = toSeconds(parsed);

		const hours = Math.floor(seconds / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (hours === 0) {
			return `${minutes}分`;
		}
		if (minutes === 0) {
			return `${hours}時間`;
		}
		return `${hours}時間${minutes}分`;
	} catch (error) {
		console.error("Duration parsing error:", error);
		return duration;
	}
}

// 日付を「YYYY年MM月DD日」形式にフォーマット
export function formatDate(date: string | Date): string {
	const d = new Date(date);
	return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}

// 数値を3桁区切りでフォーマット
export function formatNumber(num: number): string {
	return num.toLocaleString("ja-JP");
}

// バイト数を適切な単位に変換
export function formatBytes(bytes: number): string {
	const units = ["B", "KB", "MB", "GB", "TB"];
	let size = bytes;
	let unitIndex = 0;

	while (size >= 1024 && unitIndex < units.length - 1) {
		size /= 1024;
		unitIndex++;
	}

	return `${Math.round(size * 10) / 10} ${units[unitIndex]}`;
}

// 経過時間を計算して表示
export function formatElapsedTime(date: string | Date): string {
	const now = new Date();
	const target = new Date(date);
	const diff = Math.floor((now.getTime() - target.getTime()) / 1000);

	if (diff < 60) {
		return "たった今";
	}
	if (diff < 3600) {
		return `${Math.floor(diff / 60)}分前`;
	}
	if (diff < 86400) {
		return `${Math.floor(diff / 3600)}時間前`;
	}
	if (diff < 2592000) {
		return `${Math.floor(diff / 86400)}日前`;
	}
	if (diff < 31536000) {
		return `${Math.floor(diff / 2592000)}ヶ月前`;
	}
	return `${Math.floor(diff / 31536000)}年前`;
}
