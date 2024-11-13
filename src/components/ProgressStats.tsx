import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@/pages/Index";

interface ProgressStatsProps {
  tasks: Task[];
}

export const ProgressStats = ({ tasks }: ProgressStatsProps) => {
  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="space-y-4">
      <div>
        <div className="flex justify-between mb-2">
          <span>完了率</span>
          <span>{Math.round(completionRate)}%</span>
        </div>
        <Progress value={completionRate} />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="text-center p-4 bg-zen-50 rounded-lg">
          <div className="text-2xl font-bold">{completedTasks}</div>
          <div className="text-sm text-zen-600">完了タスク</div>
        </div>
        <div className="text-center p-4 bg-zen-50 rounded-lg">
          <div className="text-2xl font-bold">{totalTasks - completedTasks}</div>
          <div className="text-sm text-zen-600">残タスク</div>
        </div>
      </div>
    </div>
  );
};