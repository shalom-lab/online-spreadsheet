import { EditorView } from "@/components/editor-view"

export default async function EditorPage({ params }: { params: Promise<{ id: string }> }) {
	const { id } = await params
	return (
		<div className="min-h-screen bg-gray-50 flex flex-col">
			<EditorView params={{ id }} />
		</div>
	)
}

