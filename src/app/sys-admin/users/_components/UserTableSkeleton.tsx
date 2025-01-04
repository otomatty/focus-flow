import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";

export function UserTableSkeleton() {
	// ユニークなIDを生成するための関数
	const generateSkeletonId = (index: number, type: string) =>
		`skeleton-${type}-${index}-${Math.random().toString(36).substring(7)}`;

	return (
		<div className="w-full">
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>
								<Skeleton className="h-8 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-32" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-24" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-32" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-32" />
							</TableHead>
							<TableHead>
								<Skeleton className="h-8 w-8" />
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{Array.from({ length: 5 }).map((_, index) => (
							<TableRow key={generateSkeletonId(index, "row")}>
								<TableCell>
									<Skeleton className="h-6 w-24" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-32" />
								</TableCell>
								<TableCell>
									<div className="flex gap-1">
										<Skeleton className="h-6 w-16" />
										<Skeleton className="h-6 w-16" />
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-16" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-16" />
								</TableCell>
								<TableCell>
									<div className="flex flex-col gap-1.5">
										<div className="flex items-center justify-between">
											<Skeleton className="h-4 w-16" />
											<Skeleton className="h-4 w-16" />
										</div>
										<Skeleton className="h-2 w-full" />
									</div>
								</TableCell>
								<TableCell>
									<Skeleton className="h-6 w-32" />
								</TableCell>
								<TableCell>
									<Skeleton className="h-8 w-8" />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
