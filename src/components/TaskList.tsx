import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, Split } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { subdivideTask } from "@/lib/gemini";
import type { Task } from "@/pages/Index";
import { useState } from "react";

interface TaskListProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => void;
  onDragEnd: (result: any) => void;
  onAddTasks: (subtasks: string[], parentTaskId: string) => void;
}

export const TaskList = ({ tasks, onToggleComplete, onDragEnd, onAddTasks }: TaskListProps) => {
  const { toast } = useToast();
  const [processingTaskId, setProcessingTaskId] = useState<string | null>(null);

  const getPriorityColor = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "bg-sakura-500 hover:bg-sakura-600";
      case "medium":
        return "bg-yellow-500 hover:bg-yellow-600";
      case "low":
        return "bg-zen-500 hover:bg-zen-600";
    }
  };

  const getPriorityLabel = (priority: Task["priority"]) => {
    switch (priority) {
      case "high":
        return "高";
      case "medium":
        return "中";
      case "low":
        return "低";
    }
  };

  const handleSubdivideTask = async (taskId: string, taskTitle: string) => {
    setProcessingTaskId(taskId);
    try {
      const subtasks = await subdivideTask(taskTitle);
      if (subtasks.length > 0) {
        onAddTasks(subtasks, taskId);
        toast({
          title: "タスクを細分化しました",
          description: `${subtasks.length}個のサブタスクを作成しました。`,
        });
      }
    } catch (error) {
      toast({
        title: "エラー",
        description: "タスクの細分化に失敗しました。",
        variant: "destructive",
      });
    } finally {
      setProcessingTaskId(null);
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tasks">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    className="flex items-center space-x-4 p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:border-gray-200 transition-colors"
                  >
                    <Checkbox
                      checked={task.completed}
                      onCheckedChange={() => onToggleComplete(task.id)}
                    />
                    <span
                      className={`flex-grow ${
                        task.completed ? "line-through text-gray-400" : ""
                      }`}
                    >
                      {task.title}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Badge className={getPriorityColor(task.priority)}>
                        {getPriorityLabel(task.priority)}
                      </Badge>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleSubdivideTask(task.id, task.title)}
                        disabled={processingTaskId === task.id}
                      >
                        {processingTaskId === task.id ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Split className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};