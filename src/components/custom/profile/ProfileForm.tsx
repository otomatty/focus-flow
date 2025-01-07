"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { updateUserProfile } from "@/app/_actions/users/user-profile";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
	FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/custom/profile/ImageUpload";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile } from "@/types/users/profiles";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { LANGUAGES, TIMEZONES } from "@/lib/constants";
import { Loader2, Save } from "lucide-react";
import { useBeforeUnload } from "@/hooks/use-before-unload";

const profileFormSchema = z.object({
	displayName: z.string().min(1, "表示名は必須です"),
	email: z.string().email("有効なメールアドレスを入力してください"),
	profileImage: z.string().optional(),
	bio: z
		.string()
		.max(500, "自己紹介は500文字以内で入力してください")
		.optional(),
	title: z
		.string()
		.max(100, "肩書きは100文字以内で入力してください")
		.optional(),
	location: z
		.string()
		.max(100, "所在地は100文字以内で入力してください")
		.optional(),
	website: z
		.string()
		.url("有効なURLを入力してください")
		.optional()
		.or(z.literal("")),
	socialLinks: z
		.object({
			github: z
				.string()
				.url("有効なURLを入力してください")
				.optional()
				.or(z.literal("")),
			twitter: z
				.string()
				.url("有効なURLを入力してください")
				.optional()
				.or(z.literal("")),
			linkedin: z
				.string()
				.url("有効なURLを入力してください")
				.optional()
				.or(z.literal("")),
			facebook: z
				.string()
				.url("有効なURLを入力してください")
				.optional()
				.or(z.literal("")),
			instagram: z
				.string()
				.url("有効なURLを入力してください")
				.optional()
				.or(z.literal("")),
		})
		.optional(),
	languages: z.string().optional(),
	timezone: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

interface ProfileFormProps {
	initialProfile: UserProfile | null;
}

export function ProfileForm({ initialProfile }: ProfileFormProps) {
	const { user } = useAuth();
	const router = useRouter();
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const [initialImage, setInitialImage] = useState<string>();
	const [pendingImagePath, setPendingImagePath] = useState<string>();
	const supabase = createClient();

	const form = useForm<ProfileFormValues>({
		resolver: zodResolver(profileFormSchema),
		defaultValues: {
			displayName: initialProfile?.displayName || "",
			email: initialProfile?.email || "",
			profileImage: initialProfile?.profileImage || "",
			bio: initialProfile?.bio || "",
			title: initialProfile?.title || "",
			location: initialProfile?.location || "",
			website: initialProfile?.website || "",
			socialLinks: {
				github: initialProfile?.socialLinks?.github || "",
				twitter: initialProfile?.socialLinks?.twitter || "",
				linkedin: initialProfile?.socialLinks?.linkedin || "",
				facebook: initialProfile?.socialLinks?.facebook || "",
				instagram: initialProfile?.socialLinks?.instagram || "",
			},
			languages: Array.isArray(initialProfile?.languages)
				? initialProfile.languages[0]
				: "",
			timezone: initialProfile?.timezone || "Asia/Tokyo",
		},
	});

	// フォームの変更状態を監視
	const isDirty = form.formState.isDirty;

	useEffect(() => {
		if (isDirty) {
			const handleBeforeUnload = (e: BeforeUnloadEvent) => {
				e.preventDefault();
				return "変更内容が保存されていません。このページを離れますか？";
			};
			window.addEventListener("beforeunload", handleBeforeUnload);
			return () =>
				window.removeEventListener("beforeunload", handleBeforeUnload);
		}
	}, [isDirty]);

	// ページ離脱時の警告
	useBeforeUnload(
		useCallback(
			(e: BeforeUnloadEvent) => {
				if (isDirty) {
					e.preventDefault();
					return "変更内容が保存されていません。このページを離れますか？";
				}
			},
			[isDirty],
		),
	);

	// Next.jsのルーティングをインターセプト
	const handleNavigation = useCallback(
		(path: string) => {
			if (
				isDirty &&
				!window.confirm(
					"変更内容が保存されていません。このページを離れますか？",
				)
			) {
				return;
			}
			router.push(path);
		},
		[isDirty, router],
	);

	const handleImageUploadComplete = (url: string, path: string) => {
		setPendingImagePath(path);
		form.setValue("profileImage", url);
	};

	const handleImageUploadError = () => {
		setPendingImagePath(undefined);
	};

	async function onSubmit(data: ProfileFormValues) {
		if (!user?.id) return;

		setIsLoading(true);
		try {
			await updateUserProfile(user.id, {
				displayName: data.displayName,
				email: data.email,
				profileImage: data.profileImage,
				bio: data.bio,
				title: data.title,
				location: data.location,
				website: data.website,
				socialLinks: data.socialLinks
					? {
							github: data.socialLinks.github || null,
							twitter: data.socialLinks.twitter || null,
							linkedin: data.socialLinks.linkedin || null,
							facebook: data.socialLinks.facebook || null,
							instagram: data.socialLinks.instagram || null,
						}
					: undefined,
				languages: data.languages ? [data.languages] : null,
				timezone: data.timezone,
			});

			// フォームの状態をリセット
			form.reset(data);

			// プロフィール更新が成功したら、pendingImagePathをクリア
			setPendingImagePath(undefined);

			toast({
				title: "プロフィールを更新しました",
				description: "変更内容が正常に保存されました。",
				variant: "default",
				duration: 3000,
				action: (
					<Button
						variant="outline"
						size="sm"
						onClick={() => handleNavigation("/webapp")}
					>
						ホームへ戻る
					</Button>
				),
			});

			router.refresh();
		} catch (error) {
			console.error("プロフィール更新エラー:", {
				error,
				message: error instanceof Error ? error.message : "不明なエラー",
				stack: error instanceof Error ? error.stack : undefined,
			});

			// プロフィール更新が失敗した場合、アップロードした画像を削除
			if (pendingImagePath) {
				await supabase.storage
					.from("profile-images")
					.remove([pendingImagePath]);
				setPendingImagePath(undefined);
			}

			toast({
				title: "プロフィールの更新に失敗しました",
				description:
					error instanceof Error
						? error.message
						: "エラーが発生しました。もう一度お試しください。",
				variant: "destructive",
				duration: 5000,
			});
		} finally {
			setIsLoading(false);
		}
	}

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
				<div className="space-y-6">
					<div className="relative p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm dark:bg-card/20">
						<div className="absolute -top-3 left-4 bg-background px-2 text-sm font-semibold text-primary dark:bg-background/80">
							基本情報
						</div>
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="profileImage"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-lg font-bold text-primary">
											アバター
										</FormLabel>
										<FormControl>
											<ImageUpload
												value={field.value}
												onChange={field.onChange}
												onUploadComplete={handleImageUploadComplete}
												onUploadError={handleImageUploadError}
												bucket="profile-images"
												className="transition-transform hover:scale-[1.02]"
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
										<FormLabel className="text-primary">表示名</FormLabel>
										<FormControl>
											<Input
												placeholder="表示名"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="email"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">
											メールアドレス
										</FormLabel>
										<FormControl>
											<Input
												type="email"
												placeholder="メールアドレス"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="relative p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm dark:bg-card/20">
						<div className="absolute -top-3 left-4 bg-background px-2 text-sm font-semibold text-primary dark:bg-background/80">
							詳細情報
						</div>
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="bio"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">自己紹介</FormLabel>
										<FormControl>
											<Textarea
												placeholder="自己紹介を入力してください"
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50 resize-none min-h-[120px]"
												{...field}
											/>
										</FormControl>
										<FormDescription>
											500文字以内で入力してください
										</FormDescription>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="title"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">肩書き・役職</FormLabel>
										<FormControl>
											<Input
												placeholder="例: ソフトウェアエンジニア"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
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
										<FormLabel className="text-primary">所在地</FormLabel>
										<FormControl>
											<Input
												placeholder="例: 東京都渋谷区"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="relative p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm dark:bg-card/20">
						<div className="absolute -top-3 left-4 bg-background px-2 text-sm font-semibold text-primary dark:bg-background/80">
							ソーシャルリンク
						</div>
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="socialLinks.github"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">GitHub</FormLabel>
										<FormControl>
											<Input
												placeholder="https://github.com/username"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
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
										<FormLabel className="text-primary">Twitter</FormLabel>
										<FormControl>
											<Input
												placeholder="https://twitter.com/username"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
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
										<FormLabel className="text-primary">LinkedIn</FormLabel>
										<FormControl>
											<Input
												placeholder="https://linkedin.com/in/username"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="socialLinks.facebook"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">Facebook</FormLabel>
										<FormControl>
											<Input
												placeholder="https://facebook.com/username"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								control={form.control}
								name="socialLinks.instagram"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">Instagram</FormLabel>
										<FormControl>
											<Input
												placeholder="https://instagram.com/username"
												{...field}
												className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50"
											/>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>

					<div className="relative p-6 rounded-lg bg-card/50 border border-border/50 backdrop-blur-sm dark:bg-card/20">
						<div className="absolute -top-3 left-4 bg-background px-2 text-sm font-semibold text-primary dark:bg-background/80">
							設定
						</div>
						<div className="space-y-6">
							<FormField
								control={form.control}
								name="languages"
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-primary">使用言語</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50">
													<SelectValue placeholder="使用言語を選択" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{LANGUAGES.map((language) => (
													<SelectItem
														key={language.value}
														value={language.value}
													>
														{language.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormDescription>
											主に使用する言語を選択してください
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
										<FormLabel className="text-primary">タイムゾーン</FormLabel>
										<Select
											onValueChange={field.onChange}
											defaultValue={field.value}
										>
											<FormControl>
												<SelectTrigger className="bg-background/50 dark:bg-background/20 border-border/50 focus:border-primary/50">
													<SelectValue placeholder="タイムゾーンを選択" />
												</SelectTrigger>
											</FormControl>
											<SelectContent>
												{TIMEZONES.map((timezone) => (
													<SelectItem
														key={timezone.value}
														value={timezone.value}
													>
														{timezone.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
										<FormMessage />
									</FormItem>
								)}
							/>
						</div>
					</div>
				</div>

				<Button
					type="submit"
					disabled={isLoading}
					className="w-full bg-primary hover:bg-primary/90 text-primary-foreground transition-all hover:scale-[1.02] active:scale-[0.98] dark:bg-primary/80 dark:hover:bg-primary/70"
				>
					{isLoading ? (
						<>
							<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							更新中...
						</>
					) : (
						<>
							<Save className="mr-2 h-4 w-4" />
							プロフィールを更新
						</>
					)}
				</Button>
			</form>
		</Form>
	);
}
