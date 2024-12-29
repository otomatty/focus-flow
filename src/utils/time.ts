export function formatDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours === 0) {
		return `${remainingMinutes}分`;
	}
	if (remainingMinutes === 0) {
		return `${hours}時間`;
	}
	return `${hours}時間${remainingMinutes}分`;
}

export function parseDuration(duration: string): number {
	// PT1H30M形式の文字列から分数を取得
	const hourMatch = duration.match(/(\d+)H/);
	const minuteMatch = duration.match(/(\d+)M/);

	const hours = hourMatch ? Number.parseInt(hourMatch[1]) : 0;
	const minutes = minuteMatch ? Number.parseInt(minuteMatch[1]) : 0;

	return hours * 60 + minutes;
}

export function formatToDuration(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	let duration = "PT";
	if (hours > 0) {
		duration += `${hours}H`;
	}
	if (remainingMinutes > 0) {
		duration += `${remainingMinutes}M`;
	}
	return duration;
}
