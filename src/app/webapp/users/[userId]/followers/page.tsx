import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getUserProfile } from "@/app/_actions/users/user-profile";
import { getFollowers } from "@/app/_actions/social/relationships";
import { UserList } from "../_components/UserList";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 10;

export async function generateMetadata({
	params,
}: {
	params: { userId: string };
}): Promise<Metadata> {
	const profile = await getUserProfile(params.userId);
	return {
		title: `${profile?.displayName || "ユーザー"}のフォロワー - Focus Flow`,
		description: `${profile?.displayName || "ユーザー"}のフォロワー一覧`,
	};
}

export default async function FollowersPage({
	params,
	searchParams,
}: {
	params: { userId: string };
	searchParams: { page?: string };
}) {
	const supabase = await createClient();
	const {
		data: { user },
	} = await supabase.auth.getUser();

	if (!user) {
		throw new Error("User not authenticated");
	}

	const currentPage = Number(searchParams.page) || 1;
	const offset = (currentPage - 1) * ITEMS_PER_PAGE;

	// 並列でデータを取得
	const [profile, followers] = await Promise.all([
		getUserProfile(params.userId),
		getFollowers(params.userId, {
			status: "accepted",
			limit: ITEMS_PER_PAGE,
			offset,
		}),
	]);

	if (!profile) {
		throw new Error("User not found");
	}

	const hasMore = followers.length === ITEMS_PER_PAGE;

	return (
		<div className="container mx-auto p-6">
			<div className="flex items-center justify-between mb-6">
				<h1 className="text-2xl font-bold">
					{profile.displayName}のフォロワー
				</h1>
			</div>
			<UserList users={followers} currentUserId={user.id} />
			<div className="flex justify-center gap-4 mt-6">
				{currentPage > 1 && (
					<Button
						variant="outline"
						onClick={() => {
							const url = new URL(window.location.href);
							url.searchParams.set("page", String(currentPage - 1));
							window.location.href = url.toString();
						}}
					>
						前のページ
					</Button>
				)}
				{hasMore && (
					<Button
						variant="outline"
						onClick={() => {
							const url = new URL(window.location.href);
							url.searchParams.set("page", String(currentPage + 1));
							window.location.href = url.toString();
						}}
					>
						次のページ
					</Button>
				)}
			</div>
		</div>
	);
}
