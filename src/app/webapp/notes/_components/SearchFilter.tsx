"use client";

import { useCallback, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";

export function SearchFilter() {
	const router = useRouter();
	const searchParams = useSearchParams();
	const [isPending, startTransition] = useTransition();

	const [query, setQuery] = useState(searchParams.get("q") || "");
	const [visibility, setVisibility] = useState(
		searchParams.get("visibility") || "all",
	);
	const [tags, setTags] = useState<string[]>(
		searchParams.get("tags")?.split(",").filter(Boolean) || [],
	);
	const [newTag, setNewTag] = useState("");

	const createQueryString = useCallback(
		(newParams: Record<string, string | string[] | null>) => {
			const urlParams = new URLSearchParams(searchParams.toString());
			for (const [key, value] of Object.entries(newParams)) {
				if (value === null) {
					urlParams.delete(key);
				} else if (Array.isArray(value)) {
					if (value.length > 0) {
						urlParams.set(key, value.join(","));
					} else {
						urlParams.delete(key);
					}
				} else {
					urlParams.set(key, value);
				}
			}
			return urlParams.toString();
		},
		[searchParams],
	);

	const handleSearch = useCallback(() => {
		startTransition(() => {
			const queryString = createQueryString({
				q: query || null,
				visibility: visibility || null,
				tags: tags.length > 0 ? tags : null,
			});
			router.push(`/webapp/notes${queryString ? `?${queryString}` : ""}`);
		});
	}, [query, visibility, tags, createQueryString, router]);

	const handleAddTag = useCallback(() => {
		if (newTag && !tags.includes(newTag)) {
			setTags([...tags, newTag]);
			setNewTag("");
		}
	}, [newTag, tags]);

	const handleRemoveTag = useCallback(
		(tag: string) => {
			setTags(tags.filter((t) => t !== tag));
		},
		[tags],
	);

	return (
		<div className="space-y-4">
			<div className="flex gap-2">
				<div className="flex-1">
					<Input
						placeholder="ノートを検索..."
						value={query}
						onChange={(e) => setQuery(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleSearch()}
					/>
				</div>
				<Select value={visibility} onValueChange={setVisibility}>
					<SelectTrigger className="w-[150px]">
						<SelectValue placeholder="可視性" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">すべて</SelectItem>
						<SelectItem value="private">プライベート</SelectItem>
						<SelectItem value="shared">共有</SelectItem>
						<SelectItem value="public">公開</SelectItem>
					</SelectContent>
				</Select>
				<Button onClick={handleSearch} disabled={isPending}>
					<Search className="h-4 w-4" />
				</Button>
			</div>

			<div className="flex gap-2 items-center">
				<div className="flex-1">
					<Input
						placeholder="タグを追加..."
						value={newTag}
						onChange={(e) => setNewTag(e.target.value)}
						onKeyDown={(e) => e.key === "Enter" && handleAddTag()}
					/>
				</div>
				<Button variant="outline" onClick={handleAddTag}>
					追加
				</Button>
			</div>

			{tags.length > 0 && (
				<div className="flex flex-wrap gap-2">
					{tags.map((tag) => (
						<Badge key={tag} variant="secondary">
							{tag}
							<button
								type="button"
								onClick={() => handleRemoveTag(tag)}
								className="ml-2 hover:text-destructive"
							>
								<X className="h-3 w-3" />
							</button>
						</Badge>
					))}
				</div>
			)}
		</div>
	);
}
