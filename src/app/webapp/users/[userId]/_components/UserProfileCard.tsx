"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import type { UserProfile } from "@/types/users/profiles";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Globe, Github, Twitter, Linkedin } from "lucide-react";
import { followUser, unfollowUser } from "@/app/_actions/social/relationships";
import { useAuth } from "@/hooks/useAuth";

interface UserProfileCardProps {
	profile: UserProfile;
	isFollowing: boolean;
	followersCount: number;
	followingCount: number;
}

export function UserProfileCard({
	profile,
	isFollowing,
	followersCount,
	followingCount,
}: UserProfileCardProps) {
	const router = useRouter();
	const [following, setFollowing] = useState(isFollowing);
	const [loading, setLoading] = useState(false);
	const { toast } = useToast();
	const { user } = useAuth();

	const handleFollow = async () => {
		if (!user?.id) return;

		setLoading(true);
		try {
			if (following) {
				await unfollowUser(user.id, profile.userId);
			} else {
				await followUser(user.id, profile.userId);
			}
			setFollowing(!following);
			toast({
				title: following ? "フォロー解除しました" : "フォローしました",
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
			setLoading(false);
		}
	};

	return (
		<Card>
			<CardHeader className="pb-2">
				<div className="flex items-start justify-between">
					<div className="flex items-center space-x-4">
						<Avatar className="w-20 h-20">
							<AvatarImage src={profile.profileImage || undefined} />
							<AvatarFallback>
								{profile.displayName?.slice(0, 2) || "??"}
							</AvatarFallback>
						</Avatar>
						<div>
							<h2 className="text-2xl font-bold">{profile.displayName}</h2>
							<div className="flex items-center space-x-4 mt-1 text-sm text-muted-foreground">
								<button
									type="button"
									onClick={() =>
										router.push(`/webapp/users/${profile.userId}/followers`)
									}
									className="hover:underline"
								>
									<span className="font-semibold text-foreground">
										{followersCount}
									</span>{" "}
									フォロワー
								</button>
								<button
									type="button"
									onClick={() =>
										router.push(`/webapp/users/${profile.userId}/following`)
									}
									className="hover:underline"
								>
									<span className="font-semibold text-foreground">
										{followingCount}
									</span>{" "}
									フォロー中
								</button>
							</div>
						</div>
					</div>
					<Button
						variant={following ? "outline" : "default"}
						onClick={handleFollow}
						disabled={loading}
					>
						{following ? "フォロー中" : "フォローする"}
					</Button>
				</div>
			</CardHeader>
			<CardContent>
				{profile.bio && (
					<p className="text-sm text-muted-foreground mt-4">{profile.bio}</p>
				)}
				{/* ソーシャルリンク */}
				<div className="flex items-center space-x-4 mt-4">
					{profile.website && (
						<a
							href={profile.website}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground"
						>
							<Globe className="w-5 h-5" />
						</a>
					)}
					{profile.socialLinks?.github && (
						<a
							href={profile.socialLinks.github}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground"
						>
							<Github className="w-5 h-5" />
						</a>
					)}
					{profile.socialLinks?.twitter && (
						<a
							href={profile.socialLinks.twitter}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground"
						>
							<Twitter className="w-5 h-5" />
						</a>
					)}
					{profile.socialLinks?.linkedin && (
						<a
							href={profile.socialLinks.linkedin}
							target="_blank"
							rel="noopener noreferrer"
							className="text-muted-foreground hover:text-foreground"
						>
							<Linkedin className="w-5 h-5" />
						</a>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
