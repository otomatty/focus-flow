import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "認証 - Focus Flow",
	description:
		"Focus Flowへようこそ。ログインまたはアカウントを作成してください。",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
			<div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-lg">
				{children}
			</div>
		</div>
	);
}
