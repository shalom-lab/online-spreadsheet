import { AppHeader } from "@/components/app-header"
import { HomeView } from "@/components/home-view"

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <HomeView />
    </div>
  )
}

