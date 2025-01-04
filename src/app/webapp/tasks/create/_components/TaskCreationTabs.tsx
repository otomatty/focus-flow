"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AITaskForm } from "./AITaskForm";
import { StandardTaskForm } from "./StandardTaskForm";
import { Card, CardContent } from "@/components/ui/card";

export function TaskCreationTabs() {
	return (
		<Card>
			<CardContent className="pt-6">
				<Tabs defaultValue="ai" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="ai">AIで分析・分解</TabsTrigger>
						<TabsTrigger value="standard">通常作成</TabsTrigger>
					</TabsList>
					<TabsContent value="ai">
						<AITaskForm />
					</TabsContent>
					<TabsContent value="standard">
						<StandardTaskForm />
					</TabsContent>
				</Tabs>
			</CardContent>
		</Card>
	);
}
