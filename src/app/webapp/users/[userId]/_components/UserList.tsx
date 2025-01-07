"use client";

import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
	followUser,
	unfollowUser,
	getFollowStatus,
} from "@/app/_actions/social/relationships";

interface UserListProps {
	users: Array<{
		follower_id: string;
		following_id: string;
		status: "pending" | "accepted" | "blocked";
		created_at: string | null;
		id: string;
		updated_at: string | null;
		profile?: {
			display_name: string;
			avatar_url: string | null;
		} | null;
	}>;
	currentUserId: string;
}

function UserListSkeleton() {
	const skeletonIds = ["top", "middle", "bottom"];
	return (
		<div className="space-y-4">
			{skeletonIds.map((id) => (
				<Card key={`skeleton-${id}`} className="p-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center space-x-4">
							<Skeleton className="h-10 w-10 rounded-full" />
							<div className="space-y-2">
								<Skeleton className="h-4 w-[200px]" />
								<Skeleton className="h-4 w-[100px]" />
							</div>
						</div>
						<Skeleton className="h-10 w-[100px]" />
					</div>
				</Card>
			))}
		</div>
	);
}

export function UserList({ users, currentUserId }: UserListProps) {
	const router = useRouter();
	const { toast } = useToast();
	const [isLoading, setIsLoading] = useState(true);
	const [followingStates, setFollowingStates] = useState<
		Record<string, boolean>
	>({});
	const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>(
		{},
	);

	useEffect(() => {
		const initializeFollowStates = async () => {
			setIsLoading(true);
			try {
				const states: Record<string, boolean> = {};
				for (const user of users) {
					const userId =
						user.follower_id === currentUserId
							? user.following_id
							: user.follower_id;
					const status = await getFollowStatus(currentUserId, userId);
					states[userId] = status?.status === "accepted";
				}
				setFollowingStates(states);
			} finally {
				setIsLoading(false);
			}
		};

		initializeFollowStates();
	}, [users, currentUserId]);

	if (isLoading) {
		return <UserListSkeleton />;
	}

	const handleFollow = async (userId: string) => {
		setLoadingStates((prev) => ({ ...prev, [userId]: true }));
		try {
			if (followingStates[userId]) {
				await unfollowUser(currentUserId, userId);
			} else {
				await followUser(currentUserId, userId);
			}
			setFollowingStates((prev) => ({
				...prev,
				[userId]: !prev[userId],
			}));
			toast({
				title: followingStates[userId]
					? "フォロー解除しました"
					: "フォローしました",
				variant: "default",
			});
			router.refresh();
		} catch (error) {
			toast({
				title: "エラーが発生しました",
				description: "もう一度お試しください",
				variant: "destructive",
			});
		} finally {
			setLoadingStates((prev) => ({ ...prev, [userId]: false }));
		}
	};

	if (users.length === 0) {
		return (
			<Card className="p-6">
				<p className="text-center text-muted-foreground">
					ユーザーが見つかりません
				</p>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			{users.map((user) => {
				const userId =
					user.follower_id === currentUserId
						? user.following_id
						: user.follower_id;
				return (
					<Card key={userId} className="p-4">
						<div className="flex items-center justify-between">
							<button
								type="button"
								onClick={() => router.push(`/webapp/users/${userId}`)}
								className="flex items-center space-x-4 hover:opacity-80"
							>
								<Avatar>
									<AvatarImage src={user.profile?.avatar_url || undefined} />
									<AvatarFallback>
										{user.profile?.display_name?.[0]?.toUpperCase() || "?"}
									</AvatarFallback>
								</Avatar>
								<div className="flex flex-col items-start">
									<span className="font-semibold">
										{user.profile?.display_name || "ユーザー"}
									</span>
									<span className="text-sm text-muted-foreground">
										{user.created_at
											? `${new Date(user.created_at).toLocaleDateString()}から`
											: ""}
									</span>
								</div>
							</button>
							{userId !== currentUserId && (
								<Button
									variant={followingStates[userId] ? "outline" : "default"}
									onClick={() => handleFollow(userId)}
									disabled={loadingStates[userId]}
								>
									{followingStates[userId] ? "フォロー中" : "フォローする"}
								</Button>
							)}
						</div>
					</Card>
				);
			})}
		</div>
	);
}
