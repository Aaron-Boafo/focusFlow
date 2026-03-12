import { create } from "zustand"
import { persist } from "zustand/middleware"

export type SessionStatus = "complete" | "ended" | "progress"
export type SessionType = "Focus" | "Short Break" | "Long Break"

export interface Session {
  id: string
  type: SessionType
  startTime: number // timestamp
  duration: number // total target in seconds
  elapsedTime: number // actual worked in seconds
  status: SessionStatus
  date: string // YYYY-MM-DD for grouping
}

interface ISessionStore {
  settings: {
    focus: number
    shortBreak: number
    longBreak: number
  }

  history: Session[]
  activeSessionId: string | null
  isPaused: boolean

  // Actions
  startSession: (type: SessionType, duration: number) => string
  updateSession: (id: string, elapsedTime: number, status: SessionStatus) => void
  completeSession: (id: string) => void
  endSession: (id: string) => void
  updateSettings: (settings: Partial<ISessionStore["settings"]>) => void
  
  setActiveSession: (id: string | null) => void
  setPaused: (paused: boolean) => void
  tick: () => void
  resetActiveSession: () => void
  getTodayStats: () => {
    focusHours: number
    streak: number
    rank: number
  }
}

export const SessionStore = create<ISessionStore>()(
  persist(
    (set, get) => ({
      settings: {
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
      },
      history: [],
      activeSessionId: null,
      isPaused: false,

      startSession: (type, duration) => {
        const id = Math.random().toString(36).substring(2, 9)
        const newSession: Session = {
          id,
          type,
          startTime: Date.now(),
          duration,
          elapsedTime: 0,
          status: "progress",
          date: new Date().toISOString().split("T")[0],
        }
        set((state) => ({ history: [...state.history, newSession] }))
        return id
      },

      updateSession: (id, elapsedTime, status) => {
        set((state) => ({
          history: state.history.map((s) =>
            s.id === id ? { ...s, elapsedTime, status } : s
          ),
        }))
      },

      completeSession: (id) => {
        set((state) => ({
          history: state.history.map((s) =>
            s.id === id ? { ...s, status: "complete", elapsedTime: s.duration } : s
          ),
        }))
      },

      endSession: (id) => {
        set((state) => ({
          history: state.history.map((s) =>
            s.id === id ? { ...s, status: "ended" } : s
          ),
        }))
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      setActiveSession: (id) => set({ activeSessionId: id }),
      
      setPaused: (paused) => set({ isPaused: paused }),

      tick: () => {
        const { activeSessionId, isPaused, history } = get()
        if (!activeSessionId || isPaused) return

        const session = history.find(s => s.id === activeSessionId)
        if (!session || session.status !== "progress") return

        const newElapsedTime = session.elapsedTime + 1
        const isComplete = newElapsedTime >= session.duration

        set((state) => ({
          history: state.history.map((s) =>
            s.id === activeSessionId
              ? { 
                  ...s, 
                  elapsedTime: newElapsedTime, 
                  status: isComplete ? "complete" : "progress" 
                }
              : s
          ),
          activeSessionId: isComplete ? null : state.activeSessionId
        }))
      },

      resetActiveSession: () => set({ activeSessionId: null, isPaused: false }),

      getTodayStats: () => {
        const today = new Date().toISOString().split("T")[0]
        const history = get().history
        const todaySessions = history.filter((s) => s.date === today)

        // Count actual focus time from all focus sessions today
        const focusSeconds = todaySessions
          .filter((s) => s.type === "Focus")
          .reduce((acc, s) => acc + s.elapsedTime, 0)

        const focusHours = parseFloat((focusSeconds / 3600).toFixed(1))

        // Streak is the number of COMPLETED focus sessions today
        const streak = todaySessions.filter(
          (s) => s.type === "Focus" && s.status === "complete"
        ).length

        // Simple rank logic: #50 - streak, floor at #1
        const rank = Math.max(1, 50 - streak * 2)

        return { focusHours, streak, rank }
      },
    }),
    {
      name: "focusFlow-session-storage",
    }
  )
)
