import { createClient } from "@/lib/supabase/server";
import type { StorageFile, StorageUsage } from "@/types/storage";

export async function uploadFile(
	file: File,
	path: string,
	bucket = "notes",
): Promise<StorageFile> {
	const supabase = await createClient();

	// ストレージ制限のチェック
	const {
		data: { user },
	} = await supabase.auth.getUser();
	if (!user) throw new Error("User not authenticated");

	const { data: limits, error: limitsError } = await supabase
		.schema("ff_storage")
		.rpc("check_storage_limits", {
			p_user_id: user.id,
			p_file_size_bytes: file.size,
			p_file_type: file.type,
		});

	if (limitsError || !limits?.[0]?.can_upload) {
		throw new Error(
			limits?.[0]?.message || "ストレージ制限をチェックできませんでした",
		);
	}

	// ファイルのアップロード
	const { data: uploadData, error: uploadError } = await supabase.storage
		.from(bucket)
		.upload(path, file, {
			cacheControl: "3600",
			upsert: false,
		});

	if (uploadError) {
		throw uploadError;
	}

	// ファイル情報をデータベースに記録
	const { data: fileData, error: fileError } = await supabase
		.schema("ff_storage")
		.from("files")
		.insert({
			user_id: user.id,
			bucket_name: bucket,
			file_path: path,
			file_name: file.name,
			file_type: file.type,
			file_size_bytes: file.size,
		})
		.select()
		.single();

	if (fileError) {
		// アップロードしたファイルを削除
		await supabase.storage.from(bucket).remove([path]);
		throw fileError;
	}

	return {
		id: fileData.id,
		url: supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl,
		name: file.name,
		size: file.size,
		type: file.type,
		userId: user.id,
		bucketName: bucket,
		filePath: path,
		metadata: {},
		createdAt: fileData.created_at || new Date().toISOString(),
		updatedAt: fileData.updated_at || new Date().toISOString(),
	};
}

export async function deleteFile(
	fileId: string,
	bucket = "notes",
): Promise<void> {
	const supabase = await createClient();

	// ファイル情報の取得
	const { data: file, error: fileError } = await supabase
		.schema("ff_storage")
		.from("files")
		.select("*")
		.eq("id", fileId)
		.single();

	if (fileError) {
		throw fileError;
	}

	// ストレージからファイルを削除
	const { error: deleteError } = await supabase.storage
		.from(bucket)
		.remove([file.file_path]);

	if (deleteError) {
		throw deleteError;
	}

	// データベースからファイル情報を削除
	const { error: dbError } = await supabase
		.schema("ff_storage")
		.from("files")
		.delete()
		.eq("id", fileId);

	if (dbError) {
		throw dbError;
	}
}

export async function getStorageUsage(): Promise<StorageUsage> {
	const supabase = await createClient();

	const { data, error } = await supabase
		.schema("ff_storage")
		.from("user_storage")
		.select(`
      used_storage_bytes,
      file_count,
      storage_plans (
        max_storage_bytes,
        max_file_size_bytes,
        allowed_file_types
      )
    `)
		.single();

	if (error) {
		throw error;
	}

	return {
		usedBytes: data.used_storage_bytes,
		fileCount: data.file_count,
		maxBytes: data.storage_plans.max_storage_bytes,
		maxFileSize: data.storage_plans.max_file_size_bytes,
		allowedTypes: data.storage_plans.allowed_file_types,
	};
}
