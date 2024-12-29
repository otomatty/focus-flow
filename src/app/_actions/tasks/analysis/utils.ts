import type {
	TaskFormData,
	TaskComplexity,
	TaskRisk,
	TaskQualityMetrics,
	TaskAnalysisContext,
} from "@/types/task";

export function evaluateComplexity(
	task: TaskFormData,
	context?: TaskAnalysisContext,
): TaskComplexity {
	// 基本的な複雑性スコアの計算
	let score = 0;
	const factors: string[] = [];

	// 説明の長さと詳細度による評価
	if (task.description) {
		const words = task.description.split(/\s+/).length;
		if (words > 100) {
			score += 2;
			factors.push("詳細な説明が必要");
		}
	}

	// 予想所要時間による評価
	if (task.estimated_duration) {
		const hours = Number.parseInt(
			task.estimated_duration.match(/PT(\d+)H/)?.[1] || "0",
		);
		if (hours > 8) {
			score += 2;
			factors.push("長時間の作業が必要");
		}
	}

	// 依存関係による評価
	if (task.dependencies && task.dependencies.length > 0) {
		score += task.dependencies.length;
		factors.push(`${task.dependencies.length}個の依存関係あり`);
	}

	// スキルカテゴリによる評価
	if (task.skill_category) {
		const requiredSkillLevel =
			context?.userContext?.skillLevels[task.skill_category] || 0;
		if (requiredSkillLevel > 3) {
			score += 2;
			factors.push("高度なスキルが必要");
		}
	}

	// 技術的負債リスクの評価
	const technicalDebtRisk = Math.min(score * 0.2, 1);

	return {
		score,
		factors,
		level: score <= 3 ? "low" : score <= 6 ? "medium" : "high",
		technicalDebtRisk,
	};
}

export function analyzeRisks(
	task: TaskFormData,
	context?: TaskAnalysisContext,
): TaskRisk[] {
	const risks: TaskRisk[] = [];

	// 技術的リスクの評価
	if (task.skill_category) {
		const skillLevel =
			context?.userContext?.skillLevels[task.skill_category] || 0;
		if (skillLevel < 2) {
			risks.push({
				type: "technical",
				probability: 0.7,
				impact: 0.6,
				description: "必要なスキルレベルが不足している可能性",
				mitigation: "トレーニングまたは経験者のサポートを検討",
			});
		}
	}

	// スケジュールリスクの評価
	if (task.estimated_duration) {
		const hours = Number.parseInt(
			task.estimated_duration.match(/PT(\d+)H/)?.[1] || "0",
		);
		if (hours > 16) {
			risks.push({
				type: "schedule",
				probability: 0.5,
				impact: 0.8,
				description: "長期タスクによる遅延リスク",
				mitigation: "マイルストーンの設定と進捗の定期的な確認",
			});
		}
	}

	// リソースリスクの評価
	if (context?.teamContext && task.skill_category) {
		if (!context.teamContext.availableSkills.includes(task.skill_category)) {
			risks.push({
				type: "resource",
				probability: 0.9,
				impact: 0.7,
				description: "必要なスキルを持つチームメンバーが不足",
				mitigation: "外部リソースの検討または代替アプローチの検討",
			});
		}
	}

	return risks;
}

export function calculateQualityMetrics(
	task: TaskFormData,
	context?: TaskAnalysisContext,
): TaskQualityMetrics {
	let clarity = 1;
	let completeness = 1;
	let feasibility = 1;
	let testability = 1;
	let maintainability = 1;

	// 明確性の評価
	if (task.description) {
		const words = task.description.split(/\s+/).length;
		clarity = Math.min(words / 50, 1); // 50単語で最大スコア
	}

	// 完全性の評価
	completeness =
		[
			task.title,
			task.description,
			task.estimated_duration,
			task.category,
			task.skill_category,
		].filter(Boolean).length / 5;

	// 実現可能性の評価
	if (context?.userContext?.skillLevels && task.skill_category) {
		const skillLevel =
			context.userContext.skillLevels[task.skill_category] || 0;
		feasibility = Math.min(skillLevel / 5, 1);
	}

	// テスト可能性の評価
	testability = task.description ? 0.8 : 0.4;
	if (task.category === "testing") testability = 1;

	// 保守性の評価
	maintainability = (clarity + completeness + feasibility) / 3;

	return {
		clarity,
		completeness,
		feasibility,
		testability,
		maintainability,
	};
}
