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
	parentId?: string;
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

export const TaskBoard = () => {
	const [nodes, setNodes] = useNodesState<TaskNoteData | TaskGroupData>([]);
	const [edges, setEdges] = useEdgesState([]);
	const [showGrid, setShowGrid] = useState(true);
	const [isDragging, setIsDragging] = useState(false);
	const [draggedNodeId, setDraggedNodeId] = useState<string | null>(null);
	const { getNode } = useReactFlow();

	const handleNodeDataChange = useCallback(
		(nodeId: string, data: Partial<TaskNoteData | TaskGroupData>) => {
			setNodes((nds) => {
				console.log("=== Node Data Change Start ===");
				console.log("NodeId:", nodeId);
				console.log("Update Data:", data);
				console.log("Current Nodes:", nds);

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
					console.log("Collapsing group:", nodeId);
					// 再帰的に子孫ノードを非表示にする関数
					const hideDescendants = (parentId: string, nodes: Node[]): Node[] => {
						console.log("Hiding descendants of:", parentId);
						let result = [...nodes];
						const children = result.filter(
							(n) => (n.data as TaskNoteData).parentId === parentId,
						);

						for (const child of children) {
							console.log(
								"Found child node:",
								child.id,
								"of parent:",
								parentId,
							);
							// 子ノードを非表示にする（グループの場合は折りたたみ状態を保持）
							result = result.map((n) =>
								n.id === child.id
									? {
											...n,
											hidden: true,
											data: {
												...n.data,
												// グループの場合は元の折りたたみ状態を保持
												...(n.type === "taskGroup" && {
													isCollapsed: (n.data as TaskGroupData).isCollapsed,
												}),
											},
										}
									: n,
							);

							// グループの場合は、その子孫も処理（折りたたみ状態に関係なく全て非表示）
							if (child.type === "taskGroup") {
								console.log("Child is a group, hiding descendants:", child.id);
								result = hideDescendants(child.id, result);
							}
						}

						return result;
					};

					const result = hideDescendants(nodeId, updatedNodes);
					console.log("Final nodes after hiding:", result);
					return result;
				}

				if (
					node?.type === "taskGroup" &&
					!(data as TaskGroupData).isCollapsed
				) {
					console.log("Expanding group:", nodeId);
					// 再帰的に子ノードを表示する関数（親が開いている場合のみ）
					const showDescendants = (
						parentId: string,
						isParentVisible: boolean,
						nodes: Node[],
					): Node[] => {
						console.log(
							"Showing descendants of:",
							parentId,
							"Parent visible:",
							isParentVisible,
						);
						let result = [...nodes];
						const children = result.filter(
							(n) => (n.data as TaskNoteData).parentId === parentId,
						);

						for (const child of children) {
							console.log(
								"Found child node:",
								child.id,
								"of parent:",
								parentId,
							);
							const isCollapsed =
								child.type === "taskGroup"
									? (child.data as TaskGroupData).isCollapsed
									: false;
							console.log("Node collapse state:", child.id, isCollapsed);

							// 子ノード表示状態を更新
							result = result.map((n) =>
								n.id === child.id
									? {
											...n,
											// 親が表示されている場合は表示する（グループの場合は折りたたみ状態に関係なく表示）
											hidden: !isParentVisible,
											data: {
												...n.data,
												// グループの場合は元の折りたたみ状態を保持
												...(n.type === "taskGroup" && {
													isCollapsed: isCollapsed,
												}),
											},
										}
									: n,
							);

							// グループの場合は、子孫も処理
							if (child.type === "taskGroup") {
								console.log("Processing group children:", child.id);
								// 親が表示されていて、かつグループが開いている場合のみ子孫を表示
								result = showDescendants(
									child.id,
									isParentVisible && !isCollapsed,
									result,
								);
							}
						}

						return result;
					};

					const result = showDescendants(nodeId, true, updatedNodes);
					console.log("Final nodes after showing:", result);
					return result;
				}

				// タスクのスタスが変更された場合、親グループの度状況を更新
				if (node?.type === "taskNote" && "status" in data) {
					console.log("Updating task status:", nodeId);
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

						console.log("Updating parent group progress:", parentId, progress);
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

				console.log("=== Node Data Change End ===");
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

			// グループを親から子の順に処理するために深さでソート
			const sortedGroups = [...groups].sort((a, b) => {
				const aDepth = getGroupDepth(a.id, updatedNodes);
				const bDepth = getGroupDepth(b.id, updatedNodes);
				return bDepth - aDepth; // 深い方（子）から処理
			});

			for (const group of sortedGroups) {
				const childNodes = updatedNodes.filter(
					(node) =>
						(node.type === "taskNote" || node.type === "taskGroup") &&
						(node.data as TaskNoteData & TaskGroupData).parentId === group.id &&
						!node.hidden,
				);

				if (childNodes.length > 0) {
					// 子要素の位置とサイズを考慮して親グループのサイズを計算
					const PADDING = 40; // 左右の余白
					const HEADER_HEIGHT = 60; // ヘッダーの高さ
					const TOP_PADDING = 20; // 上部の余白
					const BOTTOM_PADDING = 20; // 下部の余白

					const minX = Math.min(...childNodes.map((node) => node.position.x));
					const maxX = Math.max(
						...childNodes.map((node) => {
							const width =
								node.type === "taskGroup"
									? ((node.data as TaskGroupData).width ?? 300)
									: 220;
							return node.position.x + width + PADDING;
						}),
					);

					const minY = Math.min(...childNodes.map((node) => node.position.y));
					const maxY = Math.max(
						...childNodes.map((node) => {
							const height =
								node.type === "taskGroup"
									? ((node.data as TaskGroupData).height ?? 200)
									: 200;
							return node.position.y + height + BOTTOM_PADDING;
						}),
					);

					// グループのサイズを設定
					const width = Math.max(maxX - minX + PADDING * 2, 300); // 最小幅を確保
					const height = Math.max(
						maxY - minY + HEADER_HEIGHT + TOP_PADDING + BOTTOM_PADDING,
						200,
					); // 最小高さを確保

					// グループの位置を設定（子要素を包括するように）
					group.position = {
						x: minX - PADDING,
						y: minY - HEADER_HEIGHT - TOP_PADDING,
					};

					group.data = {
						...group.data,
						width,
						height,
					};
				}
			}

			return updatedNodes;
		});
	}, [setNodes]);

	// グループの深さを計算するヘルパー関数
	const getGroupDepth = useCallback(
		(groupId: string, nodes: Node[]): number => {
			const node = nodes.find((n) => n.id === groupId);
			if (!node) return 0;

			const parentId = (node.data as TaskNoteData & TaskGroupData).parentId;
			if (!parentId) return 0;

			return 1 + getGroupDepth(parentId, nodes);
		},
		[],
	);

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
					// ドラッグ開始時にノードIDを保存
					const draggedNode = changes.find(
						(change) => change.type === "position" && change.dragging === true,
					) as { id: string } | undefined;
					if (draggedNode) {
						setDraggedNodeId(draggedNode.id);
					}
				}

				// 位置の変更を処理
				for (const change of changes) {
					if (change.type === "position" && change.position) {
						const node = updatedNodes.find((n) => n.id === change.id);
						if (node?.type === "taskGroup") {
							// グループが移動された場合、移動量を計算
							const deltaX = change.position.x - node.position.x;
							const deltaY = change.position.y - node.position.y;

							// 再帰的に子孫ノードを移動する関数
							const moveDescendants = (
								parentId: string,
								nodes: Node[],
							): Node[] => {
								let result = [...nodes];
								const children = result.filter(
									(n) => (n.data as TaskNoteData).parentId === parentId,
								);

								for (const child of children) {
									// 子ノードを移動
									result = result.map((n) =>
										n.id === child.id
											? {
													...n,
													position: {
														x: n.position.x + deltaX,
														y: n.position.y + deltaY,
													},
												}
											: n,
									);

									// グループの場合は、その子孫も移動
									if (child.type === "taskGroup") {
										result = moveDescendants(child.id, result);
									}
								}

								return result;
							};

							// 子孫ノードを移動
							updatedNodes = moveDescendants(node.id, updatedNodes);

							// ドラッグ中のグループ自体がグループ内に入るかチェック
							if (isDragging) {
								const otherGroups = updatedNodes.filter(
									(n) => n.type === "taskGroup" && n.id !== node.id,
								);
								let foundParentGroup = false;

								for (const parentGroup of otherGroups) {
									const groupBounds = {
										left: parentGroup.position.x,
										right:
											parentGroup.position.x +
											((parentGroup.data as TaskGroupData).width ?? 300),
										top: parentGroup.position.y,
										bottom:
											parentGroup.position.y +
											((parentGroup.data as TaskGroupData).height ?? 200),
									};

									const isOverGroup =
										change.position.x >= groupBounds.left &&
										change.position.x <= groupBounds.right &&
										change.position.y >= groupBounds.top &&
										change.position.y <= groupBounds.bottom;

									// グループのハイライト状態を更新
									updatedNodes = updatedNodes.map((n) =>
										n.id === parentGroup.id
											? {
													...n,
													style: {
														...n.style,
														borderColor: isOverGroup ? "#3b82f6" : undefined,
														borderWidth: isOverGroup ? 2 : undefined,
														borderRadius: isOverGroup ? "0.5rem" : undefined,
													},
												}
											: n,
									);

									if (isOverGroup) {
										// 親グループ内に入った場合、parentIdを設定
										updatedNodes = updatedNodes.map((n) =>
											n.id === node.id
												? {
														...n,
														data: {
															...n.data,
															parentId: parentGroup.id,
														},
													}
												: n,
										);
										foundParentGroup = true;
									}
								}

								// どのグループにも属していない場合、parentIdを削除
								if (!foundParentGroup) {
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
						} else if (
							(node?.type === "taskNote" || node?.type === "taskGroup") &&
							isDragging
						) {
							// 付箋またはグループがドラッグされている場合、グループとの関係をチェック
							const groups = updatedNodes.filter(
								(n) => n.type === "taskGroup" && n.id !== node.id,
							);
							let foundGroup = false;
							let deepestGroup: { group: Node; depth: number } | null = null;

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

								const isOverGroup =
									change.position.x >= groupBounds.left &&
									change.position.x <= groupBounds.right &&
									change.position.y >= groupBounds.top &&
									change.position.y <= groupBounds.bottom;

								if (isOverGroup) {
									const depth = getGroupDepth(group.id, updatedNodes);
									if (!deepestGroup || depth > deepestGroup.depth) {
										deepestGroup = { group, depth };
									}
									foundGroup = true;
								}
							}

							// 最も深いグループのみハイライト
							updatedNodes = updatedNodes.map((n) =>
								n.type === "taskGroup"
									? {
											...n,
											style: {
												...n.style,
												borderColor:
													deepestGroup?.group.id === n.id
														? "#3b82f6"
														: undefined,
												borderWidth:
													deepestGroup?.group.id === n.id ? 2 : undefined,
												borderRadius:
													deepestGroup?.group.id === n.id
														? "0.5rem"
														: undefined,
											},
										}
									: n,
							);

							// 最も深いグループに付箋を追加
							if (deepestGroup) {
								updatedNodes = updatedNodes.map((n) =>
									n.id === node.id
										? {
												...n,
												data: {
													...n.data,
													parentId: deepestGroup.group.id,
												},
											}
										: n,
								);
							} else if (!foundGroup) {
								// どのグループにも属していない場合、parentIdを削除
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

				// ドラッグ終了時の処理
				if (dragEnd) {
					setIsDragging(false);
					setDraggedNodeId(null);
					// すべてのグループのハイライトを解除し、z-indexを再計算
					updatedNodes = updatedNodes.map((n) => {
						if (n.type === "taskGroup") {
							const depth = getGroupDepth(n.id, updatedNodes);
							return {
								...n,
								style: {
									...n.style,
									borderColor: undefined,
									borderWidth: undefined,
									borderRadius: undefined,
									zIndex: depth,
								},
							};
						}
						return {
							...n,
							style: {
								...n.style,
								borderColor: undefined,
								borderWidth: undefined,
								borderRadius: undefined,
							},
						};
					});
					setTimeout(updateGroupDimensions, 0);
				}

				return updatedNodes;
			});
		},
		[setNodes, updateGroupDimensions, isDragging, getGroupDepth],
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

		// 選択されているグループがあれば、その中に追加
		setNodes((nds) => {
			const selectedGroup = nds.find(
				(n) => n.selected && n.type === "taskGroup",
			);

			if (selectedGroup) {
				// グループ内の適切な位置に配置
				const groupData = selectedGroup.data as TaskGroupData;
				newNode.position = {
					x: selectedGroup.position.x + (groupData.width ?? 300) / 2 - 110,
					y: selectedGroup.position.y + 80, // ヘッダーの下に配置
				};
				newNode.data.parentId = selectedGroup.id;
			}

			return [...nds, newNode];
		});
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

		// 選択されているグループがあれば、その中に追加
		setNodes((nds) => {
			const selectedGroup = nds.find(
				(n) => n.selected && n.type === "taskGroup",
			);

			if (selectedGroup) {
				// グループ内の適切な位置に配置
				const groupData = selectedGroup.data as TaskGroupData;
				newNode.position = {
					x: selectedGroup.position.x + (groupData.width ?? 300) / 2 - 150,
					y: selectedGroup.position.y + 80, // ヘッダーの下に配置
				};
				newNode.data.parentId = selectedGroup.id;
				// 親グループの深さに基づいてz-indexを設定
				const parentDepth = getGroupDepth(selectedGroup.id, nds);
				newNode.style = { zIndex: parentDepth + 1 };
			}

			return [...nds, newNode];
		});
	}, [setNodes, getGroupDepth]);

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
			(node) =>
				node.selected &&
				(node.type === "taskNote" || node.type === "taskGroup"),
		);
		if (selectedNodes.length === 0) return;

		// 選択されたノードの親グループを取得
		const parentId = selectedNodes[0].data.parentId;
		// すべての選択されたノードが同じ親グループに属しているか確認
		const hasSameParent = selectedNodes.every(
			(node) => node.data.parentId === parentId,
		);
		if (!hasSameParent) return; // 異なる親を持つノードは一緒にグループ化できない

		const minX = Math.min(...selectedNodes.map((node) => node.position.x));
		const maxX = Math.max(
			...selectedNodes.map((node) => {
				const width =
					node.type === "taskGroup"
						? ((node.data as TaskGroupData).width ?? 300)
						: 220;
				return node.position.x + width;
			}),
		);
		const minY = Math.min(...selectedNodes.map((node) => node.position.y));
		const maxY = Math.max(
			...selectedNodes.map((node) => {
				const height =
					node.type === "taskGroup"
						? ((node.data as TaskGroupData).height ?? 200)
						: 200;
				return node.position.y + height;
			}),
		);

		const PADDING = 40;
		const HEADER_HEIGHT = 60;
		const width = Math.max(maxX - minX + PADDING * 2, 300);
		const height = Math.max(maxY - minY + HEADER_HEIGHT + PADDING * 2, 200);

		const groupId = uuidv4();
		const groupNode: Node<TaskGroupData> = {
			id: groupId,
			type: "taskGroup",
			position: {
				x: minX - PADDING,
				y: minY - HEADER_HEIGHT - PADDING,
			},
			data: {
				title: "新しいグループ",
				isCollapsed: false,
				width,
				height,
				status: "not_started",
				progress: 0,
				priority: "medium",
				parentId, // 親グループのIDを引き継ぐ
			},
			style: { zIndex: parentId ? getGroupDepth(parentId, nodes) + 1 : 0 },
		};

		setNodes((nds) => [
			...nds.map((node) =>
				node.selected
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
	}, [nodes, setNodes, getGroupDepth]);

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
