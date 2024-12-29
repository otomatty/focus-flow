import { ImageResponse } from "next/og";
import type { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
	try {
		const { searchParams } = new URL(request.url);
		const title = searchParams.get("title") ?? "Focus Flow";
		const mode = searchParams.get("mode") ?? "default";

		// フォントの読み込み
		const font = await fetch(
			new URL("../../../assets/fonts/NotoSansJP-Bold.ttf", import.meta.url),
		).then((res) => res.arrayBuffer());

		return new ImageResponse(
			<div
				style={{
					height: "100%",
					width: "100%",
					display: "flex",
					flexDirection: "column",
					alignItems: "center",
					justifyContent: "center",
					background: "linear-gradient(to bottom, #243640, #24BAB8)",
				}}
			>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						alignItems: "center",
						justifyContent: "center",
						gap: "2rem",
					}}
				>
					{/* ロゴマーク（シンプル化したバージョン） */}
					<div
						style={{
							background: "#24BAB8",
							width: "120px",
							height: "120px",
							borderRadius: "24px",
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							boxShadow: "0 8px 16px rgba(0,0,0,0.25)",
						}}
					>
						<svg
							width="80"
							height="80"
							viewBox="0 0 512 512"
							fill="none"
							style={{
								filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.15))",
							}}
							aria-label="Focus Flow Logo"
							role="img"
						>
							<title>Focus Flow Logo</title>
							<circle cx="256" cy="237" r="191" fill="white" />
							<circle cx="256" cy="237" r="161" fill="#243D44" />
							<circle
								cx="256"
								cy="242"
								r="10"
								transform="rotate(-42 256 242)"
								fill="white"
							/>
							<rect
								x="161"
								y="145"
								width="12"
								height="120"
								rx="6"
								transform="rotate(-42 161 145)"
								fill="white"
							/>
							<rect
								x="273"
								y="237"
								width="12"
								height="52"
								rx="6"
								transform="rotate(-132 273 237)"
								fill="white"
							/>
						</svg>
					</div>

					{/* タイトル */}
					<div
						style={{
							display: "flex",
							fontSize: 60,
							fontStyle: "normal",
							color: "white",
							lineHeight: 1.4,
							whiteSpace: "pre-wrap",
							textAlign: "center",
							maxWidth: "80%",
							fontFamily: '"Noto Sans JP"',
							fontWeight: "bold",
							textShadow: "0 2px 4px rgba(0,0,0,0.2)",
						}}
					>
						{title}
					</div>

					{/* モード別の装飾 */}
					{mode !== "default" && (
						<div
							style={{
								color: "white",
								fontSize: 28,
								marginTop: 20,
								padding: "8px 24px",
								background: "rgba(255,255,255,0.1)",
								borderRadius: "12px",
								fontFamily: '"Noto Sans JP"',
							}}
						>
							{mode === "features" && "機能紹介"}
							{mode === "pricing" && "料金プラン"}
							{mode === "contact" && "お問い合わせ"}
							{mode === "privacy" && "プライバシーポリシー"}
							{mode === "terms" && "利用規約"}
						</div>
					)}
				</div>
			</div>,
			{
				width: 1200,
				height: 630,
				fonts: [
					{
						name: "Noto Sans JP",
						data: font,
						style: "normal",
					},
				],
			},
		);
	} catch (e) {
		console.error(e);
		return new Response("Failed to generate OG image", { status: 500 });
	}
}
