import { atom, useAtom } from "jotai";
import type { QuestFilters } from "@/types/quest";

const filtersAtom = atom<QuestFilters>({
	questType: "",
	difficulty: "",
	durationType: "",
	isPartyQuest: false,
	isActive: true,
});

export function useQuestStore() {
	const [filters, setFilters] = useAtom(filtersAtom);

	const setFilter = <K extends keyof QuestFilters>(
		key: K,
		value: QuestFilters[K],
	) => {
		setFilters((prev) => ({
			...prev,
			[key]: value,
		}));
	};

	return {
		filters,
		setFilter,
	};
}
