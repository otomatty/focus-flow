"use client";

import { useAtom } from "jotai";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";

import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { userFiltersAtom } from "@/atoms/userFilters";
import type { UserRole } from "@/app/_actions/users/types";
import { listRoles } from "@/app/_actions/users/roles";

export function UserFilters() {
	const [filters, setFilters] = useAtom(userFiltersAtom);
	const [roles, setRoles] = useState<UserRole[]>([]);

	useEffect(() => {
		const fetchRoles = async () => {
			try {
				const rolesList = await listRoles();
				setRoles(rolesList);
			} catch (error) {
				console.error("ロールの取得に失敗しました:", error);
			}
		};

		fetchRoles();
	}, []);

	return (
		<div className="flex flex-col gap-4 sm:flex-row sm:items-center">
			<div className="relative flex-1">
				<Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
				<Input
					placeholder="ユーザーを検索..."
					value={filters.search}
					onChange={(e) => setFilters({ ...filters, search: e.target.value })}
					className="pl-8"
				/>
			</div>
			<Select
				value={filters.role}
				onValueChange={(value) =>
					setFilters({ ...filters, role: value === "all" ? "" : value })
				}
			>
				<SelectTrigger className="w-full sm:w-[180px]">
					<SelectValue placeholder="ロールで絞り込み" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">すべてのロール</SelectItem>
					{roles.map((role) => (
						<SelectItem key={role.id} value={role.id}>
							{role.name}
						</SelectItem>
					))}
				</SelectContent>
			</Select>
			<Select
				value={filters.status}
				onValueChange={(value) =>
					setFilters({
						...filters,
						status: value === "all" ? "" : (value as "active" | "inactive"),
					})
				}
			>
				<SelectTrigger className="w-full sm:w-[180px]">
					<SelectValue placeholder="ステータスで絞り込み" />
				</SelectTrigger>
				<SelectContent>
					<SelectItem value="all">すべてのステータス</SelectItem>
					<SelectItem value="active">有効</SelectItem>
					<SelectItem value="inactive">無効</SelectItem>
				</SelectContent>
			</Select>
		</div>
	);
}
