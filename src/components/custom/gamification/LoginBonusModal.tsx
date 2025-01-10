import { useAtom } from "jotai";
import { loginBonusModalAtom } from "@/stores/loginBonusModal";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Trophy, Star, Award } from "lucide-react";
import { motion } from "framer-motion";

export function LoginBonusModal() {
	const [loginBonusState, setLoginBonusState] = useAtom(loginBonusModalAtom);

	const handleClose = () => {
		setLoginBonusState((prev) => ({ ...prev, isOpen: false }));
	};

	if (!loginBonusState.isOpen) return null;

	return (
		<Dialog open={loginBonusState.isOpen} onOpenChange={handleClose}>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle className="text-center text-2xl font-bold">
						ログインボーナス獲得！
					</DialogTitle>
				</DialogHeader>
				<div className="flex flex-col items-center space-y-6 py-6">
					<motion.div
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						transition={{ type: "spring", stiffness: 260, damping: 20 }}
						className="flex items-center justify-center"
					>
						<Trophy className="h-16 w-16 text-yellow-500" />
					</motion.div>
					<div className="space-y-2 text-center">
						<p className="text-lg font-semibold">
							{loginBonusState.loginStreak}日連続ログイン達成！
						</p>
						<div className="flex items-center justify-center space-x-2">
							<Star className="h-5 w-5 text-yellow-500" />
							<p className="text-xl font-bold text-primary">
								+{loginBonusState.bonusExp} EXP
							</p>
						</div>
						{loginBonusState.loginStreak >= 7 && (
							<div className="mt-4 flex items-center justify-center space-x-2 text-sm text-muted-foreground">
								<Award className="h-4 w-4" />
								<p>最大ボーナス達成中！</p>
							</div>
						)}
					</div>
				</div>
				<div className="flex justify-center">
					<Button onClick={handleClose}>閉じる</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
