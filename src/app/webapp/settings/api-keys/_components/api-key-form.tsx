import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
	EyeIcon,
	EyeOffIcon,
	Loader2,
	ExternalLinkIcon,
	HelpCircleIcon,
} from "lucide-react";
import {
	HoverCard,
	HoverCardContent,
	HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { ResponsiveDialog } from "@/components/custom/ResponsiveDialog";
import {
	saveApiKey,
	deleteApiKey,
	toggleApiKey,
} from "@/app/_actions/settings/api-keys";
import type { ApiProvider, ApiKey } from "@/types/api-keys";
import { useMediaQuery } from "@/hooks/useMediaQuery";
const providerInfo = {
	google: {
		name: "Google AI Studio",
		url: "https://makersuite.google.com/app/apikey",
		instructions: "Google AI StudioでAPIキーを作成してください。",
		pricing: "無料枠: 月60回まで。詳細は料金ページをご確認ください。",
		format: "APIキーは39文字の文字列です",
	},
	openai: {
		name: "OpenAI Platform",
		url: "https://platform.openai.com/api-keys",
		instructions: "OpenAIのダッシュボードで新しいAPIキーを作成してください。",
		pricing: "従量課金制。詳細は料金ページをご確認ください。",
		format: "APIキーは'sk-'で始まる51文字の文字列です",
	},
	anthropic: {
		name: "Anthropic Console",
		url: "https://console.anthropic.com/settings/keys",
		instructions: "Anthropicのコンソールで新しいAPIキーを作成してください。",
		pricing: "従量課金制。詳細は料金ページをご確認ください。",
		format: "APIキーは'sk-ant-'で始まる文字列です",
	},
} as const;

const apiKeySchema = z.object({
	apiKey: z.string().min(1, "APIキーを入力してください"),
});

type ApiKeyFormProps = {
	provider: ApiProvider;
	currentKey: ApiKey | null;
	onSave: () => void;
};

function ApiKeyStatus({
	isActive,
	isLoading,
}: { isActive: boolean | null; isLoading: boolean }) {
	if (isLoading) {
		return (
			<Badge variant="outline" className="gap-1">
				<Loader2 size={12} className="animate-spin" />
				<span>処理中...</span>
			</Badge>
		);
	}

	if (isActive === null) {
		return <Badge variant="secondary">未設定</Badge>;
	}

	if (isActive) {
		return (
			<Badge variant="success" className="bg-green-500">
				有効
			</Badge>
		);
	}

	return <Badge variant="secondary">無効</Badge>;
}

function ApiKeyHelpContent({ provider }: { provider: ApiProvider }) {
	const info = providerInfo[provider];

	return (
		<div className="space-y-3">
			<div className="space-y-1">
				<h4 className="text-sm font-semibold">{info.name}</h4>
				<p className="text-sm text-muted-foreground">{info.instructions}</p>
				<p className="text-sm font-mono text-muted-foreground">{info.format}</p>
				<p className="text-sm text-muted-foreground">{info.pricing}</p>
			</div>
			<a
				href={info.url}
				target="_blank"
				rel="noopener noreferrer"
				className="inline-flex items-center text-sm text-primary hover:underline"
			>
				APIキーを取得
				<ExternalLinkIcon className="ml-1 h-3 w-3" />
			</a>
		</div>
	);
}

function ApiKeyHelp({ provider }: { provider: ApiProvider }) {
	const [showMobileHelp, setShowMobileHelp] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 768px)");
	const info = providerInfo[provider];

	if (isDesktop) {
		return (
			<HoverCard>
				<HoverCardTrigger asChild>
					<Button variant="ghost" size="icon" className="h-4 w-4">
						<HelpCircleIcon className="h-4 w-4" />
						<span className="sr-only">ヘルプ</span>
					</Button>
				</HoverCardTrigger>
				<HoverCardContent className="w-80">
					<ApiKeyHelpContent provider={provider} />
				</HoverCardContent>
			</HoverCard>
		);
	}

	return (
		<>
			<Button
				variant="ghost"
				size="icon"
				className="h-4 w-4"
				onClick={() => setShowMobileHelp(true)}
			>
				<HelpCircleIcon className="h-4 w-4" />
				<span className="sr-only">ヘルプ</span>
			</Button>

			<ResponsiveDialog
				open={showMobileHelp}
				onOpenChange={setShowMobileHelp}
				title={`${info.name} APIキーの設定`}
				description="APIキーの取得方法と注意事項"
				trigger={""}
			>
				<div className="p-4">
					<ApiKeyHelpContent provider={provider} />
				</div>
			</ResponsiveDialog>
		</>
	);
}

