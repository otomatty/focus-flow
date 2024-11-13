import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";

export const PomodoroTimer = () => {
  const { toast } = useToast();
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);

  useEffect(() => {
    let timer: number;
    if (isRunning && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      if (isBreak) {
        toast({
          title: "休憩終了",
          description: "作業を再開しましょう！",
        });
        setTimeLeft(25 * 60);
        setIsBreak(false);
      } else {
        toast({
          title: "作業セッション完了",
          description: "5分間の休憩を取りましょう！",
        });
        setTimeLeft(5 * 60);
        setIsBreak(true);
      }
      setIsRunning(false);
    }
    return () => clearInterval(timer);
  }, [isRunning, timeLeft, isBreak, toast]);

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setTimeLeft(25 * 60);
    setIsRunning(false);
    setIsBreak(false);
  };

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const progress = isBreak
    ? ((5 * 60 - timeLeft) / (5 * 60)) * 100
    : ((25 * 60 - timeLeft) / (25 * 60)) * 100;

  return (
    <div className="text-center">
      <h2 className="text-2xl font-semibold mb-4">
        {isBreak ? "休憩時間" : "作業時間"}
      </h2>
      <div className="text-4xl font-mono mb-4">
        {String(minutes).padStart(2, "0")}:{String(seconds).padStart(2, "0")}
      </div>
      <Progress value={progress} className="mb-4" />
      <div className="space-x-2">
        <Button onClick={toggleTimer}>
          {isRunning ? "一時停止" : "開始"}
        </Button>
        <Button variant="outline" onClick={resetTimer}>
          リセット
        </Button>
      </div>
    </div>
  );
};