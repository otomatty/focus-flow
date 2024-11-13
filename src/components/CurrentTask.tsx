import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import type { Task } from "@/pages/Index";

interface CurrentTaskProps {
  task: Task | null;
}

export const CurrentTask = ({ task }: CurrentTaskProps) => {
  const navigate = useNavigate();

  if (!task) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">現在のタスクはありません</p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="text-2xl font-semibold mb-4">現在のタスク</h2>
      <div className="space-y-4">
        <div className="text-xl font-medium">{task.title}</div>
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Clock className="h-4 w-4" />
          <span>推定所要時間: {task.estimatedMinutes}分</span>
        </div>
        <Button
          onClick={() => navigate("/focus", { state: { task } })}
          className="w-full"
        >
          <Play className="mr-2 h-4 w-4" />
          作業を始める
        </Button>
      </div>
    </Card>
  );
};