"use client";

import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
	CommandItem,
} from "@/components/ui/command";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import type { UserRole } from "@/app/_actions/users/types";
import {
	listAvailableRoles,
	updateUserRoles,
} from "@/app/_actions/users/roles";
import { userRoleDialogAtom } from "@/atoms/userRoleDialog";
import { toast } from "@/hooks/use-toast";

export function UserRoleDialog() {
	const [dialogState, setDialogState] = useAtom(userRoleDialogAtom);
	const [availableRoles, setAvailableRoles] = useState<UserRole[]>([]);
	const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
	const [isLoading, setIsLoading] = useState(false);

	const { isOpen, user } = dialogState;

	useEffect(() => {
		if (isOpen && user) {
			fetchRoles();
			setSelectedRoles(new Set(user.roles.map((role) => role.id)));
		}
	}, [isOpen, user]);

	const handleOpenChange = (open: boolean) => {
		setDialogState((prev) => ({ ...prev, isOpen: open }));
	};

	const fetchRoles = async () => {
		try {
			const roles = await listAvailableRoles();
			setAvailableRoles(roles);
		} catch (error) {
			console.error("Failed to fetch roles:", error);
			toast({
				title: "ロールの取得に失敗しました",
				description: "もう一度お試しください",
				variant: "destructive",
			});
		}
	};

	const handleSave = async () => {
		if (!user) return;
		setIsLoading(true);
		try {
			const currentRoleIds = new Set(user.roles.map((role) => role.id));
			const addedRoles = Array.from(selectedRoles).filter(
				(id) => !currentRoleIds.has(id),
			);
			const removedRoles = Array.from(currentRoleIds).filter(
				(id) => !selectedRoles.has(id),
			);

			await updateUserRoles(user.id, addedRoles, removedRoles);
			toast({
				title: "ロールを更新しました",
				description: "ロールが更新されました",
			});
			handleOpenChange(false);
		} catch (error) {
			console.error("Failed to update roles:", error);
			toast({
				title: "ロールの更新に失敗しました",
				description: "もう一度お試しください",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	if (!user) return null;

	return (
		<ResponsiveDialog
			open={isOpen}
			onOpenChange={handleOpenChange}
			title="ロールの変更"
			description={`${user.profile.display_name || "ユーザー"}のロールを変更します`}
			trigger={null}
		>
			<div className="p-4 space-y-4">
				<Popover>
					<PopoverTrigger asChild>
						<Button variant="outline" className="w-full justify-between">
							{selectedRoles.size > 0
								? `${selectedRoles.size}個のロールを選択中`
								: "ロールを選択..."}
							<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
						</Button>
					</PopoverTrigger>
					<PopoverContent className="w-full p-0">
						<Command>
							<CommandInput placeholder="ロールを検索..." />
							<CommandEmpty>ロールが見つかりません</CommandEmpty>
							<CommandGroup>
								<ScrollArea className="h-72">
									{availableRoles.map((role) => (
										<CommandItem
											key={role.id}
											onSelect={() => {
												const newSelectedRoles = new Set(selectedRoles);
												if (newSelectedRoles.has(role.id)) {
													newSelectedRoles.delete(role.id);
												} else {
													newSelectedRoles.add(role.id);
												}
												setSelectedRoles(newSelectedRoles);
											}}
										>
											<Check
												className={cn(
													"mr-2 h-4 w-4",
													selectedRoles.has(role.id)
														? "opacity-100"
														: "opacity-0",
												)}
											/>
											{role.name}
										</CommandItem>
									))}
								</ScrollArea>
							</CommandGroup>
						</Command>
					</PopoverContent>
				</Popover>

				<div className="flex justify-end gap-2">
					<Button
						variant="outline"
						onClick={() => handleOpenChange(false)}
						disabled={isLoading}
					>
						キャンセル
					</Button>
					<Button onClick={handleSave} disabled={isLoading}>
						{isLoading ? "保存中..." : "保存"}
					</Button>
				</div>
			</div>
		</ResponsiveDialog>
	);
}
