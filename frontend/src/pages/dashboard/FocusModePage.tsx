import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { Settings, Pause, Play } from "lucide-react"

export default function FocusModePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addFocusSession } = useAppStore()

  // Extract initialization settings from URL
  const initialMinutes = parseInt(searchParams.get("minutes") || "25", 10)
  const sessionType = searchParams.get("type") || "Focus"

  const [timeLeft, setTimeLeft] = useState(initialMinutes * 60)
  const [isPaused, setIsPaused] = useState(false)

  // Derive minutes and seconds safely
  const m = Math.floor(timeLeft / 60)
  const s = timeLeft % 60

  useEffect(() => {
    if (isPaused || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSessionComplete()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, timeLeft])

  const handleSessionComplete = () => {
    // Only award stats if it was a deep focus session
    if (sessionType === "Focus") {
      const hours = initialMinutes / 60
      addFocusSession(hours)
    }
    // Return to the dashboard timer
    navigate("/timer")
  }

  const handleEndEarly = () => {
    navigate("/timer")
  }

  return (
    <div className="flex min-h-screen flex-col bg-[radial-gradient(circle_at_center,rgba(92,92,255,0.05)_0%,rgba(245,245,248,1)_100%)] font-sans text-slate-900 transition-colors duration-500 dark:bg-[radial-gradient(circle_at_center,rgba(92,92,255,0.1)_0%,rgba(15,15,35,1)_100%)] dark:text-slate-100">
      {/* Background Decoration */}
      <div className="pointer-events-none fixed left-0 top-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-primary/5 blur-3xl" />
      </div>

      {/* Top Navigation (Minimized) */}
      <nav className="absolute left-0 top-0 flex w-full items-center justify-between px-8 py-6">
        <div className="opacity-60 transition-opacity hover:opacity-100">
          <h2 className="text-lg font-bold tracking-tight">FocusFlow</h2>
        </div>
        <div>
          <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-primary/10 dark:text-slate-400">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Main Focus Area */}
      <main className="flex flex-1 flex-col items-center justify-center p-6">
        {/* Status Indicator */}
        <div className="mb-8 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary">
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
            <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
          </span>
          <span className="text-xs font-bold uppercase tracking-widest">
            {sessionType === "Focus" ? "Deep Work Session" : `${sessionType} Session`}
          </span>
        </div>

        {/* Elegant Countdown Timer */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4 flex items-center gap-4 md:gap-8">
            <div className="flex flex-col items-center">
              <span className="tabular-nums tracking-tighter text-8xl font-light text-shadow-[0_0_40px_rgba(92,92,255,0.15)] md:text-9xl">
                {String(m).padStart(2, "0")}
              </span>
              <span className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                Minutes
              </span>
            </div>
            <span className="pb-8 text-6xl font-thin text-primary/30 md:text-8xl">
              :
            </span>
            <div className="flex flex-col items-center">
              <span className="tabular-nums tracking-tighter text-8xl font-light text-shadow-[0_0_40px_rgba(92,92,255,0.15)] md:text-9xl">
                {String(s).padStart(2, "0")}
              </span>
              <span className="mt-2 text-xs font-medium uppercase tracking-[0.3em] text-slate-400">
                Seconds
              </span>
            </div>
          </div>
          <p
            className={`mt-8 text-xl font-light italic tracking-wide text-slate-500 dark:text-slate-400 ${
              !isPaused ? "animate-pulse" : ""
            }`}
          >
            {isPaused ? "Session paused" : "Stay in the flow."}
          </p>
        </div>

        {/* Minimal Interaction Controls */}
        <div className="mt-20 flex w-full max-w-xs flex-col items-center gap-6">
          <button
            onClick={() => setIsPaused(!isPaused)}
            className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
          >
            {isPaused ? <Play className="h-6 w-6" /> : <Pause className="h-6 w-6 fill-current" />}
            <span>{isPaused ? "Resume Session" : "Pause Session"}</span>
          </button>
          <button
            onClick={handleEndEarly}
            className="rounded-lg px-4 py-2 text-sm font-medium uppercase tracking-widest text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500 active:scale-95 dark:text-slate-500 dark:hover:bg-red-900/20 dark:hover:text-red-400"
          >
            End Session
          </button>
        </div>
      </main>

      {/* Footer Stats (Floating/Subtle) */}
      <footer className="pointer-events-none absolute bottom-8 flex w-full justify-center">
        <div className="flex gap-12 rounded-2xl border border-white/20 bg-white/40 px-8 py-4 backdrop-blur-md dark:border-slate-700/30 dark:bg-slate-800/40">
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium uppercase tracking-tighter text-slate-400">
              Current Task
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              Design System UI Architecture
            </span>
          </div>
          <div className="w-px bg-slate-200 dark:bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="text-xs font-medium uppercase tracking-tighter text-slate-400">
              Daily Goal
            </span>
            <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
              4 / 8 hours
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
