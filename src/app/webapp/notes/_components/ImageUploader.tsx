"use client";

import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Image, Upload } from "lucide-react";
import { uploadFile } from "@/app/_actions/storage/service";
import { useToast } from "@/hooks/use-toast";
import { nanoid } from "nanoid";

interface ImageUploaderProps {
	onUpload: (imageUrl: string) => void;
}

export function ImageUploader({ onUpload }: ImageUploaderProps) {
	const [isUploading, setIsUploading] = useState(false);
	const { toast } = useToast();

	const handleUpload = useCallback(
		async (file: File) => {
			try {
				setIsUploading(true);
				const path = `${nanoid()}-${file.name}`;
				const result = await uploadFile(file, path);
				onUpload(result.url);
				toast({
					title: "画像アップロード",
					description: "画像をアップロードしました",
				});
			} catch (error) {
				console.error("Error uploading image:", error);
				toast({
					title: "エラー",
					description:
						error instanceof Error
							? error.message
							: "画像のアップロードに失敗しました",
					variant: "destructive",
				});
			} finally {
				setIsUploading(false);
			}
		},
		[onUpload, toast],
	);

	return (
		<Button
			variant="outline"
			size="icon"
			disabled={isUploading}
			onClick={() => {
				const input = document.createElement("input");
				input.type = "file";
				input.accept = "image/*";
				input.onchange = (e) => {
					const file = (e.target as HTMLInputElement).files?.[0];
					if (file) {
						handleUpload(file);
					}
				};
				input.click();
			}}
		>
			{isUploading ? (
				<Upload className="h-4 w-4 animate-spin" />
			) : (
				<Image className="h-4 w-4" />
			)}
		</Button>
	);
}
