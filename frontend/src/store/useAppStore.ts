import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { AppState } from "@/types"

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
      
      updateUser: (data) =>
        set((state) => ({
          user: { ...state.user, ...data },
        })),
    }),
    {
      name: "focusflow-app-storage",
      version: 1
    }
  )
)
