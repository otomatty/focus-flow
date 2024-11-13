export type GoalCategory = "work" | "private";
export type GoalTimeframe = "long" | "medium" | "short";

export type Goal = {
  id: string;
  title: string;
  description: string;
  category: GoalCategory;
  timeframe: GoalTimeframe;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
};