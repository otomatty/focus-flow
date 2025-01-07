"use client";

import { Provider } from "jotai";
import { userDataAtom } from "@/stores/userDataAtom";
import { notificationsAtom } from "@/stores/notifications";
import { useHydrateAtoms } from "jotai/utils";
import type { ReactNode } from "react";
import type { UserData } from "@/types/users";
import type { Notification } from "@/types/notifications";

interface ClientProviderProps {
	children: ReactNode;
	userData: UserData;
	notifications: Notification[];
}

function HydrateAtoms({
	initialValues,
	children,
}: {
	initialValues: [
		[typeof userDataAtom, UserData],
		[typeof notificationsAtom, Notification[]],
	];
	children: ReactNode;
}) {
	useHydrateAtoms(initialValues);
	return children;
}

export function ClientProvider({
	children,
	userData,
	notifications,
}: ClientProviderProps) {
	return (
		<Provider>
			<HydrateAtoms
				initialValues={[
					[userDataAtom, userData],
					[notificationsAtom, notifications],
				]}
			>
				{children}
			</HydrateAtoms>
		</Provider>
	);
}
