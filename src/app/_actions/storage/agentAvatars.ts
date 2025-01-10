import { createClient } from "@/lib/supabase/server";

const BUCKET_NAME = "agent_avatars";

/**
 * エージェントのアバター画像をアップロードする
 */
export async function uploadAgentAvatar(
	file: File,
	agentId: string,
): Promise<string> {
	const supabase = await createClient();

	// ファイル名を生成（agentId + 拡張子）
	const extension = file.name.split(".").pop();
	const path = `${agentId}.${extension}`;

	// ファイルのアップロード
	const { error: uploadError } = await supabase.storage
		.from(BUCKET_NAME)
		.upload(path, file, {
			cacheControl: "3600",
			upsert: true, // 既存のファイルを上書き
		});

	if (uploadError) {
		throw uploadError;
	}

	// 公開URLを取得
	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);

	return publicUrl;
}

/**
 * エージェントのアバター画像のURLを取得する
 */
export async function getAgentAvatarUrl(
	agentId: string,
): Promise<string | null> {
	const supabase = await createClient();

	// ファイルの存在確認
	const { data: files } = await supabase.storage.from(BUCKET_NAME).list("", {
		search: agentId,
	});

	if (!files || files.length === 0) {
		return null;
	}

	// 公開URLを取得
	const {
		data: { publicUrl },
	} = supabase.storage.from(BUCKET_NAME).getPublicUrl(files[0].name);

	return publicUrl;
}

/**
 * エージェントのアバター画像を削除する
 */
export async function deleteAgentAvatar(agentId: string): Promise<void> {
	const supabase = await createClient();

	// ファイルの存在確認
	const { data: files } = await supabase.storage.from(BUCKET_NAME).list("", {
		search: agentId,
	});

	if (!files || files.length === 0) {
		return;
	}

	// ファイルの削除
	const { error } = await supabase.storage
		.from(BUCKET_NAME)
		.remove([files[0].name]);

	if (error) {
		throw error;
	}
}
