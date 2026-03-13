import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppState } from "@/types"
import {
  initialKanbanTasks,
  initialTasks,
  initialProductivity,
} from "@/constants"

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: "Alex",
        plan: "Pro Plan",
        xpLevel: 12,
        xpTitle: "Focus Master",
        xpProgress: 65,
        xpToNext: 350,
      },
      stats: {
        tasksCompletedToday: 12,
        tasksTotalToday: 15,
        tasksGrowth: "+12%",
        sessions: 8,
        sessionsGrowth: "+4%",
        focusHours: 28.5,
        focusHoursGrowth: "+2.4h",
        streakDays: 5,
      },
      productivityData: initialProductivity,
      nextTasks: initialTasks,
      kanbanTasks: initialKanbanTasks,

      completeTask: (taskId) =>
        set((state) => ({
          nextTasks: state.nextTasks.map((t) =>
            t.id === taskId ? { ...t, completed: true } : t
          ),
          stats: {
            ...state.stats,
            tasksCompletedToday: state.stats.tasksCompletedToday + 1,
          },
        })),

      addFocusSession: (hours) =>
        set((state) => ({
          stats: {
            ...state.stats,
            sessions: state.stats.sessions + 1,
            focusHours: state.stats.focusHours + hours,
          },
        })),

      moveKanbanTask: (taskId, newStatus) =>
        set((state) => ({
          kanbanTasks: state.kanbanTasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          ),
        })),

      addKanbanTask: (task) =>
        set((state) => ({
          kanbanTasks: [
            ...state.kanbanTasks,
            { ...task, id: `k${Date.now()}` },
          ],
        })),
    }),
    {
      name: "focusflow-storage",
    }
  )
)
