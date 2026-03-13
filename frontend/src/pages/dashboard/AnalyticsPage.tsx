import { useAppStore } from "@/store/useAppStore"
import { useProjectStore } from "@/store/ProjectStore"
import { useExpStore } from "@/store/ExpStore"
import { SessionStore } from "@/store/SessionStore"
import {
  CheckCircle2,
  TrendingUp,
  Timer,
  Clock,
  Download,
  Award,
  Rocket,
  TrendingDown,
} from "lucide-react"

import { AnalyticsSkeleton } from "@/components/skeletons/AnalyticsSkeleton"

export default function AnalyticsPage() {
  const { isLoading: appLoading } = useAppStore()
  const { projects, isLoading: projectsLoading } = useProjectStore()
  const {
    level,
    getXpTitle,
    getExpForNextLevel,
    getExpSinceLastLevel,
    isLoading: expLoading
  } = useExpStore()
  const { getTodayStats, history: sessionHistory, isLoading: sessionLoading } = SessionStore()

  if (appLoading || projectsLoading || expLoading || sessionLoading) {
    return <AnalyticsSkeleton />
  }
  const sessionStats = getTodayStats()

  // --- Task Stats ---
  const allTasks = projects.flatMap((p) => p.tasks)
  const totalTasksCompleted = allTasks.filter((t) => t.status === "Done").length
  
  const todayDate = new Date().toISOString().split("T")[0]
  const yesterdayDate = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const completedToday = allTasks.filter(t => t.status === "Done" && t.completedAt?.startsWith(todayDate)).length
  const completedYesterday = allTasks.filter(t => t.status === "Done" && t.completedAt?.startsWith(yesterdayDate)).length
  
  const tasksGrowth = (() => {
    if (completedYesterday === 0) return completedToday > 0 ? "+100%" : "0%"
    const growth = Math.round(((completedToday - completedYesterday) / completedYesterday) * 100)
    return (growth >= 0 ? "+" : "") + growth + "%"
  })()

  // --- XP Stats ---
  const expInLevel = getExpSinceLastLevel()
  const expForNext = getExpForNextLevel(level)
  const xpProgress = Math.round((expInLevel / expForNext) * 100)
  const xpToNext = expForNext - expInLevel

  // --- Weekly Focus Chart Logic ---
  const getLast7Days = () => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      const dateStr = d.toISOString().split("T")[0]
      const label = d.toLocaleDateString("en-US", { weekday: "short" }).toUpperCase()
      
      // Calculate total focus hours for that day
      const daySessions = sessionHistory.filter(s => s.date === dateStr && s.type === "Focus")
      const totalSeconds = daySessions.reduce((acc, s) => acc + s.elapsedTime, 0)
      const hours = totalSeconds / 3600
      
      days.push({
        label,
        hours,
        active: dateStr === todayDate
      })
    }
    return days
  }

  const chartData = getLast7Days()
  const maxHours = Math.max(...chartData.map(d => d.hours), 1) // Avoid div by zero
  
  const weeklyTotalHours = chartData.reduce((acc, d) => acc + d.hours, 0)
  const dailyAvgHours = (weeklyTotalHours / 7).toFixed(1)
  
  const bestDayObj = [...chartData].sort((a, b) => b.hours - a.hours)[0]
  const bestDayLabel = `${bestDayObj.label} (${bestDayObj.hours.toFixed(1)}h)`

  const chartDays = chartData.map(d => ({
    label: d.label,
    height: `${Math.max(5, (d.hours / (maxHours * 1.1)) * 100)}%`, // Scale height relative to max, min 5%
    active: d.active,
    hours: d.hours
  }))

  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      {/* Hero Titles */}
      <div className="space-y-1">
        <h2 className="text-3xl font-black tracking-tight text-foreground">
          Analytics & Progress
        </h2>
        <p className="text-muted-foreground">
          Deep dive into your productivity trends and level progression.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Total Tasks */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <span className={`flex items-center text-sm font-bold ${completedToday >= completedYesterday ? 'text-emerald-500' : 'text-rose-500'}`}>
              {tasksGrowth} {completedToday >= completedYesterday ? <TrendingUp className="ml-1 h-3.5 w-3.5" /> : <TrendingDown className="ml-1 h-3.5 w-3.5" />}
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Tasks Completed
          </p>
          <p className="mt-1 text-3xl font-bold">{totalTasksCompleted}</p>
        </div>

        {/* Focus Sessions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Timer className="h-6 w-6" />
            </div>
            <span className={`flex items-center text-sm font-bold ${sessionStats.sessionsGrowth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {sessionStats.sessionsGrowth} {sessionStats.sessionsGrowth.startsWith('+') ? <TrendingUp className="ml-1 h-3.5 w-3.5" /> : <TrendingDown className="ml-1 h-3.5 w-3.5" />}
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Focus Sessions (Today)
          </p>
          <p className="mt-1 text-3xl font-bold">{sessionStats.streak}</p>
        </div>

        {/* Focus Hours */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <span className={`flex items-center text-sm font-bold ${sessionStats.focusHoursGrowth.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
              {sessionStats.focusHoursGrowth} {sessionStats.focusHoursGrowth.startsWith('+') ? <TrendingUp className="ml-1 h-3.5 w-3.5" /> : <TrendingDown className="ml-1 h-3.5 w-3.5" />}
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Focus Hours (Today)
          </p>
          <p className="mt-1 text-3xl font-bold">{sessionStats.focusHours.toFixed(1)}h</p>
        </div>
      </div>

      {/* XP Progress Section */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-white shadow-lg shadow-primary/30">
              {level}
            </div>
            <div>
              <h3 className="text-xl font-bold">{getXpTitle()}</h3>
              <p className="text-sm text-muted-foreground">
                Level {level} • {expInLevel} / {expForNext} XP
              </p>
            </div>
          </div>
          <div className="w-full max-w-md flex-1 space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>Next Milestone: Level {level + 1}</span>
              <span className="text-primary">{xpToNext} XP to go</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${xpProgress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      {/* Weekly Chart Section */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h3 className="text-lg font-bold">Weekly Focus Hours</h3>
            <p className="text-sm text-muted-foreground">
              Hours spent in deep work per day
            </p>
          </div>
          <div className="flex gap-2">
            <button className="rounded-lg border border-border px-3 py-1.5 text-sm font-medium hover:bg-muted">
              Last Week
            </button>
            <button className="rounded-lg bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
              Current Week
            </button>
          </div>
        </div>

        {/* Custom HTML Chart */}
        <div className="flex h-64 items-end justify-between gap-2 px-0 sm:gap-4 sm:px-4">
          {chartDays.map((target, idx) => (
            <div
              key={idx}
              className="group flex h-full flex-1 flex-col items-center justify-end gap-3"
            >
              <div
                className={`w-full rounded-t-lg transition-all ${
                  target.active
                    ? "bg-primary shadow-lg shadow-primary/20"
                    : "bg-primary/20 hover:bg-primary dark:bg-primary/10"
                }`}
                style={{ height: target.height }}
              ></div>
              <span
                className={`text-xs font-bold ${
                  target.active
                    ? "text-primary"
                    : "text-muted-foreground"
                }`}
              >
                {target.label}
              </span>
            </div>
          ))}
        </div>

        {/* Chart Footer Stats */}
        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <div className="flex items-center gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Daily Avg
              </p>
              <p className="text-xl font-bold">{dailyAvgHours}h</p>
            </div>
            <div className="h-10 w-px bg-border"></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Best Day
              </p>
              <p className="text-xl font-bold">{bestDayLabel}</p>
            </div>
          </div>
          <button className="flex items-center gap-1 text-sm font-bold text-primary hover:underline">
            Export Data <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Recent Achievement Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-slate-900 p-8 text-white dark:bg-slate-950">
        <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/2 rounded-full bg-primary/20 blur-3xl"></div>
        <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="space-y-2">
            <span className="rounded-full border border-primary/40 bg-primary/30 px-3 py-1 text-xs font-bold uppercase tracking-widest text-[#a6a6ff]">
              Achievement Unlocked
            </span>
            <h4 className="text-2xl font-bold italic tracking-tight">
              The 5 AM Club
            </h4>
            <p className="text-slate-300">
              You've completed 5 sessions before 7 AM this week. Keep up the momentum!
            </p>
          </div>
          <div className="flex -space-x-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-900 bg-emerald-500 shadow-lg dark:border-slate-950">
              <Award className="h-6 w-6 text-white" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-900 bg-amber-500 shadow-lg dark:border-slate-950">
              <TrendingUp className="h-6 w-6 text-white" />
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full border-4 border-slate-900 bg-blue-500 shadow-lg dark:border-slate-950">
              <Rocket className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
