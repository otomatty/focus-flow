"use client";

import { useEffect, useCallback } from "react";
import { useAtom } from "jotai";
// UI Components
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, Monitor } from "lucide-react";
// Stores
import { themeAtom } from "@/stores/themeAtom";

export const ThemeSwitcher = () => {
	const [theme, setTheme] = useAtom(themeAtom);

	// applyTheme を useCallback でラップ
	const applyTheme = useCallback(
		(newTheme: "light" | "dark" | "system") => {
			setTheme(newTheme);
			localStorage.setItem("theme", newTheme);

			if (newTheme === "system") {
				const isDark = window.matchMedia(
					"(prefers-color-scheme: dark)",
				).matches;
				document.documentElement.classList.toggle("dark", isDark);
			} else {
				document.documentElement.classList.toggle("dark", newTheme === "dark");
			}
		},
		[setTheme],
	);

	// 初期化時にローカルストレージからテーマを読み込む
	useEffect(() => {
		const savedTheme = localStorage.getItem("theme") as
			| "light"
			| "dark"
			| "system"
			| null;
		if (savedTheme) {
			applyTheme(savedTheme);
		}
	}, [applyTheme]);

	// システムテーマの変更を監視
	useEffect(() => {
		if (theme === "system") {
			const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
			const handleChange = () => {
				document.documentElement.classList.toggle("dark", mediaQuery.matches);
			};
			handleChange();
			mediaQuery.addEventListener("change", handleChange);
			return () => mediaQuery.removeEventListener("change", handleChange);
		}
	}, [theme]);

	const getIcon = () => {
		switch (theme) {
			case "light":
				return <Sun className="h-5 w-5" />;
			case "dark":
				return <Moon className="h-5 w-5" />;
			default:
				return <Monitor className="h-5 w-5" />;
		}
	};

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" size="icon">
					{getIcon()}
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-40">
				<DropdownMenuItem onClick={() => applyTheme("light")}>
					<Sun className="h-5 w-5 mr-2" />
					ライトモード
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => applyTheme("dark")}>
					<Moon className="h-5 w-5 mr-2" />
					ダークモード
				</DropdownMenuItem>
				<DropdownMenuItem onClick={() => applyTheme("system")}>
					<Monitor className="h-5 w-5 mr-2" />
					システムモード
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
};
