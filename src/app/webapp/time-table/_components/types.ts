export interface TimeSlot {
	id: string;
	startTime: string; // HH:mm形式
	endTime: string; // HH:mm形式
	title: string;
	description?: string;
}

export interface ScheduleTemplate {
	id: string;
	name: string;
	description: string;
	applyTo: {
		days: number[]; // 0-6 (日-土)
	};
	slots: TimeSlot[];
}

export interface TimeTableSlot extends TimeSlot {
	dayIndex: number; // 0-6 (日-土)
}

// 時間の計算用ユーティリティ
export const timeToMinutes = (time: string): number => {
	const [hours, minutes] = time.split(":").map(Number);
	return hours * 60 + minutes;
};

export const minutesToTime = (minutes: number): string => {
	const hours = Math.floor(minutes / 60);
	const mins = minutes % 60;
	return `${hours.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}`;
};
