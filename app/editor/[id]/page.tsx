import { EditorView } from "@/components/editor-view"

export default function EditorPage({ params }: { params: { id: string } }) {
    // 直接传递params对象，而不是params.id
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <EditorView params={params} />
        </div>
    )
}

