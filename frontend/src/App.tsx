import { Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import AuthPage from "@/pages/AuthPage"

import DashboardLayout from "@/pages/dashboard/index"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import TaskBoardPage from "@/pages/dashboard/TaskBoardPage"
import TimerPage from "@/pages/dashboard/TimerPage"
import FocusModePage from "@/pages/dashboard/FocusModePage"
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage"
import SettingsPage from "@/pages/dashboard/SettingsPage"

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      
      {/* Dashboard Routes wrapped in the persistent Layout */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/tasks/*" element={<TaskBoardPage />} />
        <Route path="/timer" element={<TimerPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
        <Route path="/settings" element={<SettingsPage />} />
      </Route>

      {/* Focus Mode operates uniquely without the Sidebar */}
      <Route path="/focus" element={<FocusModePage />} />
    </Routes>
  )
}

export default App
