import { useState, useEffect } from "react";

interface MediaQueryOptions {
	defaultMatches?: boolean;
	matchMedia?: typeof window.matchMedia;
}

/**
 * メディアクエリの状態を監視するカスタムフック
 * @param query メディアクエリ文字列
 * @param options オプション（デフォルトの一致状態、カスタムのmatchMedia関数）
 * @returns メディアクエリが一致するかどうかのブール値
 */
export const useMediaQuery = (
	query: string,
	options: MediaQueryOptions = {},
): boolean => {
	// SSRの場合はデフォルト値を使用し、クライアントサイドの場合は実際の状態を確認
	const [matches, setMatches] = useState<boolean>(() => {
		if (typeof window !== "undefined") {
			return window.matchMedia(query).matches;
		}
		return options.defaultMatches ?? false;
	});

	useEffect(() => {
		// SSRの場合は早期リターン
		if (typeof window === "undefined") {
			return undefined;
		}

		// メディアクエリの初期化
		const mediaQuery = window.matchMedia(query);
		setMatches(mediaQuery.matches);

		// メディアクエリの変更を監視するハンドラー
		const handler = (event: MediaQueryListEvent) => {
			setMatches(event.matches);
		};

		// イベントリスナーの登録
		mediaQuery.addEventListener("change", handler);

		// クリーンアップ関数
		return () => {
			mediaQuery.removeEventListener("change", handler);
		};
	}, [query]); // queryが変更された場合のみ再実行

	return matches;
};
