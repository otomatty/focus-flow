import { Button } from "@/components/ui/button";
import {
	Plus,
	Trash,
	ZoomIn,
	ZoomOut,
	Save,
	Download,
	Upload,
	Grid,
	LayoutGrid,
	FolderPlus,
	Group,
	HelpCircle,
} from "lucide-react";
import { useReactFlow } from "reactflow";
import { Separator } from "@/components/ui/separator";
import { Toggle } from "@/components/ui/toggle";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";

interface TaskToolbarProps {
	onAddNote: () => void;
	onAddGroup: () => void;
	onGroupSelected: () => void;
	onDeleteSelected: () => void;
	onSave?: () => void;
	onLoad?: () => void;
	onExport?: () => void;
}

export const TaskToolbar = ({
	onAddNote,
	onAddGroup,
	onGroupSelected,
	onDeleteSelected,
	onSave,
	onLoad,
	onExport,
}: TaskToolbarProps) => {
	const { zoomIn, zoomOut, fitView } = useReactFlow();

	return (
		<div className="absolute top-4 left-4 z-10 flex gap-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg shadow-lg">
			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={onAddNote}>
						<Plus className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>新しい付箋を追加</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={onAddGroup}>
						<FolderPlus className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>新しいグループを追加</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={onGroupSelected}>
						<Group className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>選択した付箋をグループ化</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={onDeleteSelected}>
						<Trash className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>選択したアイテムを削除</TooltipContent>
			</Tooltip>

			<Separator orientation="vertical" className="h-6" />

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={() => zoomIn()}>
						<ZoomIn className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>拡大</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={() => zoomOut()}>
						<ZoomOut className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>縮小</TooltipContent>
			</Tooltip>

			<Tooltip>
				<TooltipTrigger asChild>
					<Button variant="outline" size="icon" onClick={() => fitView()}>
						<LayoutGrid className="h-4 w-4" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>全体を表示</TooltipContent>
			</Tooltip>

			<Separator orientation="vertical" className="h-6" />

			<Tooltip>
				<TooltipTrigger asChild>
					<Toggle aria-label="グリッド表示切替">
						<Grid className="h-4 w-4" />
					</Toggle>
				</TooltipTrigger>
				<TooltipContent>グリッド表示切替</TooltipContent>
			</Tooltip>

			<Separator orientation="vertical" className="h-6" />

			{onSave && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" onClick={onSave}>
							<Save className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>保存</TooltipContent>
				</Tooltip>
			)}

			{onLoad && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" onClick={onLoad}>
							<Upload className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>読み込み</TooltipContent>
				</Tooltip>
			)}

			{onExport && (
				<Tooltip>
					<TooltipTrigger asChild>
						<Button variant="outline" size="icon" onClick={onExport}>
							<Download className="h-4 w-4" />
						</Button>
					</TooltipTrigger>
					<TooltipContent>エクスポート</TooltipContent>
				</Tooltip>
			)}

			<Separator orientation="vertical" className="h-6" />

			<Dialog>
				<Tooltip>
					<TooltipTrigger asChild>
						<DialogTrigger asChild>
							<Button variant="outline" size="icon">
								<HelpCircle className="h-4 w-4" />
							</Button>
						</DialogTrigger>
					</TooltipTrigger>
					<TooltipContent>ヘルプ</TooltipContent>
				</Tooltip>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>付箋の操作方法</DialogTitle>
					</DialogHeader>
					<div className="space-y-4">
						<div>
							<h3 className="font-semibold mb-2">付箋の選択</h3>
							<ul className="list-disc list-inside space-y-2">
								<li>単一選択: 付箋を直接クリック</li>
								<li>追加選択: Shiftキーを押しながらクリック</li>
								<li>トグル選択: Ctrl(Command)キーを押しながらクリック</li>
								<li>範囲選択: マウスドラッグで範囲を指定</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-2">付箋の編集</h3>
							<ul className="list-disc list-inside space-y-2">
								<li>内容の編集: ダブルクリックまたは編集アイコンをクリック</li>
								<li>移動: ドラッグ&ドロップ</li>
								<li>接続: ハンドルをドラッグして他の付箋と接続</li>
							</ul>
						</div>
						<div>
							<h3 className="font-semibold mb-2">グループ化</h3>
							<ul className="list-disc list-inside space-y-2">
								<li>新規グループ: フォルダー+アイコンをクリック</li>
								<li>
									選択した付箋をグループ化:
									付箋を選択してグループアイコンをクリック
								</li>
								<li>
									グループの折りたたみ/展開: グループの矢印アイコンをクリック
								</li>
							</ul>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
};
