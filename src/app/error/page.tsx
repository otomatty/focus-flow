import { ErrorActions } from "./_components/error-actions";

export default function ErrorPage() {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-50">
			<div className="w-full max-w-md p-8 space-y-6 text-center">
				<h1 className="text-4xl font-bold text-red-600">エラー</h1>
				<p className="text-gray-600">
					申し訳ありません。予期せぬエラーが発生しました。
				</p>
				<ErrorActions />
			</div>
		</div>
	);
}
