import { TemplateForm } from "../_components/TemplateForm";

export default function NewTemplatePage() {
	return (
		<div className="container mx-auto p-4 space-y-4">
			<h1 className="text-2xl font-bold">新規テンプレート作成</h1>
			<TemplateForm mode="create" />
		</div>
	);
}
