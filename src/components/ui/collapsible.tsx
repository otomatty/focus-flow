"use client";

import * as React from "react";
import * as CollapsiblePrimitive from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";

const Collapsible = CollapsiblePrimitive.Root;

const CollapsibleTrigger = CollapsiblePrimitive.CollapsibleTrigger;

const CollapsibleContent = React.forwardRef<
	React.ComponentRef<typeof CollapsiblePrimitive.CollapsibleContent>,
	React.ComponentPropsWithoutRef<typeof CollapsiblePrimitive.CollapsibleContent>
>(({ className, ...props }, ref) => (
	<CollapsiblePrimitive.CollapsibleContent
		ref={ref}
		className={cn(
			"overflow-hidden",
			"data-[state=closed]:animate-collapsible-up data-[state=open]:animate-collapsible-down",
			"data-[state=closed]:opacity-0 data-[state=open]:opacity-100 transition-opacity duration-200",
			className,
		)}
		{...props}
	/>
));
CollapsibleContent.displayName = "CollapsibleContent";

export { Collapsible, CollapsibleTrigger, CollapsibleContent };
