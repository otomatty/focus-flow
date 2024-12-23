import { createClient } from "@/lib/supabase/middleware";
import { NextResponse, type NextRequest } from "next/server";

// 静的アセットのパスかどうかをチェック
function isStaticPath(pathname: string): boolean {
	return (
		pathname.startsWith("/_next/") ||
		pathname.startsWith("/favicon.ico") ||
		/\.(svg|png|jpg|jpeg|gif|webp)$/.test(pathname)
	);
}

// 認証チェックが不要なパスかどうかをチェック
function isPublicPath(pathname: string): boolean {
	return pathname === "/" || isStaticPath(pathname);
}

export async function middleware(request: NextRequest) {
	// 認証チェックが不要なパスの場合はスキップ
	if (isPublicPath(request.nextUrl.pathname)) {
		return NextResponse.next();
	}

	try {
		const { supabase, response } = createClient(request);

		// セッションの基本チェック
		const {
			data: { user },
			error: userError,
		} = await supabase.auth.getUser();

		if (userError) {
			console.error("Auth error:", userError.message);
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}

		// 保護されたルートのチェック
		const isProtectedRoute = request.nextUrl.pathname.startsWith("/webapp");
		const isAuthRoute = request.nextUrl.pathname.startsWith("/auth");

		if (!user && isProtectedRoute) {
			// 未認証ユーザーが保護されたルートにアクセスした場合
			return NextResponse.redirect(new URL("/auth/login", request.url));
		}

		if (user && isAuthRoute) {
			// 認証済みユーザーが認証ページにアクセスした場合
			return NextResponse.redirect(new URL("/webapp", request.url));
		}

		return response;
	} catch (error) {
		console.error("Middleware error:", error);
		return NextResponse.redirect(new URL("/error", request.url));
	}
}

// パスのマッチングルールを詳細に設定
export const config = {
	matcher: [
		// 保護されたルート
		"/webapp/:path*",
		// 認証ルート
		"/auth/:path*",
	],
};
