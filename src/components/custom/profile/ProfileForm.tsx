"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import {
	getUserProfile,
	updateUserProfile,
} from "@/app/_actions/users/user-profile";
import { Button } from "@/components/ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { ImageUpload } from "@/components/custom/profile/ImageUpload";
import { createClient } from "@/lib/supabase/client";

const profileFormSchema = z.object({
	displayName: z.string().min(1, "表示名は必須です"),
	email: z.string().email("有効なメールアドレスを入力してください"),
	profileImage: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export function ProfileForm() {
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
			displayName: "",
			email: "",
			profileImage: "",
		},
	});

	useEffect(() => {
		async function loadProfile() {
			if (!user?.id) return;

			try {
				const profile = await getUserProfile(user.id);
				if (profile) {
					setInitialImage(profile.profileImage || "");
					form.reset({
						displayName: profile.displayName || "",
						email: profile.email || "",
						profileImage: profile.profileImage || "",
					});
				}
			} catch (error) {
				toast({
					title: "プロフィールの読み込みに失敗しました",
					variant: "destructive",
				});
			}
		}

		loadProfile();
	}, [user, form, toast]);

	const handleImageUploadComplete = (url: string, path: string) => {
		setPendingImagePath(path);
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
			});

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
						onClick={() => router.push("/webapp")}
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
				<FormField
					control={form.control}
					name="profileImage"
					render={({ field }) => (
						<FormItem>
							<FormLabel>プロフィール画像</FormLabel>
							<FormControl>
								<ImageUpload
									value={field.value}
									onChange={field.onChange}
									bucket="profile-images"
									onReset={() => {
										if (initialImage) {
											field.onChange(initialImage);
										}
									}}
									initialImage={initialImage}
									onUploadComplete={handleImageUploadComplete}
									onUploadError={handleImageUploadError}
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
								<Input placeholder="表示名" {...field} />
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
							<FormLabel>メールアドレス</FormLabel>
							<FormControl>
								<Input
									type="email"
									placeholder="email@example.com"
									{...field}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" disabled={isLoading}>
					{isLoading ? "更新中..." : "プロフィールを更新"}
				</Button>
			</form>
		</Form>
	);
}
