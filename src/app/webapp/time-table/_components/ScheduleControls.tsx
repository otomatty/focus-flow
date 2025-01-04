"use client";

import { Button } from "@/components/ui/button";
import {
	Calendar,
	Plus,
	Save,
	ChevronLeft,
	ChevronRight,
	Copy,
} from "lucide-react";

export function ScheduleControls() {
	return (
		<div className="flex items-center gap-4">
			<div className="flex items-center gap-2">
				<Button size="sm" variant="ghost">
					<ChevronLeft className="h-4 w-4" />
				</Button>
				<span className="text-sm font-medium">2024年1月第1週</span>
				<Button size="sm" variant="ghost">
					<ChevronRight className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex items-center gap-2">
				<Button size="sm" variant="outline">
					<Calendar className="h-4 w-4 mr-2" />
					テンプレートを適用
				</Button>
				<Button size="sm" variant="outline">
					<Copy className="h-4 w-4 mr-2" />
					今週をコピー
				</Button>
				<Button size="sm" variant="outline">
					<Plus className="h-4 w-4 mr-2" />
					新規予定
				</Button>
				<Button size="sm">
					<Save className="h-4 w-4 mr-2" />
					保存
				</Button>
			</div>
		</div>
	);
}
