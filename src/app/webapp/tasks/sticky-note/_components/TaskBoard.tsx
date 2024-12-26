import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
	Background,
	type Connection,
	Controls,
	type Edge,
	type Node,
	type NodeChange,
	type NodeProps,
	addEdge,
	applyNodeChanges,
	useEdgesState,
	useNodesState,
	useReactFlow,
} from "reactflow";
import "reactflow/dist/style.css";
import { TaskNote } from "./TaskNote";
import { TaskGroup } from "./TaskGroup";
import { TaskToolbar } from "./TaskToolbar";
import { v4 as uuidv4 } from "uuid";

interface TaskGroupData {
	title: string;
	isCollapsed?: boolean;
	width?: number;
	height?: number;
	description?: string;
	priority?: "high" | "medium" | "low";
	status: "not_started" | "in_progress" | "completed";
	progress?: number;
}

interface TaskNoteData {
	title: string;
	description?: string;
	priority?: "high" | "medium" | "low";
	category?: string;
	status: "not_started" | "in_progress" | "completed";
	color?: string;
	parentId?: string;
}

type TaskNode = Node<TaskNoteData | TaskGroupData>;

export const TaskBoard = () => {
	const [nodes, setNodes] = useNodesState<TaskNoteData | TaskGroupData>([]);
	const [edges, setEdges] = useEdgesState([]);
	const [showGrid, setShowGrid] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const { getNode } = useReactFlow();

	const handleNodeDataChange = useCallback(
		(nodeId: string, data: Partial<TaskNoteData | TaskGroupData>) => {
			setNodes((nds) => {
				const updatedNodes = nds.map((node) =>
					node.id === nodeId
						? {
								...node,
								data: {
									...node.data,
									...data,
								},
							}
						: node,
				);

				// グループが折りたたまれた場合、子ノードを非表示にする
				const node = getNode(nodeId);
				if (node?.type === "taskGroup" && (data as TaskGroupData).isCollapsed) {
					return updatedNodes.map((n) =>
						(n.data as TaskNoteData).parentId === nodeId
							? { ...n, hidden: true }
							: n,
					);
				}
				if (
					node?.type === "taskGroup" &&
					!(data as TaskGroupData).isCollapsed
				) {
					return updatedNodes.map((n) =>
						(n.data as TaskNoteData).parentId === nodeId
							? { ...n, hidden: false }
							: n,
					);
				}

				// タスクのス��ータスが変更された場合、親グループの���度状況を更新
				if (node?.type === "taskNote" && "status" in data) {
					const parentId = (node.data as TaskNoteData).parentId;
					if (parentId) {
						const siblings = updatedNodes.filter(
							(n) =>
								n.type === "taskNote" &&
								(n.data as TaskNoteData).parentId === parentId,
						);
						const completedCount = siblings.filter(
							(n) => (n.data as TaskNoteData).status === "completed",
						).length;
						const progress = Math.round(
							(completedCount / siblings.length) * 100,
						);

						return updatedNodes.map((n) =>
							n.id === parentId
								? {
										...n,
										data: {
											...n.data,
											progress,
											status:
												progress === 100
													? "completed"
													: progress > 0
														? "in_progress"
														: "not_started",
										},
									}
								: n,
						);
					}
				}

				return updatedNodes;
			});
		},
		[setNodes, getNode],
	);

	const nodeTypes = useMemo(
		() => ({
			taskNote: (props: NodeProps<TaskNoteData>) => (
				<TaskNote
					{...props}
					onChange={(data) => handleNodeDataChange(props.id, data)}
				/>
			),
			taskGroup: (props: NodeProps<TaskGroupData>) => (
				<TaskGroup
					{...props}
					onChange={(data) => handleNodeDataChange(props.id, data)}
				/>
			),
		}),
		[handleNodeDataChange],
	);

	const updateGroupDimensions = useCallback(() => {
		setNodes((nds) => {
			const updatedNodes = [...nds];
			const groups = updatedNodes.filter((node) => node.type === "taskGroup");

			for (const group of groups) {
				const childNodes = updatedNodes.filter(
					(node) =>
						node.type === "taskNote" &&
						(node.data as TaskNoteData).parentId === group.id &&
						!node.hidden,
				);

				if (childNodes.length > 0) {
					const minX = Math.min(...childNodes.map((node) => node.position.x));
					const maxX = Math.max(
						...childNodes.map((node) => node.position.x + 220),
					); // 付箋の幅 + パディング
					const minY = Math.min(...childNodes.map((node) => node.position.y));
					const maxY = Math.max(
						...childNodes.map((node) => node.position.y + 200),
					); // 付箋の高さ + パディング

					const width = maxX - minX + 40; // 余白を追加
					const height = maxY - minY + 40; // 余白を追加

					group.position = {
						x: minX - 20,
						y: minY - 60, // ヘッダーの高さを考慮
					};

					group.data = {
						...group.data,
						width: Math.max(width, 300), // 最小幅を設定
						height: Math.max(height, 200), // 最小高さを設定
					};
				}
			}

			return updatedNodes;
		});
	}, [setNodes]);

	const onNodesChange = useCallback(
		(changes: NodeChange[]) => {
			setNodes((nds) => {
				let updatedNodes = [...nds];

				// ドラッグの開始と終了を検出
				const dragStart = changes.some(
					(change) => change.type === "position" && change.dragging === true,
				);
				const dragEnd = changes.some(
					(change) => change.type === "position" && change.dragging === false,
				);

				if (dragStart) {
					setIsDragging(true);
				}

				// 位置の変更を処理
				for (const change of changes) {
					if (change.type === "position" && change.position) {
						const node = updatedNodes.find((n) => n.id === change.id);
						if (node?.type === "taskGroup") {
							// グループが移動された場合、移動量を計算
							const deltaX = change.position.x - node.position.x;
							const deltaY = change.position.y - node.position.y;

							// グループ内の付箋も一緒に移動
							updatedNodes = updatedNodes.map((n) => {
								if ((n.data as TaskNoteData).parentId === node.id) {
									return {
										...n,
										position: {
											x: n.position.x + deltaX,
											y: n.position.y + deltaY,
										},
									};
								}
								return n;
							});
						} else if (node?.type === "taskNote" && isDragging) {
							// 付箋がドラッグされている場合、グループとの関係をチェック
							const groups = updatedNodes.filter((n) => n.type === "taskGroup");
							let foundGroup = false;

							for (const group of groups) {
								const groupBounds = {
									left: group.position.x,
									right:
										group.position.x +
										((group.data as TaskGroupData).width ?? 300),
									top: group.position.y,
									bottom:
										group.position.y +
										((group.data as TaskGroupData).height ?? 200),
								};

								// 付箋がグループの範囲内にあるかチェック
								if (
									change.position.x >= groupBounds.left &&
									change.position.x <= groupBounds.right &&
									change.position.y >= groupBounds.top &&
									change.position.y <= groupBounds.bottom
								) {
									// グループ内に入った場合、parentIdを設定
									updatedNodes = updatedNodes.map((n) =>
										n.id === node.id
											? {
													...n,
													data: {
														...n.data,
														parentId: group.id,
													},
												}
											: n,
									);
									foundGroup = true;
									break;
								}
							}

							// どのグループにも属していない場合、parentIdを削除
							if (!foundGroup) {
								updatedNodes = updatedNodes.map((n) =>
									n.id === node.id
										? {
												...n,
												data: {
													...n.data,
													parentId: undefined,
												},
											}
										: n,
								);
							}
						}
					}
				}

				// 通常の変更を適用
				updatedNodes = applyNodeChanges(changes, updatedNodes);

				// ドラッグ終了時のみグループのサイズを更新
				if (dragEnd) {
					setIsDragging(false);
					setTimeout(updateGroupDimensions, 0);
				}

				return updatedNodes;
			});
		},
		[setNodes, updateGroupDimensions, isDragging],
	);

	const onConnect = useCallback(
		(connection: Connection) => {
			if (connection.source && connection.target) {
				setEdges((eds) =>
					addEdge(
						{
							...connection,
							id: uuidv4(),
							type: "smoothstep",
						},
						eds,
					),
				);
			}
		},
		[setEdges],
	);

	const handleAddNote = useCallback(() => {
		const newNode: Node<TaskNoteData> = {
			id: uuidv4(),
			type: "taskNote",
			position: { x: Math.random() * 500, y: Math.random() * 500 },
			data: {
				title: "",
				description: "",
				status: "not_started",
				priority: "medium",
			},
			style: { zIndex: 1 }, // 付箋を前面に表示
		};
		setNodes((nds) => [...nds, newNode]);
	}, [setNodes]);

	const handleAddGroup = useCallback(() => {
		const newNode: Node<TaskGroupData> = {
			id: uuidv4(),
			type: "taskGroup",
			position: { x: Math.random() * 500, y: Math.random() * 500 },
			data: {
				title: "新しいグループ",
				isCollapsed: false,
				width: 300,
				height: 200,
				status: "not_started",
				progress: 0,
				priority: "medium",
			},
			style: { zIndex: 0 }, // グループを背面に表示
		};
		setNodes((nds) => [...nds, newNode]);
	}, [setNodes]);

	const handleDeleteSelected = useCallback(() => {
		setNodes((nds) => {
			// 選択されたノードのIDを取得
			const selectedIds = nds
				.filter((node) => node.selected)
				.map((node) => node.id);

			// グループが削除される場合、その子ノードも削除
			const idsToDelete = new Set(selectedIds);
			for (const id of selectedIds) {
				const node = nds.find((n) => n.id === id);
				if (node?.type === "taskGroup") {
					for (const n of nds) {
						if ((n.data as TaskNoteData).parentId === id) {
							idsToDelete.add(n.id);
						}
					}
				}
			}

			return nds.filter((node) => !idsToDelete.has(node.id));
		});

		setEdges((eds) =>
			eds.filter((edge) => {
				const sourceNode = nodes.find((node) => node.id === edge.source);
				const targetNode = nodes.find((node) => node.id === edge.target);
				return !(sourceNode?.selected || targetNode?.selected);
			}),
		);
	}, [nodes, setNodes, setEdges]);

	const handleGroupSelected = useCallback(() => {
		const selectedNodes = nodes.filter(
			(node) => node.selected && node.type === "taskNote",
		);
		if (selectedNodes.length === 0) return;

		const minX = Math.min(...selectedNodes.map((node) => node.position.x));
		const maxX = Math.max(
			...selectedNodes.map((node) => node.position.x + 220),
		);
		const minY = Math.min(...selectedNodes.map((node) => node.position.y));
		const maxY = Math.max(
			...selectedNodes.map((node) => node.position.y + 200),
		);

		const width = Math.max(maxX - minX + 40, 300);
		const height = Math.max(maxY - minY + 40, 200);

		const groupId = uuidv4();
		const groupNode: Node<TaskGroupData> = {
			id: groupId,
			type: "taskGroup",
			position: {
				x: minX - 20,
				y: minY - 60,
			},
			data: {
				title: "新しいグループ",
				isCollapsed: false,
				width,
				height,
				status: "not_started",
				progress: 0,
				priority: "medium",
			},
			style: { zIndex: 0 },
		};

		setNodes((nds) => [
			...nds.map((node) =>
				node.selected && node.type === "taskNote"
					? {
							...node,
							data: {
								...node.data,
								parentId: groupId,
							},
							selected: false,
							style: { zIndex: 1 },
						}
					: { ...node, selected: false },
			),
			groupNode,
		]);
	}, [nodes, setNodes]);

	const handleSave = useCallback(() => {
		const data = {
			nodes,
			edges,
		};
		localStorage.setItem("taskboard", JSON.stringify(data));
	}, [nodes, edges]);

	const handleLoad = useCallback(() => {
		const saved = localStorage.getItem("taskboard");
		if (saved) {
			const data = JSON.parse(saved);
			setNodes(data.nodes);
			setEdges(data.edges);
		}
	}, [setNodes, setEdges]);

	const handleExport = useCallback(() => {
		const data = {
			nodes,
			edges,
		};
		const blob = new Blob([JSON.stringify(data, null, 2)], {
			type: "application/json",
		});
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `taskboard-${new Date().toISOString()}.json`;
		a.click();
		URL.revokeObjectURL(url);
	}, [nodes, edges]);

	return (
		<div className="w-full h-[calc(100vh-4rem)]">
			<ReactFlow
				nodes={nodes}
				edges={edges}
				onNodesChange={onNodesChange}
				onConnect={onConnect}
				nodeTypes={nodeTypes}
				fitView
				nodesDraggable
				nodesConnectable
				elementsSelectable
				proOptions={{ hideAttribution: true }}
			>
				<TaskToolbar
					onAddNote={handleAddNote}
					onAddGroup={handleAddGroup}
					onGroupSelected={handleGroupSelected}
					onDeleteSelected={handleDeleteSelected}
					onSave={handleSave}
					onLoad={handleLoad}
					onExport={handleExport}
				/>
				{showGrid && <Background />}
				<Controls />
			</ReactFlow>
		</div>
	);
};
