import { useLocation, useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import type { Task } from "@/pages/Index";

const Focus = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const task = location.state?.task as Task;

  if (!task) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <p>タスクが選択されていません</p>
        <Button onClick={() => navigate("/")} className="mt-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zen-50">
      <div className="container mx-auto px-4 py-8">
        <Button
          variant="outline"
          onClick={() => navigate("/")}
          className="mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          戻る
        </Button>

        <div className="max-w-2xl mx-auto">
          <Card className="p-6 mb-6">
            <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
            <p className="text-muted-foreground mb-4">
              推定所要時間: {task.estimatedMinutes}分
            </p>
            <PomodoroTimer />
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Focus;