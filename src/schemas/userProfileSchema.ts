import { z } from "zod";

// 電話番号のバリデーション用の正規表現
const PHONE_REGEX = /^(\d{3}-\d{4}-\d{4}|\d{11})$/;

// ユーザープロフィールのスキーマ
// データベースに登録する際のプロフィール型（入力用）
// アプリケーション内のフォームで使用する際のプロフィール型（出力用）
export const userProfileSchema = z.object({
	email: z.string().email("有効なメールアドレスを入力してください"),
	familyName: z.string().min(1, "姓を入力してください"),
	givenName: z.string().min(1, "名を入力してください"),
	profileImage: z.string().optional().default(""),
	phoneNumber: z
		.string()
		.regex(
			PHONE_REGEX,
			"電話番号は11桁の数字、または XXX-XXXX-XXXX の形式で入力してください",
		)
		.optional()
		.nullable()
		.or(z.literal("")) // 空文字列を許可
		.default(""),
	bio: z.string().optional().default(""),
});

export type UserProfileFormValues = z.infer<typeof userProfileSchema>;
