import { Button } from "@/components/ui/button"
import { useNavigate, Link } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { useProjectStore } from "@/store/ProjectStore"
import { useExpStore } from "@/store/ExpStore"
import { SessionStore } from "@/store/SessionStore"
import { WeeklyProductivityChart } from "@/components/dashboard/WeeklyProductivityChart"
import { Play, CheckCircle2, Timer, Clock, Medal, Layers } from "lucide-react"
import DynamicIcon from "@/components/ui/DynamicIcon"
import { DashboardSkeleton } from "@/components/skeletons/DashboardSkeleton"

export default function OverviewPage() {
  const navigate = useNavigate()
  const { user, isLoading: appLoading } = useAppStore()
  const { projects, isLoading: projectsLoading } = useProjectStore()
  const { isLoading: expLoading } = useExpStore()
  const { isLoading: sessionLoading } = SessionStore()

  if (appLoading || projectsLoading || expLoading || sessionLoading) {
    return <DashboardSkeleton />
  }

  const upcomingProjects = projects
    .filter((p) => p.status !== "Completed")
    .slice(0, 3)
  const {
    level,
    getExpForNextLevel,
    getExpSinceLastLevel,
    getXpTitle,
    streak,
    getWeeklyStatus,
  } = useExpStore()
  const { getTodayStats } = SessionStore()
  const sessionStats = getTodayStats()
  const weeklyStatus = getWeeklyStatus()

  // Calculate live task stats from ProjectStore
  const allTasks = projects.flatMap((p) => p.tasks)
  const tasksCompletedToday = allTasks.filter((t) => t.status === "Done").length
  const totalTasksToday = allTasks.length

  // Calculate Task Growth (Live)
  const today = new Date().toISOString().split("T")[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]
  const completedTodayCount = allTasks.filter(
    (t) => t.status === "Done" && t.completedAt?.startsWith(today)
  ).length
  const completedYesterdayCount = allTasks.filter(
    (t) => t.status === "Done" && t.completedAt?.startsWith(yesterday)
  ).length

  const tasksGrowth = (() => {
    if (completedYesterdayCount === 0)
      return completedTodayCount > 0 ? "+100%" : "0%"
    const growth = Math.round(
      ((completedTodayCount - completedYesterdayCount) /
        completedYesterdayCount) *
        100
    )
    return (growth >= 0 ? "+" : "") + growth + "%"
  })()

  // Calculate XP progress
  const expInLevel = getExpSinceLastLevel()
  const expForNext = getExpForNextLevel(level)
  const xpProgress = Math.round((expInLevel / expForNext) * 100)
  const xpToNext = expForNext - expInLevel

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold">Good morning, {user.name}!</h3>
          <p className="text-muted-foreground">
            Ready to crush your goals today?
          </p>
        </div>
        <div className="flex">
          <Button
            onClick={() => navigate("/timer")}
            className="gap-2 rounded-xl px-6 py-6 font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="h-5 w-5" />
            Start Focus Session
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Stats Column */}
        <div className="space-y-8 lg:col-span-2">
          {/* Progress Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {/* Task Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-green-500/10 p-2 text-green-500">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-green-500/10 px-2 py-1 text-xs font-bold text-green-500">
                  {tasksGrowth}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Tasks Completed (All Time)
              </p>
              <p className="mt-1 text-3xl font-bold">
                {tasksCompletedToday}{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  / {totalTasksToday}
                </span>
              </p>
            </div>

            {/* Session Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-primary/10 p-2 text-primary">
                  <Timer className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-primary/10 px-2 py-1 text-xs font-bold text-primary">
                  {sessionStats?.sessionsGrowth || "0%"}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Focus Sessions (Today)
              </p>
              <p className="mt-1 text-3xl font-bold">
                {sessionStats?.streak || 0}
              </p>
            </div>

            {/* Hours Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-500">
                  {sessionStats?.focusHoursGrowth || "0%"}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Focus Hours
              </p>
              <p className="mt-1 text-3xl font-bold">
                {sessionStats.focusHours.toFixed(1)}
              </p>
            </div>
          </div>

          {/* Weekly Productivity Graph */}
          <WeeklyProductivityChart />
        </div>

        {/* Right Column */}
        <div className="space-y-8">
          {/* XP Level Widget */}
          <div className="rounded-2xl bg-linear-to-br from-primary to-blue-600 p-8 text-white shadow-xl shadow-primary/20">
            <div className="mb-6 flex items-start justify-between">
              <div>
                <h4 className="text-lg font-bold">XP Level {level}</h4>
                <p className="text-sm text-white/70">{getXpTitle()}</p>
              </div>
              <Medal className="h-10 w-10 opacity-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{xpProgress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-white/80">
                {xpToNext} XP more to reach Level {level + 1}
              </p>
            </div>
          </div>

          {/* Upcoming Projects Quick View */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-bold">Active Projects</h4>
              <Link
                to="/tasks"
                className="text-xs font-bold text-primary hover:underline"
              >
                View All
              </Link>
            </div>
            <div className="space-y-4">
              {upcomingProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-2 py-8 text-center">
                  <Layers className="h-8 w-8 text-muted-foreground/30" />
                  <p className="text-sm font-medium text-muted-foreground">
                    No active projects
                  </p>
                  <Link
                    to="/tasks"
                    className="text-xs text-primary hover:underline"
                  >
                    Create your first project
                  </Link>
                </div>
              ) : (
                upcomingProjects.map((project) => (
                  <Link
                    key={project.id}
                    to={`/tasks/${project.id}`}
                    className="group flex items-center gap-3 rounded-xl p-2 transition-colors hover:bg-muted/60"
                  >
                    {/* Icon */}
                    <div
                      className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${project.iconBg} ${project.iconColor}`}
                    >
                      <DynamicIcon name={project.icon} size={18} />
                    </div>
                    {/* Details */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold">
                        {project.title}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <div className="h-1.5 flex-1 rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary transition-all"
                            style={{ width: `${project.progress}%` }}
                          />
                        </div>
                        <span className="shrink-0 text-[10px] font-bold text-muted-foreground">
                          {project.progress}%
                        </span>
                      </div>
                    </div>
                    {/* Tasks left badge */}
                    <span className="shrink-0 rounded-full bg-muted px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
                      {project.tasksLeft} left
                    </span>
                  </Link>
                ))
              )}
            </div>
          </div>

          {/* Reward Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-6 dark:bg-slate-800">
            <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10">
              <h5 className="mb-2 font-bold text-white">Daily Streak! 🔥</h5>
              <p className="mb-4 text-sm text-slate-400">
                You've hit your daily goal for {streak} days in a row.
              </p>
              <div className="flex gap-2">
                {weeklyStatus.map((completed, idx) => {
                  const d = new Date()
                  d.setDate(d.getDate() - (6 - idx))
                  const dayLabel = d.toLocaleDateString("en-US", {
                    weekday: "narrow",
                  })
                  return (
                    <div
                      key={idx}
                      className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                        completed
                          ? "bg-primary text-white"
                          : "bg-slate-700 text-slate-500"
                      }`}
                    >
                      {dayLabel}
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
