export interface Project {
	id: string;
	name: string;
	description?: string;
	status: "not_started" | "in_progress" | "completed" | "on_hold";
	priority: "high" | "medium" | "low";
	startDate?: string;
	endDate?: string;
	color?: string;
	isArchived?: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface ProjectFormValues {
	name: string;
	description?: string;
	status: "not_started" | "in_progress" | "completed" | "on_hold";
	priority: "high" | "medium" | "low";
	startDate?: Date;
	endDate?: Date;
	color?: string;
	isArchived?: boolean;
}

export interface ProjectCreate {
	name: string;
	description?: string;
	status?: "not_started" | "in_progress" | "completed" | "on_hold";
	priority?: "high" | "medium" | "low";
	startDate?: string;
	endDate?: string;
	color?: string;
	isArchived?: boolean;
}

export interface ProjectUpdate extends Partial<ProjectCreate> {}

export interface ProjectFilter {
	status?: "not_started" | "in_progress" | "completed" | "on_hold";
	priority?: "high" | "medium" | "low";
	search?: string;
	isArchived?: boolean;
}

export interface ProjectSort {
	key: keyof Project;
	direction: "asc" | "desc";
}
