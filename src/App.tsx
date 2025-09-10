import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import AppHeader from "./components/AppHeader"
import HomeView from "./views/HomeView"
import EditorView from "./views/EditorView"
import TemplatesView from "./views/TemplatesView"

export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <AppHeader />
        <Routes>
          <Route path="/" element={<HomeView />} />
          <Route path="/editor/:id" element={<EditorView />} />
          <Route path="/templates" element={<TemplatesView />} />
        </Routes>
      </div>
    </Router>
  )
}

