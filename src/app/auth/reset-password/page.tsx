import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function ResetPasswordPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">パスワードリセット</h1>
				<p className="text-gray-500">
					登録済みのメールアドレスを入力してください
				</p>
			</div>

			<form className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="email">メールアドレス</Label>
					<Input
						id="email"
						placeholder="your@email.com"
						type="email"
						autoCapitalize="none"
						autoComplete="email"
						autoCorrect="off"
						required
					/>
				</div>

				<Button type="submit" className="w-full">
					リセットリンクを送信
				</Button>
			</form>

			<div className="text-center text-sm text-gray-500">
				<Link href="/auth/login" className="text-blue-600 hover:underline">
					ログインページに戻る
				</Link>
			</div>
		</div>
	);
}
