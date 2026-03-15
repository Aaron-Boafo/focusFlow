import { useEffect } from "react"
import { Routes, Route } from "react-router-dom"
import LandingPage from "@/pages/LandingPage"
import { SessionStore } from "@/store/SessionStore"
import AuthPage from "@/pages/AuthPage"

import DashboardLayout from "@/pages/dashboard/index"
import DashboardPage from "@/pages/dashboard/DashboardPage"
import TaskBoardPage from "@/pages/dashboard/TaskBoardPage"
import TimerPage from "@/pages/dashboard/TimerPage"
import FocusModePage from "@/pages/dashboard/FocusModePage"
import AnalyticsPage from "@/pages/dashboard/AnalyticsPage"
import SettingsPage from "@/pages/dashboard/SettingsPage"
import TimerHistoryPage from "./pages/dashboard/TimerHistoryPage"
import LeaderboardPage from "./pages/dashboard/LeaderboardPage"
import NotFoundPage from "@/pages/NotFoundPage"
import { Toaster } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"

import { ProtectedRoute, GuestGuard } from "@/components/AuthGuard"

export function App() {
  const tick = SessionStore((state) => state.tick)
  const activeSessionId = SessionStore((state) => state.activeSessionId)

  useEffect(() => {
    if (!activeSessionId) return

    const timer = setInterval(() => {
      tick()
    }, 1000)

    return () => clearInterval(timer)
  }, [activeSessionId, tick])

  return (
    <TooltipProvider>
      <Routes>
        <Route element={<GuestGuard />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/auth" element={<AuthPage />} />
        </Route>
        
        {/* Dashboard Routes wrapped in the persistent Layout */}
        <Route element={<ProtectedRoute allowGuest={true} />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/tasks/*" element={<TaskBoardPage />} />
            <Route path="/timer" element={<TimerPage />} />
            <Route path="history" element={<TimerHistoryPage />} />
            <Route path="leaderboard" element={<LeaderboardPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>

          {/* Focus Mode operates uniquely without the Sidebar */}
          <Route path="/focus" element={<FocusModePage />} />
        </Route>

        {/* 404 Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Toaster />
    </TooltipProvider>
  )
}


export default App
