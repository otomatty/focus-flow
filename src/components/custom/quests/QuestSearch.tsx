import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface QuestSearchProps {
	value: string;
	onChange: (value: string) => void;
}

export function QuestSearch({ value, onChange }: QuestSearchProps) {
	return (
		<div className="max-w-2xl mx-auto">
			<div className="relative">
				<Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground" />
				<Input
					placeholder="クエストを検索..."
					value={value}
					onChange={(e) => onChange(e.target.value)}
					className="pl-12 h-14 text-lg rounded-full border-2 hover:border-primary/50 focus-visible:ring-primary"
				/>
			</div>
		</div>
	);
}
