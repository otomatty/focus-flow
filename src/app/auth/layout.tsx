import type { Metadata } from "next";
import { AnimatedBackButton } from "./_components/AnimatedBackButton";

export const metadata: Metadata = {
	title: "認証 - Focus Flow",
	description:
		"Focus Flowへようこそ。お好みの方法でログインまたは新規登録してください。",
};

export default function AuthLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen w-full bg-gradient-to-br from-background via-muted/50 to-background relative overflow-hidden">
			<div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,transparent,black)] dark:bg-grid-black/10" />
			<div className="container relative min-h-screen grid place-items-center">
				<AnimatedBackButton />
				{children}
			</div>
		</div>
	);
}
