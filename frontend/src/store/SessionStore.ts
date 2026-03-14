import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { createZustandStorage } from "@/services/storageService"
import { SessionService } from "@/services/sessionService"
import { timerSyncService } from "@/services/timerSyncService"
import type { ISessionStore, Session } from "@/types"
import { useAuthStore } from "./AuthStore"

export const SessionStore = create<ISessionStore>()(
  persist(
    (set, get) => ({
      settings: {
        focus: 25 * 60,
        shortBreak: 5 * 60,
        longBreak: 15 * 60,
        desktopNotifications: true,
        autoStartBreaks: false,
      },
      history: [],
      activeSessionId: null,
      isPaused: false,
      isLoading: true,

      startSession: (type, duration) => {
        const id = crypto.randomUUID()
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
        
        // Claim leadership when starting a session
        timerSyncService.becomeLeader()

        if (useAuthStore.getState().isAuthenticated) {
          SessionService.createSession(newSession).catch(err => console.error("Sync error:", err))
        }
        
        return id
      },

      updateSession: (id, elapsedTime, status) => {
        set((state) => ({
          history: state.history.map((s) =>
            s.id === id ? { ...s, elapsedTime, status } : s
          ),
        }))

        if (useAuthStore.getState().isAuthenticated) {
          SessionService.updateSession(id, { elapsedTime, status }).catch(err => console.error("Sync error:", err))
        }
      },

      completeSession: (id) => {
        set((state) => ({
          history: state.history.map((s) =>
            s.id === id ? { ...s, status: "complete", elapsedTime: s.duration } : s
          ),
          isPaused: false,
        }))
      },

      endSession: (id) => {
        set((state) => ({
          history: state.history.map((s) =>
            s.id === id ? { ...s, status: "ended" } : s
          ),
          isPaused: false,
        }))
      },

      updateSettings: (newSettings) => {
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        }))
      },

      setActiveSession: (id) => set({ activeSessionId: id }),

      setPaused: (paused) => {
        set({ isPaused: paused })
        const { activeSessionId, history } = get()
        if (activeSessionId && useAuthStore.getState().isAuthenticated) {
          const session = history.find(s => s.id === activeSessionId)
          if (session) {
             SessionService.updateSession(activeSessionId, { elapsedTime: session.elapsedTime, status: session.status })
               .catch(err => console.error("Sync error:", err))
          }
        }
      },

      tick: () => {
        const { activeSessionId, isPaused, history, settings } = get()
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
        }))

        // Broadcast current state to other tabs
        const updatedSession = get().history.find(s => s.id === activeSessionId)
        if (updatedSession) {
          timerSyncService.broadcastTick(activeSessionId, newElapsedTime, updatedSession.status)
        }

        // Handle Completion Side Effects (ONLY IF LEADER)
        if (isComplete && timerSyncService.getIsLeader()) {
          // 0. Award XP
          const xpEarned = Math.floor(session.duration / 60) // 1 XP per minute focused
          
          set((state) => ({
            history: state.history.map((s) =>
              s.id === activeSessionId ? { ...s, exp: xpEarned } : s
            )
          }))

          if (useAuthStore.getState().isAuthenticated) {
             SessionService.updateSession(activeSessionId, { status: "complete", elapsedTime: session.duration, exp: xpEarned })
               .catch(err => console.error("Sync error:", err))
          }
          
          import('./ExpStore').then(module => {
            module.useExpStore.getState().addExp(xpEarned)
          })

          // 1. Desktop Notifications
          if (settings.desktopNotifications && "Notification" in window) {
            if (Notification.permission === "granted") {
              const emoji = session.type === "Focus" ? "🎯" : "☕"
              new Notification(`Session Complete! ${emoji}`, {
                body: `Your ${session.type} session has finished.`,
                icon: "/favicon.ico",
              })
            }
          }

          // 2. Auto-start Breaks
          if (settings.autoStartBreaks && session.type === "Focus") {
            // Give a tiny delay so the UI can process the 'complete' state before switching
            setTimeout(() => {
              const newId = get().startSession("Short Break", settings.shortBreak)
              get().setActiveSession(newId)
            }, 1000)
          }
        }

        // Periodic Sync (Every 30 ticks)
        if (newElapsedTime % 30 === 0 && useAuthStore.getState().isAuthenticated) {
           SessionService.updateSession(activeSessionId, { elapsedTime: newElapsedTime, status: "progress" })
             .catch(err => console.error("Periodic sync error:", err))
        }
      },

      resetActiveSession: () => set({ activeSessionId: null, isPaused: false }),

      getTodayStats: () => {
        const history = get().history
        const today = new Date().toISOString().split("T")[0]
        
        // Setup yesterday's date for comparison
        const yesterdayDate = new Date()
        yesterdayDate.setDate(yesterdayDate.getDate() - 1)
        const yesterday = yesterdayDate.toISOString().split("T")[0]

        const todaySessions = history.filter((s) => s.date === today)
        const yesterdaySessions = history.filter((s) => s.date === yesterday)

        // Focus Hours Logic
        const focusSeconds = todaySessions
          .filter((s) => s.type === "Focus")
          .reduce((acc, s) => acc + s.elapsedTime, 0)
        
        const prevFocusSeconds = yesterdaySessions
          .filter((s) => s.type === "Focus")
          .reduce((acc, s) => acc + s.elapsedTime, 0)

        const focusHours = parseFloat((focusSeconds / 3600).toFixed(1))
        const prevFocusHours = parseFloat((prevFocusSeconds / 3600).toFixed(1))

        // Session Streak Logic (Sessions completed TODAY)
        const streak = todaySessions.filter(
          (s) => s.type === "Focus" && s.status === "complete"
        ).length
        
        const prevStreak = yesterdaySessions.filter(
          (s) => s.type === "Focus" && s.status === "complete"
        ).length

        // Helper for growth calculation
        const calculateGrowth = (current: number, previous: number) => {
          if (previous === 0) return current > 0 ? "+100%" : "0%"
          const growth = Math.round(((current - previous) / previous) * 100)
          return (growth >= 0 ? "+" : "") + growth + "%"
        }

        const diffHours = parseFloat((focusHours - prevFocusHours).toFixed(1))
        const sessionsGrowth = calculateGrowth(streak, prevStreak)
        const focusHoursGrowth = (diffHours >= 0 ? "+" : "") + diffHours + "h"
        const rank = Math.max(1, 50 - streak * 2)

        // Total Streak Days (Consecutive days with at least one completed session)
        const getStreakDays = () => {
          const completedDates = [...new Set(history
            .filter(s => s.type === "Focus" && s.status === "complete")
            .map(s => s.date))].sort().reverse()
          
          if (completedDates.length === 0) return 0
          
          let count = 0
          let currentCheck = new Date(today)
          
          for (const dateStr of completedDates) {
            const checkStr = currentCheck.toISOString().split("T")[0]
            if (dateStr === checkStr) {
              count++
              currentCheck.setDate(currentCheck.getDate() - 1)
            } else if (dateStr > checkStr) {
              continue // Just in case of future dates
            } else {
              break // Gap found
            }
          }
          return count
        }

        const totalStreakDays = getStreakDays()

        return { focusHours, streak, rank, sessionsGrowth, focusHoursGrowth, totalStreakDays }
      },

      syncWithCloud: async () => {
        const { history } = get()
        if (history.length > 0 && useAuthStore.getState().isAuthenticated) {
          try {
            await SessionService.syncSessions(history)
            console.log("Sessions synced with cloud successfully")
          } catch (error) {
            console.error("Failed to sync sessions with cloud:", error)
          }
        }
      },
    }),
    {
      name: "focusflow-session-storage",
      storage: createJSONStorage(() => createZustandStorage()),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false
      }
    }
  )
)
