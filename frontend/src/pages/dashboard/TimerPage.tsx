import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Trophy, RotateCcw, Play, SkipForward } from "lucide-react"
import { SessionStore } from "@/store/SessionStore"
import type { SessionType } from "@/store/SessionStore"

export default function TimerPage() {
  const navigate = useNavigate()
  
  // Use selectors for performance and safety
  const settings = SessionStore((state) => state.settings)
  const activeSessionId = SessionStore((state) => state.activeSessionId)
  const history = SessionStore((state) => state.history)
  const getTodayStats = SessionStore((state) => state.getTodayStats)
  const resetActiveSession = SessionStore((state) => state.resetActiveSession)

  const stats = getTodayStats()
  const activeSession = history.find(s => s.id === activeSessionId)
  
  const [activeTab, setActiveTab] = useState<SessionType>("Focus")

  // Sync activeTab with activeSession if it exists
  useEffect(() => {
    if (activeSession) {
      setActiveTab(activeSession.type)
    }
  }, [activeSession?.type])

  const minutesMap: Record<SessionType, number> = {
    "Focus": settings.focus / 60,
    "Short Break": settings.shortBreak / 60,
    "Long Break": settings.longBreak / 60,
  }

  const selectedMinutes = activeSession 
    ? Math.floor(Math.max(0, activeSession.duration - activeSession.elapsedTime) / 60)
    : minutesMap[activeTab]
    
  const selectedSeconds = activeSession
    ? Math.max(0, activeSession.duration - activeSession.elapsedTime) % 60
    : 0

  const progress = activeSession 
    ? (activeSession.elapsedTime / activeSession.duration) * 100 
    : 0

  const handleStartValue = () => {
    if (activeSession) {
      // Continue existing session
      navigate(`/focus?minutes=${activeSession.duration / 60}&type=${activeSession.type}`)
    } else {
      // Start new session
      navigate(`/focus?minutes=${minutesMap[activeTab]}&type=${activeTab}`)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center mx-auto w-full max-w-4xl px-6 py-12">
      {/* Session Type Selector */}
      <div className={`flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-12 w-fit mx-auto shadow-sm transition-opacity ${activeSessionId ? "opacity-50 pointer-events-none" : ""}`}>
        {(["Focus", "Short Break", "Long Break"] as SessionType[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-8 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              activeTab === tab
                ? "bg-white dark:bg-slate-700 text-primary shadow-sm"
                : "text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="relative group">
        {/* Progress Ring (SVG) */}
        <div className="h-[400px] w-[400px] flex items-center justify-center relative">
          <svg className="absolute inset-0 h-full w-full -rotate-90">
            <circle
              className="text-slate-200 dark:text-slate-800"
              cx="200"
              cy="200"
              fill="transparent"
              r="190"
              stroke="currentColor"
              strokeWidth="8"
            />
            {/* Base state without animation since it's idle */}
            <circle
              className="text-primary rounded-full transition-all duration-300"
              cx="200"
              cy="200"
              fill="transparent"
              r="190"
              stroke="currentColor"
              strokeDasharray="1194"
              strokeDashoffset={1194 - (1194 * progress) / 100}
              strokeWidth="8"
            />
          </svg>
          <div className="text-center z-10">
            <h1 className="text-9xl font-bold tracking-tighter text-slate-900 dark:text-white tabular-nums">
              {String(selectedMinutes).padStart(2, "0")}:{String(selectedSeconds).padStart(2, "0")}
            </h1>
            <p className="text-slate-500 font-medium uppercase tracking-[0.2em] mt-2">
              {activeSession ? "In Progress..." : "Minutes Remaining"}
            </p>
          </div>
        </div>
      </div>

      {/* XP Reward Hint */}
      <div className="mt-8 flex items-center gap-2 text-slate-500 dark:text-slate-400">
        <Trophy className="h-5 w-5 text-amber-500" />
        <span className="text-sm">
          Complete this session to earn{" "}
          <strong className="text-slate-900 dark:text-white">+50 XP</strong>
        </span>
      </div>

      {/* Control Buttons */}
      <div className="mt-12 flex items-center gap-6">
        <button 
          onClick={resetActiveSession}
          disabled={!activeSessionId}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <RotateCcw className="h-6 w-6" />
        </button>
        <button
          onClick={handleStartValue}
          className="flex h-20 items-center gap-3 rounded-3xl bg-primary px-12 text-2xl font-bold text-white shadow-lg shadow-primary/30 transition-all hover:scale-105 active:scale-95"
        >
          <Play className="h-8 w-8 fill-current" />
          {activeSession ? "Continue" : "Start"}
        </button>
        <button 
          disabled={!activeSessionId}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-200 text-slate-600 transition-all hover:bg-slate-300 disabled:opacity-30 disabled:cursor-not-allowed dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700"
        >
          <SkipForward className="h-6 w-6" />
        </button>
      </div>

      {/* Session Stats Bar */}
      <div className="mt-20 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Today's Focus
          </p>
          <p className="text-2xl font-bold">
            {stats.focusHours} <span className="text-sm font-normal text-muted-foreground">hrs</span>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm ring-2 ring-primary/20">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-primary">
            Current Streak
          </p>
          <p className="text-2xl font-bold">
            {stats.streak} <span className="text-sm font-normal text-muted-foreground">sessions</span>
          </p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="mb-1 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Daily Rank
          </p>
          <p className="text-2xl font-bold">#{stats.rank}</p>
        </div>
      </div>
    </div>
  )
}
