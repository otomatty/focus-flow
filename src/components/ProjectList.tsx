import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@/types/project";

interface ProjectListProps {
  projects: Project[];
  currentProjectId: string | null;
  onSelectProject: (projectId: string) => void;
}

export const ProjectList = ({ projects, currentProjectId, onSelectProject }: ProjectListProps) => {
  const { toast } = useToast();

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold mb-4">プロジェクト一覧</h2>
      <div className="grid gap-4 md:grid-cols-2">
        {projects.map((project) => (
          <Card
            key={project.id}
            className={`p-4 cursor-pointer transition-colors ${
              project.id === currentProjectId ? "border-2 border-primary" : ""
            }`}
            onClick={() => {
              onSelectProject(project.id);
              toast({
                title: "プロジェクトを切り替えました",
                description: `${project.title}に切り替えました。`,
              });
            }}
          >
            <h3 className="text-lg font-semibold mb-2">{project.title}</h3>
            <p className="text-sm text-muted-foreground">{project.description}</p>
            <div className="mt-2 text-xs text-muted-foreground">
              最終更新: {project.updatedAt.toLocaleDateString()}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};