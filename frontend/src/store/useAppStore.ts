import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import type { AppState } from "@/types"
import { createZustandStorage } from "@/services/storageService"

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
      storage: createJSONStorage(() => createZustandStorage()),
      version: 1
    }
  )
)
