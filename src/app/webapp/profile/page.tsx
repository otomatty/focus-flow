import type { Metadata } from "next";
import { ProfileForm } from "@/components/custom/profile/ProfileForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = {
	title: "プロフィール - Focus Flow",
	description: "ユーザープロフィールの設定と管理",
};

export default function ProfilePage() {
	return (
		<div className="container mx-auto p-6">
			<Card>
				<CardHeader>
					<CardTitle>プロフィール設定</CardTitle>
				</CardHeader>
				<CardContent>
					<ProfileForm />
				</CardContent>
			</Card>
		</div>
	);
}
