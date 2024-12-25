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
		<div className="flex flex-col gap-4">
			<div className="flex items-center justify-between">
				<div className="space-y-1">
					{backHref && <BackLink href={backHref} />}
					<h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
					{description && (
						<p className="text-sm text-muted-foreground">{description}</p>
					)}
				</div>
				{action && (
					<Button asChild>
						<Link href={action.href}>{action.label}</Link>
					</Button>
				)}
			</div>
		</div>
	);
}
