import type { Metadata } from "next";

const APP_NAME = "Focus Flow";
const APP_DESCRIPTION =
	"Focus Flowは、生産性を最大化するためのタスク管理ツールです。フォーカスモードとフローステートを活用して、より効率的な作業を実現します。";

export const sharedMetadata: Metadata = {
	metadataBase: new URL("https://focus-flow.pages.dev"),
	applicationName: APP_NAME,
	title: {
		default: APP_NAME,
		template: `%s | ${APP_NAME}`,
	},
	description: APP_DESCRIPTION,
	keywords: [
		"タスク管理",
		"生産性",
		"フォーカス",
		"ポモドーロ",
		"時間管理",
		"ToDo",
		"タスク",
		"フロー",
	],
	authors: [{ name: "Focus Flow Team" }],
	creator: "Focus Flow Team",
	publisher: "Focus Flow",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		siteName: APP_NAME,
		title: APP_NAME,
		description: APP_DESCRIPTION,
	},
	twitter: {
		card: "summary_large_image",
		title: APP_NAME,
		description: APP_DESCRIPTION,
		creator: "@focus_flow",
	},
	viewport: {
		width: "device-width",
		initialScale: 1,
		maximumScale: 1,
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
		},
	},
};
