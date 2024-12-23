import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function ErrorPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
			<div className="w-full max-w-md p-8 space-y-6 text-center">
				<h1 className="text-4xl font-bold text-red-600">エラー</h1>
				<p className="text-gray-600">
					申し訳ありません。予期せぬエラーが発生しました。
				</p>
				<div className="space-y-4">
					<Button asChild className="w-full">
						<Link href="/">ホームに戻る</Link>
					</Button>
					<Button
						variant="outline"
						asChild
						className="w-full"
						onClick={() => window.location.reload()}
					>
						<Link href="#">ページを再読み込み</Link>
					</Button>
				</div>
			</div>
		</div>
	);
}
