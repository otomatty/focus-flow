import { listUsers } from "@/app/_actions/users/list";
import { UsersClient } from "./_components/UsersClient";

export default async function UsersPage() {
	const initialUsers = await listUsers();

	return <UsersClient initialUsers={initialUsers} />;
}
