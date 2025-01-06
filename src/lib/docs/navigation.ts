import { glob } from "glob";
import path from "node:path";
import { getMdxContent } from "../mdx";
import { checkDocAccess } from "./access-control";

export interface NavItem {
	title: string;
	path: string;
	order: number;
	children?: NavItem[];
}

export async function generateNavigation(locale: string, userRoles: string[]) {
	const files = await glob("docs/**/*.mdx");
	const nav: NavItem[] = [];

	for (const file of files) {
		// ロケールに一致するファイルのみを処理
		if (!file.includes(`/${locale}/`)) {
			continue;
		}

		const { frontmatter } = await getMdxContent(file);

		// アクセス権限チェック
		const canAccess = await checkDocAccess(frontmatter, userRoles);
		if (!canAccess) {
			continue;
		}

		const relativePath = file.replace("docs/", "").replace(".mdx", "");
		const segments = relativePath.split("/");

		// ナビゲーションアイテムの作成
		const item: NavItem = {
			title: frontmatter.title,
			path: `/${segments.join("/")}`,
			order: frontmatter.order,
		};

		nav.push(item);
	}

	// 順序でソート
	return nav.sort((a, b) => a.order - b.order);
}

export async function getBreadcrumbs(slug: string[], locale: string) {
	const breadcrumbs = [];
	let currentPath = "";

	for (const segment of slug) {
		currentPath = path.join(currentPath, segment);
		const filePath = path.join(
			process.cwd(),
			"docs",
			currentPath,
			`${locale}.mdx`,
		);

		try {
			const { frontmatter } = await getMdxContent(filePath);
			breadcrumbs.push({
				title: frontmatter.title,
				path: `/${currentPath}`,
			});
		} catch (error) {
			console.error(`Failed to load breadcrumb for ${filePath}:`, error);
		}
	}

	return breadcrumbs;
}
