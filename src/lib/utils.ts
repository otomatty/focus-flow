import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function formatDuration(duration: string | null | undefined): string {
	if (!duration) {
		return "0:00";
	}

	if (duration.includes(":")) {
		return duration;
	}

	const minutes = Number.parseInt(duration, 10);
	if (Number.isNaN(minutes)) {
		return "0:00";
	}

	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;

	if (hours > 0) {
		return `${hours}:${remainingMinutes.toString().padStart(2, "0")}`;
	}

	return `${remainingMinutes}:00`;
}
