"use client";

import { Provider } from "jotai";
import { userDataAtom } from "@/stores/userDataAtom";
import { notificationsAtom } from "@/stores/notifications";
import { levelUpModalAtom } from "@/stores/levelUpModal";
import { useHydrateAtoms } from "jotai/utils";
import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { LevelUpModal } from "@/components/custom/level/LevelUpModal";
import { useAtom } from "jotai";
import type { ReactNode } from "react";
import type { UserData } from "@/types/users";
import type { Notification } from "@/types/notifications";
import type { LevelUpState } from "@/stores/levelUpModal";
import type { RealtimePostgresUpdatePayload } from "@supabase/supabase-js";
import { useUpdateActivity } from "@/hooks/useUpdateActivity";
import { loginBonusModalAtom } from "@/stores/loginBonusModal";
import { LoginBonusModal } from "@/components/custom/gamification/LoginBonusModal";

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
		[typeof levelUpModalAtom, LevelUpState],
		[
			typeof loginBonusModalAtom,
			{ isOpen: boolean; bonusExp: number; loginStreak: number },
		],
	];
	children: ReactNode;
}) {
	useHydrateAtoms(initialValues);
	return children;
}

function LevelUpHandler() {
	const [userData] = useAtom(userDataAtom);
	const [levelUpState, setLevelUpState] = useAtom(levelUpModalAtom);

	useEffect(() => {
		if (!userData?.profile?.id) return;

		const supabase = createClient();

		// レベルアップを監視するチャンネルを作成
		const channel = supabase
			.channel(`user-level-${userData.profile.id}`)
			.on(
				"postgres_changes" as const,
				{
					event: "UPDATE",
					schema: "ff_gamification",
					table: "user_levels",
					filter: `user_id=eq.${userData.profile.id}`,
				},
				async (
					payload: RealtimePostgresUpdatePayload<{
						current_level: number;
						current_exp: number;
					}>,
				) => {
					if (!payload.old || !payload.new) return;
					if (
						payload.old.current_level === undefined ||
						payload.new.current_level === undefined
					)
						return;

					const oldLevel = payload.old.current_level;
					const newLevel = payload.new.current_level;

					// レベルアップが検出された場合
					if (newLevel > oldLevel) {
						setLevelUpState({
							isOpen: true,
							prevLevel: oldLevel,
							newLevel: newLevel,
							currentExp: payload.new.current_exp,
							nextLevelExp: userData.nextLevelExp ?? 100,
						});
					}
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userData?.profile?.id, userData?.nextLevelExp, setLevelUpState]);

	const handleClose = () => {
		setLevelUpState((prev) => ({ ...prev, isOpen: false }));
	};

	if (!levelUpState.isOpen) return null;

	return (
		<LevelUpModal
			prevLevel={levelUpState.prevLevel}
			newLevel={levelUpState.newLevel}
			currentExp={levelUpState.currentExp}
			nextLevelExp={levelUpState.nextLevelExp}
			onClose={handleClose}
		/>
	);
}

function LoginBonusHandler() {
	const [, setLoginBonusState] = useAtom(loginBonusModalAtom);
	const [userData] = useAtom(userDataAtom);

	useEffect(() => {
		if (!userData?.profile?.id) return;

		const supabase = createClient();

		// ログインボーナスを監視するチャンネルを作成
		const channel = supabase
			.channel(`login-bonus-${userData.profile.id}`)
			.on(
				"postgres_changes",
				{
					event: "INSERT",
					schema: "ff_gamification",
					table: "login_bonus_history",
					filter: `user_id=eq.${userData.profile.id}`,
				},
				(payload) => {
					// ログインボーナスが付与された時にモーダルを表示
					setLoginBonusState({
						isOpen: true,
						bonusExp: payload.new.bonus_exp,
						loginStreak: payload.new.login_streak,
					});
				},
			)
			.subscribe();

		return () => {
			supabase.removeChannel(channel);
		};
	}, [userData?.profile?.id, setLoginBonusState]);

	return null;
}

export function ClientProvider({
	children,
	userData,
	notifications,
}: ClientProviderProps) {
	const initialLevelUpState: LevelUpState = {
		isOpen: false,
		prevLevel: userData.level.current_level,
		newLevel: userData.level.current_level,
		currentExp: userData.level.current_exp,
		nextLevelExp: userData.nextLevelExp ?? 100,
	};

	useUpdateActivity({ updateInterval: 15 * 60 * 1000 });

	return (
		<Provider>
			<HydrateAtoms
				initialValues={[
					[userDataAtom, userData],
					[notificationsAtom, notifications],
					[levelUpModalAtom, initialLevelUpState],
					[loginBonusModalAtom, { isOpen: false, bonusExp: 0, loginStreak: 0 }],
				]}
			>
				{children}
				<LevelUpHandler />
				<LoginBonusHandler />
				<LoginBonusModal />
			</HydrateAtoms>
		</Provider>
	);
}
