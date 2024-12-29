import { z } from "zod";

export const taskSchema = z.object({
	title: z
		.string()
		.min(1, "タイトルは必須です")
		.max(100, "タイトルは100文字以内で入力してください"),
	description: z
		.string()
		.max(1000, "説明は1000文字以内で入力してください")
		.optional(),
	type: z.enum(["task", "milestone", "epic"], {
		required_error: "タイプを選択してください",
	}),
	priority: z.enum(["high", "medium", "low"], {
		required_error: "優先度を選択してください",
	}),
	due_date: z.date().optional(),
	estimated_duration: z
		.string()
		.regex(
			/^PT(?:(\d+)H)?(?:(\d+)M)?$/,
			"ISO8601形式で入力してください (例: PT2H30M = 2時間30分)",
		)
		.optional(),
	category: z
		.string()
		.max(50, "カテゴリーは50文字以内で入力してください")
		.optional(),
	tags: z.array(z.string()).optional(),
});

export type TaskSchema = z.infer<typeof taskSchema>;
