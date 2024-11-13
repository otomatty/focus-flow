import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Target } from "lucide-react";
import type { Goal, GoalCategory, GoalTimeframe } from "@/types/goal";

interface GoalListProps {
  goals: Goal[];
  onAddGoal?: () => void;
}

export const GoalList = ({ goals, onAddGoal }: GoalListProps) => {
  const getCategoryLabel = (category: GoalCategory) => {
    return category === "work" ? "仕事" : "プライベート";
  };

  const getTimeframeLabel = (timeframe: GoalTimeframe) => {
    switch (timeframe) {
      case "long":
        return "長期";
      case "medium":
        return "中期";
      case "short":
        return "短期";
    }
  };

  const getCategoryColor = (category: GoalCategory) => {
    return category === "work" ? "bg-blue-500" : "bg-green-500";
  };

  const getTimeframeColor = (timeframe: GoalTimeframe) => {
    switch (timeframe) {
      case "long":
        return "bg-purple-500";
      case "medium":
        return "bg-orange-500";
      case "short":
        return "bg-yellow-500";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold">目標一覧</h2>
        <Button onClick={onAddGoal} variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          目標を追加
        </Button>
      </div>

      {goals.length === 0 ? (
        <Card className="p-6 text-center text-muted-foreground">
          <Target className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>目標が設定されていません</p>
          <p className="text-sm">新しい目標を追加して始めましょう</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {goals.map((goal) => (
            <Card key={goal.id} className="p-4">
              <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2">
                  <Badge className={getCategoryColor(goal.category)}>
                    {getCategoryLabel(goal.category)}
                  </Badge>
                  <Badge className={getTimeframeColor(goal.timeframe)}>
                    {getTimeframeLabel(goal.timeframe)}
                  </Badge>
                </div>
                <h3 className="text-lg font-medium">{goal.title}</h3>
                <p className="text-muted-foreground text-sm">
                  {goal.description}
                </p>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};