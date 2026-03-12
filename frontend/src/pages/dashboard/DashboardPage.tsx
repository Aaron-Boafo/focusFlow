import { useAppStore } from "@/store/useAppStore"
import { Button } from "@/components/ui/button"
import { WeeklyProductivityChart } from "@/components/dashboard/WeeklyProductivityChart"
import {
  Play,
  Plus,
  CheckCircle2,
  Timer,
  Clock,
  Medal,
  Check,
} from "lucide-react"

export default function OverviewPage() {
  const { user, stats, nextTasks, completeTask, addFocusSession } = useAppStore()

  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 md:p-8">
      {/* Welcome & Quick Actions */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-2xl font-bold">Good morning, {user.name}!</h3>
          <p className="text-muted-foreground">Ready to crush your goals today?</p>
        </div>
        <div className="flex gap-3">
          <Button
            onClick={() => addFocusSession(1.5)} // Demo adding a session
            className="gap-2 rounded-xl px-6 py-6 font-bold shadow-xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Play className="h-5 w-5" />
            Start Focus Session
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="rounded-xl h-12 w-12 bg-card hover:bg-muted"
          >
            <Plus className="h-6 w-6 text-muted-foreground" />
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
                  {stats.tasksGrowth}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Tasks Completed Today
              </p>
              <p className="mt-1 text-3xl font-bold">
                {stats.tasksCompletedToday}{" "}
                <span className="text-lg font-normal text-muted-foreground">
                  / {stats.tasksTotalToday}
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
                  {stats.sessionsGrowth}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Focus Sessions
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.sessions}</p>
            </div>

            {/* Hours Stats */}
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <div className="rounded-lg bg-orange-500/10 p-2 text-orange-500">
                  <Clock className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-orange-500/10 px-2 py-1 text-xs font-bold text-orange-500">
                  {stats.focusHoursGrowth}
                </span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                Total Focus Hours
              </p>
              <p className="mt-1 text-3xl font-bold">{stats.focusHours.toFixed(1)}</p>
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
                <h4 className="text-lg font-bold">XP Level {user.xpLevel}</h4>
                <p className="text-sm text-white/70">{user.xpTitle}</p>
              </div>
              <Medal className="h-10 w-10 opacity-50" />
            </div>
            <div className="space-y-4">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{user.xpProgress}%</span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)] transition-all duration-1000"
                  style={{ width: `${user.xpProgress}%` }}
                />
              </div>
              <p className="text-center text-xs text-white/80">
                {user.xpToNext} XP more to reach Level {user.xpLevel + 1}
              </p>
            </div>
          </div>

          {/* Daily Tasks Quick View */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h4 className="font-bold">Next Tasks</h4>
              <a href="#" className="text-xs font-bold text-primary hover:underline">
                View All
              </a>
            </div>
            <div className="space-y-4">
              {nextTasks.map((task) => (
                <div key={task.id} className="group flex items-center gap-4">
                  <button
                    onClick={() => completeTask(task.id)}
                    disabled={task.completed}
                    className={`flex h-6 w-6 items-center justify-center rounded-md border-2 transition-colors ${
                      task.completed
                        ? "border-primary bg-primary"
                        : "border-border hover:border-primary"
                    }`}
                  >
                    <Check
                      className={`h-4 w-4 text-white ${
                        task.completed ? "block" : "hidden group-hover:block group-hover:text-primary"
                      }`}
                    />
                  </button>
                  <div className={`flex-1 ${task.completed ? "opacity-50 line-through" : ""}`}>
                    <p className="text-sm font-semibold">{task.title}</p>
                    <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                      {task.category}
                    </p>
                  </div>
                  <span className="rounded bg-muted px-2 py-1 text-[10px] text-muted-foreground">
                    {task.time}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Reward Card */}
          <div className="group relative overflow-hidden rounded-2xl bg-slate-900 p-6 dark:bg-slate-800">
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/20 blur-3xl" />
            <div className="relative z-10">
              <h5 className="mb-2 font-bold text-white">Daily Streak! 🔥</h5>
              <p className="mb-4 text-sm text-slate-400">
                You've hit your focus goal for {stats.streakDays} days in a row.
              </p>
              <div className="flex gap-2">
                {["M", "T", "W", "T", "F", "S", "S"].map((day, idx) => (
                  <div
                    key={idx}
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                      idx < stats.streakDays
                        ? "bg-primary text-white"
                        : "bg-slate-700 text-slate-500"
                    }`}
                  >
                    {day}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
