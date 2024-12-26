import { BackLink } from "./BackLink";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface PageHeaderProps {
	title: string;
	description?: string;
	backHref?: string;
	action?: {
		label: string;
		href: string;
	};
}

export function PageHeader({
	title,
	description,
	backHref,
	action,
}: PageHeaderProps) {
	return (
		<div className="space-y-4 py-6">
			<div className="flex items-center justify-between">
				<div>
					{backHref && <BackLink href={backHref} className="mb-2" />}
					<h1 className="text-3xl font-bold tracking-tight">{title}</h1>
					{description && (
						<p className="text-muted-foreground">{description}</p>
					)}
				</div>
				{action && (
					<div className="flex items-center gap-2">
						<Button asChild>
							<Link href={action.href}>{action.label}</Link>
						</Button>
					</div>
				)}
			</div>
		</div>
	);
}
