import { notFound } from "next/navigation";
import { getMdxContent, getDocPath } from "@/lib/mdx";
import { checkDocAccess, getUserRoles } from "@/lib/docs/access-control";
import { createClient } from "@/lib/supabase/server";

interface DocPageProps {
	params: {
		locale: string;
		slug: string[];
	};
}

export default async function DocPage({
	params: { locale, slug },
}: DocPageProps) {
	try {
		const supabase = await createClient();
		const {
			data: { user },
		} = await supabase.auth.getUser();

		const filePath = await getDocPath(locale, slug);
		const { content, frontmatter } = await getMdxContent(filePath);

		// アクセス制御
		const userRoles = await getUserRoles(user);
		const canAccess = await checkDocAccess(frontmatter, userRoles);

		if (!canAccess) {
			notFound();
		}

		return (
			<article className="prose dark:prose-invert max-w-none">
				<h1>{frontmatter.title}</h1>
				<div className="text-sm text-muted-foreground mb-8">
					<p>最終更新: {frontmatter.lastUpdated}</p>
					<p>作成者: {frontmatter.author}</p>
				</div>
				{content}
			</article>
		);
	} catch (error) {
		console.error("Failed to load document:", error);
		notFound();
	}
}
