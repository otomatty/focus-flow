"use client";

import type React from "react";
import { useState } from "react";
import {
	Dialog,
	DialogTrigger,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogDescription,
} from "@/components/ui/dialog";
import {
	Drawer,
	DrawerTrigger,
	DrawerContent,
	DrawerHeader,
	DrawerTitle,
	DrawerDescription,
} from "@/components/ui/drawer";
import { useMediaQuery } from "@/hooks/useMediaQuery";

interface BaseDialogProps {
	children: React.ReactNode;
	title: string;
	description: string;
	trigger: React.ReactNode;
}

interface UncontrolledDialogProps extends BaseDialogProps {
	open?: never;
	onOpenChange?: never;
}

interface ControlledDialogProps extends BaseDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

type ResponsiveDialogProps = UncontrolledDialogProps | ControlledDialogProps;

export function ResponsiveDialog({
	children,
	title,
	description,
	trigger,
	open,
	onOpenChange,
}: ResponsiveDialogProps) {
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const [internalOpen, setInternalOpen] = useState(false);

	const isControlled = open !== undefined && onOpenChange !== undefined;
	const isOpen = isControlled ? open : internalOpen;
	const setIsOpen = isControlled ? onOpenChange : setInternalOpen;

	return (
		<>
			{isDesktop ? (
				<Dialog open={isOpen} onOpenChange={setIsOpen}>
					<DialogTrigger asChild>{trigger}</DialogTrigger>
					<DialogContent className="max-h-[90vh] flex flex-col p-0">
						<DialogHeader className="p-4 border-b flex-shrink-0">
							<DialogTitle>{title}</DialogTitle>
							<DialogDescription>{description}</DialogDescription>
						</DialogHeader>
						<div className="flex-1 overflow-hidden">{children}</div>
					</DialogContent>
				</Dialog>
			) : (
				<Drawer open={isOpen} onOpenChange={setIsOpen}>
					<DrawerTrigger asChild>{trigger}</DrawerTrigger>
					<DrawerContent>
						<DrawerHeader className="border-b flex-shrink-0">
							<DrawerTitle>{title}</DrawerTitle>
							<DrawerDescription>{description}</DrawerDescription>
						</DrawerHeader>
						<div className="px-4 flex-1 overflow-hidden">{children}</div>
					</DrawerContent>
				</Drawer>
			)}
		</>
	);
}
