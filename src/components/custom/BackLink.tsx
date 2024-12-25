import Link from "next/link";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

interface BackLinkProps {
	href: string;
	label?: string;
	className?: string;
}

export function BackLink({ href, label = "戻る", className }: BackLinkProps) {
	return (
		<Button asChild variant="ghost">
			<Link
				href={href}
				className={cn(
					"inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors",
					className,
				)}
			>
				<ChevronLeft className="h-4 w-4 mr-1" />
				{label}
			</Link>
		</Button>
	);
}
