import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function SignUpPage() {
	return (
		<div className="space-y-6">
			<div className="space-y-2 text-center">
				<h1 className="text-3xl font-bold">アカウント作成</h1>
				<p className="text-gray-500">
					Focus Flowで生産性を向上させる旅を始めましょう
				</p>
			</div>

			<form className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="name">お名前</Label>
					<Input
						id="name"
						placeholder="山田 太郎"
						type="text"
						autoComplete="name"
						required
					/>
				</div>
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
				<div className="space-y-2">
					<Label htmlFor="password">パスワード</Label>
					<Input
						id="password"
						type="password"
						autoComplete="new-password"
						required
					/>
				</div>
				<div className="space-y-2">
					<Label htmlFor="confirmPassword">パスワード（確認）</Label>
					<Input
						id="confirmPassword"
						type="password"
						autoComplete="new-password"
						required
					/>
				</div>

				<Button type="submit" className="w-full">
					アカウント作成
				</Button>
			</form>

			<div className="text-center text-sm text-gray-500">
				すでにアカウントをお持ちの場合は{" "}
				<Link href="/auth/login" className="text-blue-600 hover:underline">
					ログイン
				</Link>
			</div>
		</div>
	);
}
