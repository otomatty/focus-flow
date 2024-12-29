"use client";

import type * as React from "react";
import { Input } from "@/components/ui/input";

interface TimeFieldProps {
	value: string;
	onChange: (value: string) => void;
}

export function TimeField({ value, onChange }: TimeFieldProps) {
	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		// 時刻のバリデーション（HH:mm形式）
		if (/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/.test(newValue)) {
			onChange(newValue);
		}
	};

	return (
		<Input
			type="time"
			value={value}
			onChange={handleChange}
			className="w-full"
		/>
	);
}
