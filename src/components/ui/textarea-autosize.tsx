import * as React from "react";
import TextareaAutosizeBase, {
	type TextareaAutosizeProps,
} from "react-textarea-autosize";

import { cn } from "@/lib/utils";

export interface TextareaProps extends Omit<TextareaAutosizeProps, "style"> {
	minRows?: number;
	maxRows?: number;
}

const TextareaAutosize = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
	({ className, minRows = 3, maxRows = 10, ...props }, ref) => {
		return (
			<TextareaAutosizeBase
				className={cn(
					"flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={ref}
				minRows={minRows}
				maxRows={maxRows}
				{...props}
			/>
		);
	},
);
TextareaAutosize.displayName = "TextareaAutosize";

export { TextareaAutosize };
