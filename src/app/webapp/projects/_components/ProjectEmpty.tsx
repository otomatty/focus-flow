import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

export function ProjectEmpty() {
	return (
		<div className="flex flex-col items-center justify-center p-8 text-center">
			<div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
				<div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
					<Plus className="h-10 w-10 text-muted-foreground" />
				</div>
				<h3 className="mt-4 text-lg font-semibold">プロジェクトがありません</h3>
				<p className="mb-4 mt-2 text-sm text-muted-foreground">
					新しいプロジェクトを作成して、タスクを整理しましょう。
				</p>
				<Button>
					<Plus className="mr-2 h-4 w-4" />
					新規プロジェクト
				</Button>
			</div>
		</div>
	);
}
