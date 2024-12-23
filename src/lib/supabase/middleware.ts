import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import type { Database } from "@/types/supabase";

export function createClient(request: NextRequest) {
	const response = NextResponse.next();

	if (
		!process.env.NEXT_PUBLIC_SUPABASE_URL ||
		!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
	) {
		throw new Error("Missing Supabase environment variables");
	}

	const supabase = createServerClient<Database>(
		process.env.NEXT_PUBLIC_SUPABASE_URL,
		process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
		{
			cookies: {
				getAll: () => {
					return request.cookies.getAll().map((cookie) => ({
						name: cookie.name,
						value: cookie.value,
					}));
				},
				setAll: (cookies) => {
					for (const cookie of cookies) {
						response.cookies.set(cookie.name, cookie.value, cookie.options);
					}
				},
			},
		},
	);

	return { supabase, response };
}
