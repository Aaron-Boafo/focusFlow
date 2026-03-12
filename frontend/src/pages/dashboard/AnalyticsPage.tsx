import { useAppStore } from "@/store/useAppStore"
import {
  CheckCircle2,
  TrendingUp,
  Timer,
  Clock,
  Download,
  Award,
  Rocket,
} from "lucide-react"

export default function AnalyticsPage() {
  const { stats, user } = useAppStore()

  // For the dummy chart visual, we map days and heights
  const chartDays = [
    { label: "MON", height: "35%", active: false },
    { label: "TUE", height: "55%", active: false },
    { label: "WED", height: "45%", active: false },
    { label: "THU", height: "90%", active: true },
    { label: "FRI", height: "75%", active: false },
    { label: "SAT", height: "25%", active: false },
    { label: "SUN", height: "15%", active: false },
  ]

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
            <span className="flex items-center text-sm font-bold text-emerald-500">
              {stats.tasksGrowth} <TrendingUp className="ml-1 h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Tasks Completed
          </p>
          <p className="mt-1 text-3xl font-bold">{stats.tasksCompletedToday}</p>
        </div>

        {/* Focus Sessions */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Timer className="h-6 w-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-emerald-500">
              {stats.sessionsGrowth} <TrendingUp className="ml-1 h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Focus Sessions
          </p>
          <p className="mt-1 text-3xl font-bold">{stats.sessions}</p>
        </div>

        {/* Focus Hours */}
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-start justify-between">
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Clock className="h-6 w-6" />
            </div>
            <span className="flex items-center text-sm font-bold text-emerald-500">
              {stats.focusHoursGrowth} <TrendingUp className="ml-1 h-3.5 w-3.5" />
            </span>
          </div>
          <p className="text-sm font-medium text-muted-foreground">
            Total Focus Hours
          </p>
          <p className="mt-1 text-3xl font-bold">{stats.focusHours}h</p>
        </div>
      </div>

      {/* XP Progress Section */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-2xl font-black text-white shadow-lg shadow-primary/30">
              {user.xpLevel}
            </div>
            <div>
              <h3 className="text-xl font-bold">{user.xpTitle}</h3>
              <p className="text-sm text-muted-foreground">
                Level {user.xpLevel} • {user.xpProgress * 100} XP
              </p>
            </div>
          </div>
          <div className="w-full max-w-md flex-1 space-y-2">
            <div className="flex justify-between text-sm font-semibold">
              <span>Next Milestone: Level {user.xpLevel + 1}</span>
              <span className="text-primary">{user.xpToNext} XP to go</span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className="h-full rounded-full bg-primary transition-all duration-1000"
                style={{ width: `${user.xpProgress}%` }}
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
              <p className="text-xl font-bold">4.2h</p>
            </div>
            <div className="h-10 w-px bg-border"></div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Best Day
              </p>
              <p className="text-xl font-bold">Thu (7.5h)</p>
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
