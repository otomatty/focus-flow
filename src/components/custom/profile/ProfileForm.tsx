"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
	Form,
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateUserProfile } from "@/app/_actions/users/user-profile";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "./ImageUpload";

const profileSchema = z.object({
	displayName: z.string().min(2).max(50).nullable(),
	profileImage: z.string().nullable(),
	bio: z.string().max(500).nullable(),
	title: z.string().max(100).nullable(),
	location: z.string().max(100).nullable(),
	website: z.string().url().nullable().or(z.literal("")),
	socialLinks: z.object({
		github: z.string().nullable(),
		twitter: z.string().nullable(),
		linkedin: z.string().nullable(),
		facebook: z.string().nullable(),
		instagram: z.string().nullable(),
	}),
	languages: z.string().max(100).nullable(),
	timezone: z.string().nullable(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface ProfileFormProps {
	initialProfile: Partial<ProfileFormValues>;
	userId: string;
}

export function ProfileForm({ initialProfile, userId }: ProfileFormProps) {
	const { toast } = useToast();
	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileSchema),
		defaultValues: {
			displayName: initialProfile.displayName || null,
			profileImage: initialProfile.profileImage || null,
			bio: initialProfile.bio || null,
			title: initialProfile.title || null,
			location: initialProfile.location || null,
			website: initialProfile.website || null,
			socialLinks: {
				github: initialProfile.socialLinks?.github || null,
				twitter: initialProfile.socialLinks?.twitter || null,
				linkedin: initialProfile.socialLinks?.linkedin || null,
				facebook: initialProfile.socialLinks?.facebook || null,
				instagram: initialProfile.socialLinks?.instagram || null,
			},
			languages: initialProfile.languages || null,
			timezone: initialProfile.timezone || null,
		},
	});

	console.log("Initial Profile:", initialProfile); // デバッグ用

	async function onSubmit(data: ProfileFormValues) {
		try {
			await updateUserProfile(userId, data);
			toast({
				title: "プロフィールを更新しました",
				description: "変更が正常に保存されました。",
			});
		} catch (error) {
			console.error("Profile update error:", error); // デバッグ用
			toast({
				title: "エラーが発生しました",
				description: "プロフィールの更新に失敗しました。",
				variant: "destructive",
			});
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-6">
					<FormField
						control={form.control}
						name="profileImage"
						render={({ field }) => (
							<FormItem>
								<FormLabel>プロフィール画像</FormLabel>
								<FormControl>
									<ImageUpload
										value={field.value || undefined}
										onChange={field.onChange}
										bucket="avatars"
										className="max-w-md mx-auto"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="displayName"
						render={({ field }) => (
							<FormItem>
								<FormLabel>表示名</FormLabel>
								<FormControl>
									<Input
										placeholder="表示名"
										{...field}
										value={field.value || ""}
									/>
								</FormControl>
								<FormDescription>
									他のユーザーに表示される名前です。
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Tabs defaultValue="basic" className="w-full">
					<TabsList className="grid w-full grid-cols-3">
						<TabsTrigger value="basic">基本情報</TabsTrigger>
						<TabsTrigger value="social">ソーシャル</TabsTrigger>
						<TabsTrigger value="preferences">設定</TabsTrigger>
					</TabsList>

					<TabsContent value="basic" className="space-y-4 mt-4">
						<FormField
							control={form.control}
							name="title"
							render={({ field }) => (
								<FormItem>
									<FormLabel>肩書き・役職</FormLabel>
									<FormControl>
										<Input
											placeholder="例: ソフトウェアエンジニア"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="bio"
							render={({ field }) => (
								<FormItem>
									<FormLabel>自己紹介</FormLabel>
									<FormControl>
										<Textarea
											placeholder="自己紹介を入力してください"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="location"
							render={({ field }) => (
								<FormItem>
									<FormLabel>場所</FormLabel>
									<FormControl>
										<Input
											placeholder="例: 東京都"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>

					<TabsContent value="social" className="space-y-4 mt-4">
						<FormField
							control={form.control}
							name="website"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Webサイト</FormLabel>
									<FormControl>
										<Input
											placeholder="https://example.com"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="socialLinks.github"
							render={({ field }) => (
								<FormItem>
									<FormLabel>GitHub</FormLabel>
									<FormControl>
										<Input
											placeholder="GitHubユーザー名"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="socialLinks.twitter"
							render={({ field }) => (
								<FormItem>
									<FormLabel>Twitter</FormLabel>
									<FormControl>
										<Input
											placeholder="Twitterユーザー名"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="socialLinks.linkedin"
							render={({ field }) => (
								<FormItem>
									<FormLabel>LinkedIn</FormLabel>
									<FormControl>
										<Input
											placeholder="LinkedInプロフィールURL"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>

					<TabsContent value="preferences" className="space-y-4 mt-4">
						<FormField
							control={form.control}
							name="languages"
							render={({ field }) => (
								<FormItem>
									<FormLabel>使用言語</FormLabel>
									<FormControl>
										<Input
											placeholder="例: 日本語"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormDescription>
										主に使用する言語を入力してください。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={form.control}
							name="timezone"
							render={({ field }) => (
								<FormItem>
									<FormLabel>タイムゾーン</FormLabel>
									<FormControl>
										<Input
											placeholder="例: Asia/Tokyo"
											{...field}
											value={field.value || ""}
										/>
									</FormControl>
									<FormDescription>
										あなたのタイムゾーンを入力してください。
									</FormDescription>
									<FormMessage />
								</FormItem>
							)}
						/>
					</TabsContent>
				</Tabs>

				<Button type="submit" className="w-full">
					保存
				</Button>
			</form>
		</Form>
	);
}
