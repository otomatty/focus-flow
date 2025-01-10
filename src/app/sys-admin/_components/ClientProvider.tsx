"use client";

import type { UserProfile } from "@/types/users";
import { atom, createStore } from "jotai";
import { Provider } from "jotai";
import { useMemo } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

interface AdminUserData {
	profile: UserProfile;
}

interface ClientProviderProps {
	userData: AdminUserData;
	children: React.ReactNode;
}

// Atomの定義
export const adminUserDataAtom = atom<AdminUserData | null>(null);

export function ClientProvider({ userData, children }: ClientProviderProps) {
	const store = useMemo(() => {
		const store = createStore();
		store.set(adminUserDataAtom, userData);
		return store;
	}, [userData]);

	const queryClient = useMemo(() => new QueryClient(), []);

	return (
		<Provider store={store}>
			<QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
		</Provider>
	);
}
