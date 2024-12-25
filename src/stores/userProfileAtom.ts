import { atom } from "jotai";

// クライアントサイドで扱う公開可能なユーザープロフィール情報の型定義
export interface PublicUserProfile {
	displayName: string | null;
	email: string;
	profileImage: string | null;
}

// ユーザープロフィール情報を保持するatom
// null初期値は未認証または未取得状態を表す
export const userProfileAtom = atom<PublicUserProfile | null>(null);
