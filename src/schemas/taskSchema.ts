import { z } from "zod";

export const taskSchema = z.object({
	title: z.string().min(1, "タイトルを入力してください"),
	description: z.string().optional(),
	priority: z.enum(["high", "medium", "low"]).default("medium"),
	status: z
		.enum([
			"not_started",
			"in_progress",
			"in_review",
			"blocked",
			"completed",
			"cancelled",
		])
		.default("not_started"),
	progress_percentage: z.number().min(0).max(100).default(0),
	is_recurring: z.boolean().default(false),
	start_date: z.date().optional(),
	due_date: z.date().optional(),
	estimated_duration: z.number().min(0).optional(), // 分単位
	category: z.string().optional(),
	skill_category: z.string().optional(),
	experience_points: z.number().optional(),
	style: z
		.object({
			color: z.string().optional(),
			icon: z.string().optional(),
		})
		.optional(),
	project_id: z.string().optional(),
	group_id: z.string().optional(),
	dependencies: z
		.array(
			z.object({
				task_id: z.string(),
				type: z
					.enum(["required", "optional", "conditional"])
					.default("required"),
				link_type: z
					.enum([
						"finish_to_start",
						"start_to_start",
						"finish_to_finish",
						"start_to_finish",
					])
					.default("finish_to_start"),
			}),
		)
		.optional(),
});

export const standardTaskSchema = z.object({
	title: z.string().min(1, "タイトルを入力してください"),
	description: z.string().min(1, "説明を入力してください"),
	priority: z.enum(["high", "medium", "low"]).default("medium"),
	project_id: z.string().optional(),
	start_date: z.date().optional(),
	due_date: z.date().optional(),
	is_recurring: z.boolean().default(false),
	recurring_pattern: z
		.object({
			frequency: z.enum(["daily", "weekly", "monthly"]),
			interval: z.number().min(1),
			end_date: z.date().optional(),
		})
		.optional(),
	category: z.string().optional(),
	style: z
		.object({
			color: z.string().optional(),
			icon: z.string().optional(),
		})
		.optional(),
	estimated_duration: z.number().min(0).optional(), // 分単位
});

export type TaskSchema = z.infer<typeof taskSchema>;
