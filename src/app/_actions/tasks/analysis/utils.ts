import type { TaskFormData } from "@/types/task";

interface TaskAnalysisMetrics {
	complexity: number;
	estimated_hours: number;
	risk_level: "low" | "medium" | "high";
	factors: string[];
}

export function analyzeTaskComplexity(task: TaskFormData): TaskAnalysisMetrics {
	let complexity = 0;
	const factors: string[] = [];

	// 説明の長さによる評価
	if (task.description) {
		const words = task.description.split(/\s+/).length;
		if (words > 100) {
			complexity += 2;
			factors.push("詳細な説明が必要");
		}
	}

	// 予想所要時間による評価
	let estimatedHours = 0;
	if (task.estimated_duration) {
		estimatedHours = Number.parseInt(task.estimated_duration) || 0;
		if (estimatedHours > 8) {
			complexity += 2;
			factors.push("長時間の作業が必要");
		}
	}

	// カテゴリによる評価
	if (task.category_id) {
		complexity += 1;
		factors.push(`カテゴリ: ${task.category_id}`);
	}

	return {
		complexity,
		estimated_hours: estimatedHours,
		risk_level: complexity <= 2 ? "low" : complexity <= 4 ? "medium" : "high",
		factors,
	};
}
