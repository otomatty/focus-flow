import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbsProps {
	items: {
		label: string;
		href: string;
	}[];
	className?: string;
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
	return (
		<nav className={cn("flex items-center space-x-2 text-sm", className)}>
			{items.map((item, index) => (
				<div key={item.href} className="flex items-center">
					{index > 0 && (
						<ChevronRight className="mx-2 h-4 w-4 text-muted-foreground" />
					)}
					<Link
						href={item.href}
						className={cn(
							"hover:text-foreground transition-colors",
							index === items.length - 1
								? "text-foreground font-medium"
								: "text-muted-foreground",
						)}
					>
						{item.label}
					</Link>
				</div>
			))}
		</nav>
	);
}
