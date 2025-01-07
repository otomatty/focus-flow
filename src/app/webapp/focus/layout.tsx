import { FocusNavigation } from "./_components/FocusNavigation";

export default function FocusLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="min-h-screen bg-gradient-to-b from-background to-background/80">
			<div className="container mx-auto px-4 py-6">
				<FocusNavigation />
				<main className="mt-6">{children}</main>
			</div>
		</div>
	);
}
