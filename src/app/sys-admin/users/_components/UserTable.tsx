"use client";

import {
	type ColumnDef,
	type ColumnFiltersState,
	type SortingState,
	type VisibilityState,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
} from "@tanstack/react-table";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";
import * as React from "react";
import { useState, useEffect } from "react";
import { useSetAtom } from "jotai";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { UserWithDetails, Role } from "@/types/users";
import { UserRoleDialog } from "./UserRoleDialog";
import { userRoleDialogAtom } from "@/atoms/userRoleDialog";
import { UserTableSkeleton } from "./UserTableSkeleton";
import { getNextLevelExp } from "@/app/_actions/gamification/level";

interface UserTableProps {
	data: UserWithDetails[];
	isLoading?: boolean;
}

export function UserTable({ data, isLoading = false }: UserTableProps) {
	const setDialogState = useSetAtom(userRoleDialogAtom);
	const [sorting, setSorting] = React.useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
		[],
	);
	const [columnVisibility, setColumnVisibility] =
		React.useState<VisibilityState>({});
	const [rowSelection, setRowSelection] = React.useState({});
	const [nextLevelExp, setNextLevelExp] = useState<Record<number, number>>({});

	const handleRoleChange = (user: UserWithDetails) => {
		setDialogState({ isOpen: true, user });
	};

	// マウント時に必要な経験値データを一括取得
	useEffect(() => {
		const fetchAllNextLevelExp = async () => {
			const levels = new Set(
				data
					.map((user) => user.level?.level)
					.filter((level): level is number => level !== undefined),
			);
			try {
				const promises = Array.from(levels).map(async (level) => {
					const exp = await getNextLevelExp(level);
					return { level, exp };
				});
				const results = await Promise.all(promises);
				const expMap = results.reduce(
					(acc, { level, exp }) => Object.assign(acc, { [level]: exp }),
					{} as Record<number, number>,
				);
				setNextLevelExp(expMap);
			} catch (error) {
				console.error("経験値データの取得に失敗:", error);
			}
		};

		fetchAllNextLevelExp();
	}, [data]);

	const columns: ColumnDef<UserWithDetails>[] = [
		{
			id: "display_name",
			accessorFn: (row) => row.profile.display_name,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						名前
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
		},
		{
			id: "email",
			accessorFn: (row) => row.profile.email,
			header: "メールアドレス",
		},
		{
			id: "roles",
			accessorKey: "roles",
			header: "ロール",
			cell: ({ row }) => {
				const roles = row.getValue("roles") as UserWithDetails["roles"];
				return (
					<div className="flex gap-1">
						{roles.map((role: Role) => (
							<Badge key={role.id} variant="secondary">
								{role.name}
							</Badge>
						))}
					</div>
				);
			},
		},
		{
			id: "status",
			accessorFn: (row) => row.account_status.status,
			header: "ステータス",
			cell: ({ row }) => {
				const status = row.getValue("status") as string;
				return (
					<Badge variant={status === "active" ? "success" : "destructive"}>
						{status === "active" ? "有効" : "無効"}
					</Badge>
				);
			},
		},
		{
			id: "level",
			accessorFn: (row) => row.level?.level,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						レベル
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const level = row.getValue("level") as number | undefined;
				return level ? (
					<Badge variant="outline">Lv.{level}</Badge>
				) : (
					<span className="text-sm text-muted-foreground">未設定</span>
				);
			},
		},
		{
			id: "exp",
			accessorFn: (row) => row.level?.exp,
			header: ({ column }) => {
				return (
					<Button
						variant="ghost"
						onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
					>
						経験値
						<ArrowUpDown className="ml-2 h-4 w-4" />
					</Button>
				);
			},
			cell: ({ row }) => {
				const exp = row.getValue("exp") as number | undefined;
				const level = row.original.level?.level;

				if (!exp || !level) {
					return <span className="text-sm text-muted-foreground">未設定</span>;
				}

				const nextExp = nextLevelExp[level] || 0;
				const progress = nextExp > 0 ? (exp / nextExp) * 100 : 0;

				return (
					<TooltipProvider>
						<Tooltip>
							<TooltipTrigger asChild>
								<div className="flex flex-col gap-1.5">
									<div className="flex items-center justify-between text-sm">
										<span>{exp.toLocaleString()} / </span>
										<span className="text-muted-foreground">
											{nextExp.toLocaleString()}
										</span>
									</div>
									<Progress value={progress} className="h-2" />
								</div>
							</TooltipTrigger>
							<TooltipContent>
								<div className="space-y-1">
									<p>次のレベルまで: {(nextExp - exp).toLocaleString()} EXP</p>
									<p className="text-muted-foreground">
										進捗: {progress.toFixed(1)}%
									</p>
								</div>
							</TooltipContent>
						</Tooltip>
					</TooltipProvider>
				);
			},
		},
		{
			id: "last_activity",
			accessorFn: (row) => row.profile.last_activity_at,
			header: "最終アクティビティ",
			cell: ({ row }) => {
				const date = row.getValue("last_activity") as string;
				if (!date) return "未ログイン";
				return new Date(date).toLocaleString("ja-JP");
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const user = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">メニューを開く</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => handleRoleChange(user)}>
								ロールを変更
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => console.log("編集", user)}>
								編集
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => console.log("詳細", user)}>
								詳細
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => console.log("ステータス変更", user)}
								className="text-destructive"
							>
								{user.account_status.status === "active" ? "無効化" : "有効化"}
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];

	const table = useReactTable({
		data,
		columns,
		onSortingChange: setSorting,
		onColumnFiltersChange: setColumnFilters,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onColumnVisibilityChange: setColumnVisibility,
		onRowSelectionChange: setRowSelection,
		state: {
			sorting,
			columnFilters,
			columnVisibility,
			rowSelection,
		},
	});

	if (isLoading) {
		return <UserTableSkeleton />;
	}

	return (
		<>
			<div className="w-full">
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							{table.getHeaderGroups().map((headerGroup) => (
								<TableRow key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										return (
											<TableHead key={header.id}>
												{header.isPlaceholder
													? null
													: flexRender(
															header.column.columnDef.header,
															header.getContext(),
														)}
											</TableHead>
										);
									})}
								</TableRow>
							))}
						</TableHeader>
						<TableBody>
							{table.getRowModel().rows?.length ? (
								table.getRowModel().rows.map((row) => (
									<TableRow
										key={row.id}
										data-state={row.getIsSelected() && "selected"}
									>
										{row.getVisibleCells().map((cell) => (
											<TableCell key={cell.id}>
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext(),
												)}
											</TableCell>
										))}
									</TableRow>
								))
							) : (
								<TableRow>
									<TableCell
										colSpan={columns.length}
										className="h-24 text-center"
									>
										データがありません
									</TableCell>
								</TableRow>
							)}
						</TableBody>
					</Table>
				</div>
				<div className="flex items-center justify-end space-x-2 py-4">
					<div className="space-x-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.previousPage()}
							disabled={!table.getCanPreviousPage()}
						>
							前へ
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => table.nextPage()}
							disabled={!table.getCanNextPage()}
						>
							次へ
						</Button>
					</div>
				</div>
			</div>

			<UserRoleDialog />
		</>
	);
}
