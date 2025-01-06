import { compileMDX } from "next-mdx-remote/rsc";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { readFile } from "node:fs/promises";
import path from "node:path";

export interface DocFrontmatter {
	title: string;
	description: string;
	allowedRoles: string[];
	order: number;
	lastUpdated: string;
	author: string;
}

export async function getMdxContent(filePath: string) {
	const source = await readFile(filePath, "utf-8");

	const { content, frontmatter } = await compileMDX<DocFrontmatter>({
		source,
		options: {
			parseFrontmatter: true,
			mdxOptions: {
				remarkPlugins: [remarkGfm],
				rehypePlugins: [rehypeHighlight],
			},
		},
	});

	return {
		content,
		frontmatter: frontmatter as DocFrontmatter,
	};
}

export async function getDocPath(locale: string, slug: string[]) {
	return path.join(process.cwd(), "docs", ...slug, `${locale}.mdx`);
}
