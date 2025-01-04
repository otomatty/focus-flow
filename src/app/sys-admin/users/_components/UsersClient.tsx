"use client";

import { UserPlus } from "lucide-react";
import { useAtom, useAtomValue } from "jotai";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/button";
import { UserFilters } from "./UserFilters";
import { UserTable } from "./UserTable";
import { filteredUsersAtom, usersAtom } from "@/atoms/userFilters";
import type { UserWithDetails } from "@/app/_actions/users/types";

interface UsersClientProps {
	initialUsers: UserWithDetails[];
}

export function UsersClient({ initialUsers }: UsersClientProps) {
	const [, setUsers] = useAtom(usersAtom);
	const filteredUsers = useAtomValue(filteredUsersAtom);
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		setUsers(initialUsers);
		// データの初期化が完了したらローディングを終了
		setIsLoading(false);
	}, [initialUsers, setUsers]);

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<h1 className="text-2xl font-semibold">ユーザー管理</h1>
				<Button className="gap-2">
					<UserPlus className="size-4" />
					新規ユーザー
				</Button>
			</div>
			<UserFilters />
			<UserTable data={filteredUsers} isLoading={isLoading} />
		</div>
	);
}
