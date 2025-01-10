import { Suspense } from "react";
import { LoginForm } from "../_components/LoginForm";
import type { Metadata } from "next";
import { Loader2 } from "lucide-react";

export const metadata: Metadata = {
	title: "ログイン / 新規登録 - Focus Flow",
	description:
		"Focus Flowへようこそ。お好みの方法でログインまたは新規登録してください。",
};

export default function LoginPage() {
	return (
		<Suspense
			fallback={
				<div className="flex items-center justify-center">
					<Loader2 className="h-6 w-6 animate-spin" />
				</div>
			}
		>
			<LoginForm />
		</Suspense>
	);
}
