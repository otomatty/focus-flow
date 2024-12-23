export function getSupabaseConfig() {
	const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
	const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

	if (!url || !anonKey) {
		throw new Error(
			"Missing Supabase environment variables. Please check your .env file.",
		);
	}

	return {
		url,
		anonKey,
	};
}