import type { Metadata } from "next";
import { listUsers } from "./_actions";
import { UsersClient } from "./_components/UsersClient";

export const metadata: Metadata = {
	title: "ユーザー管理",
	description: "システム管理者用のユーザー管理画面です。",
};

export default async function UsersPage() {
	const initialUsers = await listUsers();

	return (
		<div className="container mx-auto py-6 space-y-6">
			<div className="flex justify-between items-center">
				<h1 className="text-3xl font-bold tracking-tight">ユーザー管理</h1>
			</div>
			<UsersClient initialUsers={initialUsers} />
		</div>
	);
}