export function ApiKeyForm({ provider, currentKey, onSave }: ApiKeyFormProps) {
	const [showApiKey, setShowApiKey] = useState(false);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const { toast } = useToast();
	const form = useForm<z.infer<typeof apiKeySchema>>({
		resolver: zodResolver(apiKeySchema),
		defaultValues: {
			apiKey: "",
		},
	});

	const onSubmit = async (data: z.infer<typeof apiKeySchema>) => {
		setIsLoading(true);
		try {
			const result = await saveApiKey({
				provider,
				apiKey: data.apiKey,
			});

			if (result.success) {
				toast({
					title: "成功",
					description: result.message,
				});
				form.reset();
				onSave();
			} else {
				toast({
					title: "エラー",
					description: result.message,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "エラー",
				description: "APIキーの保存に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		setIsLoading(true);
		try {
			const result = await deleteApiKey(provider);
			if (result.success) {
				toast({
					title: "成功",
					description: result.message,
				});
				setShowDeleteDialog(false);
				onSave();
			} else {
				toast({
					title: "エラー",
					description: result.message,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "エラー",
				description: "APIキーの削除に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	const handleToggle = async (isActive: boolean) => {
		setIsLoading(true);
		try {
			const result = await toggleApiKey(provider, isActive);
			if (result.success) {
				toast({
					title: "成功",
					description: result.message,
				});
				onSave();
			} else {
				toast({
					title: "エラー",
					description: result.message,
					variant: "destructive",
				});
			}
		} catch (error) {
			toast({
				title: "エラー",
				description: "APIキーの状態変更に失敗しました",
				variant: "destructive",
			});
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-6">
			<div className="flex items-center justify-between">
				<div className="flex items-center space-x-2">
					<FormLabel>APIキー</FormLabel>
					<ApiKeyHelp provider={provider} />
				</div>
				<ApiKeyStatus
					isActive={currentKey?.isActive ?? null}
					isLoading={isLoading}
				/>
			</div>

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
					<FormField
						control={form.control}
						name="apiKey"
						render={({ field }) => (
							<FormItem>
								<div className="flex space-x-2">
									<div className="relative flex-1">
										<FormControl>
											<Input
												type={showApiKey ? "text" : "password"}
												placeholder="sk-..."
												disabled={isLoading}
												{...field}
											/>
										</FormControl>
										<Button
											type="button"
											variant="ghost"
											size="icon"
											className="absolute right-2 top-1/2 -translate-y-1/2"
											onClick={() => setShowApiKey(!showApiKey)}
											disabled={isLoading}
										>
											{showApiKey ? (
												<EyeOffIcon size={16} />
											) : (
												<EyeIcon size={16} />
											)}
										</Button>
									</div>
									<Button type="submit" disabled={isLoading}>
										{isLoading ? (
											<>
												<Loader2 size={16} className="mr-2 animate-spin" />
												保存中...
											</>
										) : (
											"保存"
										)}
									</Button>
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</form>
			</Form>

			{currentKey && (
				<div className="flex items-center justify-between pt-4 border-t">
					<div className="flex items-center space-x-2">
						<Switch
							id="active"
							checked={currentKey.isActive || false}
							onCheckedChange={handleToggle}
							disabled={isLoading}
						/>
						<Label htmlFor="active">有効</Label>
					</div>
					<ResponsiveDialog
						open={showDeleteDialog}
						onOpenChange={setShowDeleteDialog}
						title="APIキーの削除"
						description="このAPIキーを削除してもよろしいですか？この操作は取り消せません。"
						trigger={
							<Button variant="destructive" size="sm" disabled={isLoading}>
								削除
							</Button>
						}
					>
						<div className="p-4 space-y-4">
							<p className="text-sm text-muted-foreground">
								削除すると、このプロバイダーのAPIキーが使用できなくなります。
							</p>
							<div className="flex justify-end space-x-2">
								<Button
									variant="outline"
									onClick={() => setShowDeleteDialog(false)}
									disabled={isLoading}
								>
									キャンセル
								</Button>
								<Button
									variant="destructive"
									onClick={handleDelete}
									disabled={isLoading}
								>
									{isLoading ? (
										<>
											<Loader2 size={16} className="mr-2 animate-spin" />
											削除中...
										</>
									) : (
										"削除"
									)}
								</Button>
							</div>
						</div>
					</ResponsiveDialog>
				</div>
			)}
		</div>
	);
}
