import { AppHeader } from "@/components/app-header"
import { TemplatesView } from "@/components/templates-view"

export default function TemplatesPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <TemplatesView />
    </div>
  )
}

