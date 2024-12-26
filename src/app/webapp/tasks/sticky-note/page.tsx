"use client";

import { TaskBoard } from "./_components/TaskBoard";
import { ReactFlowProvider } from "reactflow";

export default function StickyNotePage() {
	return (
		<div className="h-full w-full">
			<ReactFlowProvider>
				<TaskBoard />
			</ReactFlowProvider>
		</div>
	);
}
