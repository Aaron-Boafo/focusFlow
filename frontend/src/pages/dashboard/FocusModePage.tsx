import { useEffect, useMemo, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import { SessionStore, type SessionType } from "@/store/SessionStore"
import { Settings, Pause, Play, AlertCircle, CheckCircle2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"

export default function FocusModePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { addFocusSession } = useAppStore()
  const [isEnding, setIsEnding] = useState(false)

  const activeSessionId = SessionStore((state) => state.activeSessionId)
  const history = SessionStore((state) => state.history)
  const isPaused = SessionStore((state) => state.isPaused)
  const setPaused = SessionStore((state) => state.setPaused)
  const startSession = SessionStore((state) => state.startSession)
  const completeSession = SessionStore((state) => state.completeSession)
  const endSession = SessionStore((state) => state.endSession)
  const setActiveSession = SessionStore((state) => state.setActiveSession)

  // Extract initialization settings from URL
  const initialMinutes = useMemo(
    () => parseInt(searchParams.get("minutes") || "25", 10),
    [searchParams]
  )
  const sessionType = useMemo(
    () => (searchParams.get("type") || "Focus") as SessionType,
    [searchParams]
  )

  const activeSession = history.find((s) => s.id === activeSessionId)

  // Initialize session if not present
  useEffect(() => {
    if (!activeSessionId && !isEnding) {
      const id = startSession(sessionType, initialMinutes * 60)
      setActiveSession(id)
    }
  }, [
    activeSessionId,
    startSession,
    setActiveSession,
    sessionType,
    initialMinutes,
    isEnding,
  ])

  // Prevent timer jump by locking timeLeft when ending
  const timeLeft = useMemo(() => {
    if (activeSession && (activeSession.status === "complete" || activeSession.status === "ended")) {
      return 0
    }
    if (activeSession && !isEnding) {
      return activeSession.duration - activeSession.elapsedTime
    }
    if (isEnding) return 0
    return initialMinutes * 60
  }, [activeSession, isEnding, initialMinutes])

  // Derive minutes and seconds safely
  const m = Math.floor(Math.max(0, timeLeft) / 60)
  const s = Math.max(0, timeLeft) % 60

  useEffect(() => {
    if (activeSession && activeSession.status === "complete" && !isEnding) {
      handleSessionComplete()
    }
  }, [activeSession?.status, isEnding])

  const handleSessionComplete = () => {
    setIsEnding(true)
    // Only award stats if it was a deep focus session
    if (sessionType === "Focus") {
      const hours = initialMinutes / 60
      addFocusSession(hours)
    }

    if (activeSessionId) {
      completeSession(activeSessionId)
    }

    // Return to the dashboard timer
    setTimeout(() => navigate("/timer"), 500)
  }

  const handleEndEarly = () => {
    if (activeSessionId) {
      setIsEnding(true)
      endSession(activeSessionId)
      toast.success("Session ended early. Progress saved.")
      setTimeout(() => navigate("/timer"), 500)
    }
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[radial-gradient(circle_at_center,rgba(92,92,255,0.05)_10%,rgba(245,245,248,1)_100%)] font-sans text-slate-900 transition-colors duration-500 dark:bg-[radial-gradient(circle_at_center,rgba(92,92,255,0.1)_10%,rgba(15,15,35,1)_100%)] dark:text-slate-100">
      {/* Background Decoration */}
      <div className="pointer-events-none fixed top-0 left-0 -z-10 h-full w-full overflow-hidden">
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-primary/5 opacity-50 blur-3xl md:opacity-100" />
        <div className="absolute -right-24 -bottom-24 h-96 w-96 rounded-full bg-primary/5 opacity-50 blur-3xl md:opacity-100" />
      </div>

      {/* Top Header - Fixed/Sticky in Flex flow */}
      <nav className="z-20 flex w-full flex-none items-center justify-between border-b border-white/10 bg-white/10 px-6 py-3 backdrop-blur-3xl md:px-8 dark:border-slate-800/10 dark:bg-slate-900/10">
        <div className="opacity-60 transition-opacity hover:opacity-100">
          <h2 className="text-lg font-bold tracking-tight">FocusFlow</h2>
        </div>
        <div>
          <button className="rounded-full p-2 text-slate-500 transition-colors hover:bg-primary/10 dark:text-slate-400">
            <Settings className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Main Focus Area - Scrollable */}
      <main className="scrollbar-hide flex-1 overflow-y-auto px-6 py-12">
        <div className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center">
          {/* Status Indicator */}
          <div className="mb-6 flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-primary">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
            </span>
            <span className="text-xs font-bold tracking-widest uppercase">
              {sessionType === "Focus"
                ? "Deep Work Session"
                : `${sessionType} Session`}
            </span>
          </div>

          {/* Contextual Alert */}
          {isPaused && !isEnding && (
            <Alert className="mb-8 border-yellow-500/20 bg-yellow-500/10 text-yellow-600 dark:text-yellow-400">
              <AlertCircle className="h-4 w-4" stroke="currentColor" />
              <AlertTitle className="text-xs font-bold">Session Paused</AlertTitle>
              <AlertDescription className="text-[10px] opacity-80">
                The clock has stopped. Resume whenever you're ready to continue.
              </AlertDescription>
            </Alert>
          )}

          {isEnding && (
            <Alert className="mb-8 border-green-500/20 bg-green-500/10 text-green-600 dark:text-green-400">
              <CheckCircle2 className="h-4 w-4" stroke="currentColor" />
              <AlertTitle className="text-xs font-bold">Session Finalized</AlertTitle>
              <AlertDescription className="text-[10px] opacity-80">
                Saving your progress and returning to dashboard...
              </AlertDescription>
            </Alert>
          )}

          {/* Elegant Countdown Timer */}
          <div className="flex flex-col items-center text-center">
            <div className="mb-4 flex items-center gap-4 md:gap-8">
              <div className="flex flex-col items-center px-2">
                <span className="text-7xl font-light tracking-tighter tabular-nums text-shadow-[0_0_40px_rgba(92,92,255,0.15)] md:text-9xl">
                  {String(m).padStart(2, "0")}
                </span>
                <span className="mt-2 text-xs font-medium tracking-[0.3em] text-slate-400 uppercase">
                  Minutes
                </span>
              </div>
              <span className="pb-8 text-5xl font-thin text-primary/30 md:text-8xl">
                :
              </span>
              <div className="flex flex-col items-center px-2">
                <span className="text-7xl font-light tracking-tighter tabular-nums text-shadow-[0_0_40px_rgba(92,92,255,0.15)] md:text-9xl">
                  {String(s).padStart(2, "0")}
                </span>
                <span className="mt-2 text-xs font-medium tracking-[0.3em] text-slate-400 uppercase">
                  Seconds
                </span>
              </div>
            </div>
            <p
              className={`mt-4 text-lg font-light tracking-wide text-slate-500 italic md:text-xl dark:text-slate-400 ${
                !isPaused ? "animate-pulse" : ""
              }`}
            >
              {isPaused ? "Session paused" : "Stay in the flow."}
            </p>
          </div>

          {/* Minimal Interaction Controls */}
          <div className="mt-12 flex w-full max-w-xs flex-col items-center gap-4 md:mt-16">
            <button
              onClick={() => setPaused(!isPaused)}
              className="group flex w-full items-center justify-center gap-3 rounded-xl bg-primary py-4 text-lg font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 active:scale-95"
            >
              {isPaused ? (
                <Play className="h-6 w-6" />
              ) : (
                <Pause className="h-6 w-6 fill-current" />
              )}
              <span>{isPaused ? "Resume Session" : "Pause Session"}</span>
            </button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <button className="rounded-lg px-4 py-2 text-sm font-medium tracking-widest text-slate-400 uppercase transition-colors hover:bg-red-50 hover:text-red-500 active:scale-95 dark:text-slate-500 dark:hover:bg-red-900/20 dark:hover:text-red-400">
                  End Session
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm">
                <AlertDialogHeader>
                  <AlertDialogTitle>End session early?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Your progress up to this point will be saved. You can always start a new session later.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel onClick={() => toast("Great choice! Keep your focus going.")}>
                    Keep going
                  </AlertDialogCancel>
                  <AlertDialogAction onClick={handleEndEarly} className="bg-red-500 hover:bg-red-600 text-white dark:bg-red-600 dark:hover:bg-red-700">
                    End Session
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </main>

      {/* Footer Stats - Fixed/Sticky in Flex flow */}
      <footer className="z-20 flex w-full flex-none justify-center border-t border-white/10 bg-white/10 px-4 py-6 backdrop-blur-md dark:border-slate-800/10 dark:bg-slate-900/10">
        <div className="flex flex-wrap justify-center gap-6 rounded-2xl border border-white/20 bg-white/40 px-6 py-3 backdrop-blur-md md:gap-12 dark:border-slate-700/30 dark:bg-slate-800/40">
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-medium tracking-tighter text-slate-400 uppercase md:text-xs">
              Current Task
            </span>
            <span className="text-xs font-semibold text-slate-700 md:text-sm dark:text-slate-200">
              Design System UI Architecture
            </span>
          </div>
          <div className="hidden w-px bg-slate-200 md:block dark:bg-slate-700"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] font-medium tracking-tighter text-slate-400 uppercase md:text-xs">
              Daily Goal
            </span>
            <span className="text-xs font-semibold text-slate-700 md:text-sm dark:text-slate-200">
              4 / 8 hours
            </span>
          </div>
        </div>
      </footer>
    </div>
  )
}
