import { useCallback, useEffect } from "react";
import { updateUserActivity } from "@/app/_actions/gamification/activity";

/**
 * ユーザーアクティビティを更新するためのカスタムフック
 * @param options.updateOnMount - コンポーネントマウント時に更新するかどうか
 * @param options.updateInterval - 定期的な更新を行う間隔（ミリ秒）
 */
export function useUpdateActivity({
	updateOnMount = true,
	updateInterval,
}: {
	updateOnMount?: boolean;
	updateInterval?: number;
} = {}) {
	const updateActivity = useCallback(async () => {
		try {
			await updateUserActivity();
		} catch (error) {
			console.error("Failed to update activity:", error);
		}
	}, []);

	useEffect(() => {
		if (updateOnMount) {
			updateActivity();
		}

		if (updateInterval) {
			const intervalId = setInterval(updateActivity, updateInterval);
			return () => clearInterval(intervalId);
		}
	}, [updateOnMount, updateInterval, updateActivity]);

	return { updateActivity };
}
