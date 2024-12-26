"use client";

import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor } from "lucide-react";

export const ThemeSwitcher = () => {
	const { theme, setTheme } = useTheme();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					<Sun className="h-5 w-5 dark:hidden" />
					<Moon className="hidden h-5 w-5 dark:block" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem onClick={() => setTheme("light")}>
					<Sun className="h-5 w-5 mr-2" />
					ライトモード
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("dark")}>
					<Moon className="h-5 w-5 mr-2" />
					ダークモード
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => setTheme("system")}>
					<Monitor className="h-5 w-5 mr-2" />
					システムモード
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
