import { useCallback, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";
import imageCompression from "browser-image-compression";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { User, Upload, X, Github, RotateCcw } from "lucide-react";
import { Icons } from "@/components/ui/icon";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { createClient } from "@/lib/supabase/client";

interface ImageUploadProps {
	value?: string;
	onChange: (value: string) => void;
	bucket: string;
	onReset?: () => void;
	initialImage?: string;
	maxSizeMB?: number;
	maxWidthOrHeight?: number;
	onUploadComplete?: (url: string, path: string) => void;
	onUploadError?: () => void;
}

export function ImageUpload({
	value,
	onChange,
	bucket,
	onReset,
	initialImage,
	maxSizeMB = 1,
	maxWidthOrHeight = 1920,
	onUploadComplete,
	onUploadError,
}: ImageUploadProps) {
	const supabase = createClient();
	const [isUploading, setIsUploading] = useState(false);
	const [preview, setPreview] = useState<string | undefined>(value);
	const { toast } = useToast();
	const { user } = useAuth();
	const [currentUploadPath, setCurrentUploadPath] = useState<string>();
	const [providerAvatars, setProviderAvatars] = useState<{
		google?: string;
		github?: string;
	}>({});

	useEffect(() => {
		setPreview(value);
	}, [value]);

	// 認証プロバイダーのアバターURLを��得
	useEffect(() => {
		async function fetchProviderAvatars() {
			if (!user) return;

			const identities = await supabase.auth.getUser();
			const userMetadata = identities.data.user?.user_metadata;

			if (userMetadata) {
				const avatars: { google?: string; github?: string } = {};

				// Google アバター
				if (userMetadata.avatar_url && userMetadata.iss?.includes("google")) {
					avatars.google = userMetadata.avatar_url;
				}

				// GitHub アバター
				if (userMetadata.avatar_url && userMetadata.iss?.includes("github")) {
					avatars.github = userMetadata.avatar_url;
				}

				setProviderAvatars(avatars);
			}
		}

		fetchProviderAvatars();
	}, [user, supabase.auth]);

	// コンポーネントのアンマウント時に未保存の画像を削除
	useEffect(() => {
		return () => {
			if (currentUploadPath && !value) {
				supabase.storage
					.from(bucket)
					.remove([currentUploadPath])
					.then(({ error }) => {
						if (error) {
							console.error("未使用画像の削除に失敗:", error);
						}
					});
			}
		};
	}, [bucket, currentUploadPath, value, supabase.storage]);

	const handleProviderAvatarSelect = (avatarUrl: string) => {
		setPreview(avatarUrl);
		onChange(avatarUrl);
	};

	const compressImage = useCallback(
		async (file: File) => {
			const options = {
				maxSizeMB: maxSizeMB,
				maxWidthOrHeight: maxWidthOrHeight,
				useWebWorker: true,
				fileType: file.type as string,
			};

			try {
				const compressedFile = await imageCompression(file, options);
				return compressedFile;
			} catch (error) {
				console.error("画像圧縮エラー:", error);
				throw new Error("画像の圧縮に失敗しました");
			}
		},
		[maxSizeMB, maxWidthOrHeight],
	);

	const uploadImageToSupabase = useCallback(
		async (file: File, bucket: string) => {
			if (!user?.id) {
				throw new Error("ユーザーセッションが見つかりません");
			}

			const fileExt = file.name.split(".").pop();
			const fileName = `${Date.now()}.${fileExt}`;
			const filePath = `${user.id}/${fileName}`;

			try {
				const { error: uploadError, data: uploadData } = await supabase.storage
					.from(bucket)
					.upload(filePath, file, {
						cacheControl: "3600",
						upsert: true,
					});

				if (uploadError) {
					console.error("Supabaseアップロードエラー:", {
						name: uploadError.name,
						message: uploadError.message,
					});
					throw new Error(
						`画像のアップロードに失敗しました: ${uploadError.message}`,
					);
				}

				// 公開URLを取得（署名付きURL）
				const { data: urlData } = await supabase.storage
					.from(bucket)
					.createSignedUrl(filePath, 60 * 60 * 24 * 365); // 1年間有効

				if (!urlData?.signedUrl) {
					throw new Error("署名付きURLの生成に失敗しました");
				}

				setCurrentUploadPath(filePath);

				return { url: urlData.signedUrl, path: filePath };
			} catch (error) {
				console.error("アップロード処理エラー:", error);
				throw error;
			}
		},
		[user, supabase.storage],
	);

	const onDrop = useCallback(
		async (acceptedFiles: File[]) => {
			try {
				const file = acceptedFiles[0];
				setIsUploading(true);

				// 画像を圧縮
				const compressedFile = await compressImage(file);

				// 古い画像を削除
				if (preview) {
					try {
						// 署名付きURLからファイルパスを抽出
						const match = preview.match(
							/\/storage\/v1\/object\/sign\/[^/]+\/([^?]+)/,
						);
						if (match?.[1]) {
							const oldFilePath = decodeURIComponent(match[1]);

							const { error: removeError } = await supabase.storage
								.from(bucket)
								.remove([oldFilePath]);

							if (removeError) {
								console.warn("古い画像の削除エラー:", removeError);
							}
						}
					} catch (error) {
						console.error("古い画像のパス解析エラー:", error);
					}
				}

				// 圧縮した画像をアップロード
				const { url: publicUrl, path } = await uploadImageToSupabase(
					compressedFile,
					bucket,
				);

				// プレビューを更新
				setPreview(publicUrl);
				onChange(publicUrl);
				onUploadComplete?.(publicUrl, path);

				toast({
					title: "画像のアップロードが完了しました",
					description: "プロフィール画像が正常に更新されました。",
				});
			} catch (error) {
				console.error("アップロードプロセスエラー:", {
					error: error,
					message: error instanceof Error ? error.message : "不明なエラー",
					stack: error instanceof Error ? error.stack : undefined,
				});
				onUploadError?.();
				toast({
					variant: "destructive",
					title: "エラーが発生しました",
					description:
						error instanceof Error
							? error.message
							: "画像のアップロードに失敗しました",
				});
			} finally {
				setIsUploading(false);
			}
		},
		[
			bucket,
			onChange,
			preview,
			toast,
			uploadImageToSupabase,
			compressImage,
			onUploadComplete,
			onUploadError,
			supabase.storage,
		],
	);

	const removeImage = useCallback(async () => {
		try {
			if (preview) {
				try {
					// 署名付きURLからファイルパスを抽出
					const match = preview.match(
						/\/storage\/v1\/object\/sign\/[^/]+\/([^?]+)/,
					);
					if (match?.[1]) {
						const filePath = decodeURIComponent(match[1]);

						const { error } = await supabase.storage
							.from(bucket)
							.remove([filePath]);

						if (error) {
							console.error("画像削除エラー:", error);
							throw error;
						}
						setCurrentUploadPath(undefined);
					}
				} catch (error) {
					console.error("画像のパス解析エラー:", error);
					throw error;
				}
			}
			setPreview(undefined);
			onChange("");

			toast({
				title: "画像を削除しました",
				description: "プロフィール画像が正常に削除されました。",
			});
		} catch (error) {
			console.error("削除プロセスエラー:", error);
			toast({
				variant: "destructive",
				title: "エラーが発生しました",
				description: "画像の削除に失敗しました",
			});
		}
	}, [bucket, preview, onChange, toast, supabase.storage]);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": [".png", ".jpg", ".jpeg", ".gif"],
		},
		maxFiles: 1,
		multiple: false,
	});

	return (
		<div className="space-y-4">
			<div
				{...getRootProps()}
				className={cn(
					"flex flex-col items-center justify-center rounded-lg border border-dashed p-6 cursor-pointer",
					isDragActive && "border-primary bg-muted",
					isUploading && "opacity-50 cursor-not-allowed",
				)}
			>
				<input {...getInputProps()} />
				<div className="flex flex-col items-center gap-4">
					<Avatar className="h-24 w-24">
						<AvatarImage src={preview} />
						<AvatarFallback>
							{isUploading ? (
								<Icons.spinner className="h-4 w-4 animate-spin" />
							) : (
								<User className="h-12 w-12" />
							)}
						</AvatarFallback>
					</Avatar>
					<div className="flex items-center gap-2">
						<Upload className="h-4 w-4" />
						<p className="text-sm text-muted-foreground">
							{isDragActive
								? "ここにドロップしてアップロード"
								: "クリックまたはドラッグ＆ドロップで画像をアップロード"}
						</p>
					</div>
					<p className="text-xs text-muted-foreground">
						推奨: {maxWidthOrHeight}px以下, {maxSizeMB}MB以下
					</p>
				</div>
			</div>
			<div className="flex flex-wrap justify-center gap-2">
				{preview && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={removeImage}
						disabled={isUploading}
					>
						<X className="h-4 w-4 mr-2" />
						画像を削除
					</Button>
				)}
				{providerAvatars.google && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							handleProviderAvatarSelect(providerAvatars.google || "")
						}
						disabled={isUploading}
					>
						<Icons.google className="h-4 w-4 mr-2" />
						Googleのアバターを使用
					</Button>
				)}
				{providerAvatars.github && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() =>
							handleProviderAvatarSelect(providerAvatars.github || "")
						}
						disabled={isUploading}
					>
						<Github className="h-4 w-4 mr-2" />
						GitHubのアバターを使用
					</Button>
				)}
				{onReset && initialImage && preview !== initialImage && (
					<Button
						type="button"
						variant="outline"
						size="sm"
						onClick={() => {
							onReset();
							setPreview(initialImage);
						}}
						disabled={isUploading}
					>
						<RotateCcw className="h-4 w-4 mr-2" />
						元の画像に戻す
					</Button>
				)}
			</div>
		</div>
	);
}
