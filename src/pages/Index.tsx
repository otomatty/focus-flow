import { useState } from "react";
import { Card } from "@/components/ui/card";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { TaskList } from "@/components/TaskList";
import { ProgressStats } from "@/components/ProgressStats";
import { ProjectList } from "@/components/ProjectList";
import { CurrentTask } from "@/components/CurrentTask";
import { GoalList } from "@/components/GoalList";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types/project";
import type { Goal } from "@/types/goal";

export type Task = {
  id: string;
  title: string;
  priority: "high" | "medium" | "low";
  completed: boolean;
  parentTaskId?: string;
  dueDate?: Date;
  estimatedMinutes: number;
  projectId: string;
};

const Index = () => {
  const { toast } = useToast();
  const [projects, setProjects] = useState<Project[]>([
    {
      id: "1",
      title: "フォーカスフローガーデン",
      description: "エンジニアの生産性を向上させるためのツール",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "AI駆動型タスク管理",
      description: "AIを活用したタスク管理システム",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "プログラミングスキルの向上",
      description: "新しい技術スタックの習得と実践",
      category: "work",
      timeframe: "long",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "2",
      title: "健康的な生活習慣の確立",
      description: "運動習慣の定着と睡眠時間の確保",
      category: "private",
      timeframe: "medium",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [currentProjectId, setCurrentProjectId] = useState<string | null>("1");
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "プロジェクト計画の作成",
      priority: "high",
      completed: false,
      estimatedMinutes: 30,
      projectId: "1",
    },
    {
      id: "2",
      title: "クライアントミーティング",
      priority: "medium",
      completed: false,
      estimatedMinutes: 60,
      projectId: "1",
    },
  ]);

  const currentTask = tasks.find(task => 
    task.projectId === currentProjectId && !task.completed
  ) || null;

  const onDragEnd = (result: any) => {
    if (!result.destination) return;

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setTasks(items);
  };

  const toggleTaskCompletion = (taskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, completed: !task.completed }
        : task
    ));
    
    toast({
      title: "タスクのステータスを更新しました",
      description: "タスクの完了状態が変更されました。",
    });
  };

  const addSubtasks = (subtasks: string[], parentTaskId: string) => {
    const newSubtasks = subtasks.map((title, index) => ({
      id: `${parentTaskId}-sub-${index}`,
      title,
      priority: "medium" as const,
      completed: false,
      parentTaskId,
      estimatedMinutes: 30, // デフォルト値として30分を設定
      projectId: currentProjectId || "1",
    }));

    setTasks([...tasks, ...newSubtasks]);
  };

  const handleAddGoal = () => {
    toast({
      title: "目標の追加",
      description: "新しい目標を追加する機能は開発中です。",
    });
  };

  return (
    <div className="min-h-screen bg-zen-50">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-zen-800 mb-2">集中力</h1>
          <p className="text-zen-600">エンジニアのための生産性ツール</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-8 space-y-6">
            <CurrentTask task={currentTask} />
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-4">進捗状況</h2>
              <ProgressStats tasks={tasks.filter(task => task.projectId === currentProjectId)} />
            </Card>
            <Card className="p-6">
              <GoalList goals={goals} onAddGoal={handleAddGoal} />
            </Card>
          </div>

          <div className="md:col-span-4 space-y-6">
            <Card className="p-6">
              <ProjectList
                projects={projects}
                currentProjectId={currentProjectId}
                onSelectProject={setCurrentProjectId}
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
