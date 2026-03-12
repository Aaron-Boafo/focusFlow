import { Routes, Route } from "react-router-dom"
import { BoardScreen } from "@/components/dashboard/BoardScreen"
import { ProjectsScreen } from "@/components/dashboard/ProjectsScreen"
import { NewProjectScreen } from "@/components/dashboard/NewProjectScreen"

export default function TaskBoardPage() {
  return (
    <Routes>
      <Route path="/" element={<ProjectsScreen />} />
      <Route path="/new" element={<NewProjectScreen />} />
      <Route path="/:projectId" element={<BoardScreen />} />
    </Routes>
  )
}
