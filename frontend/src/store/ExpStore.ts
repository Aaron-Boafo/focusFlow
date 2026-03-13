import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { createZustandStorage } from "@/services/storageService"
import type { IExpStore } from "@/types"

// Logic: Level n -> Level n+1 requires 100 + (n-1)*20 XP.
function getExpRequiredForLevel(levelTarget: number) {
  // sum from i=1 to levelTarget-1 of (100 + (i-1)*20)
  // this is the total absolute XP needed to *reach* levelTarget from 0
  if (levelTarget <= 1) return 0
  let total = 0
  for (let i = 1; i < levelTarget; i++) {
    total += 100 + (i - 1) * 20
  }
  return total
}

function calculateLevelFromExp(exp: number) {
  let tempLevel = 1
  while (true) {
    const nextLevelReq = getExpRequiredForLevel(tempLevel + 1)
    if (exp >= nextLevelReq) {
      tempLevel++
    } else {
      return tempLevel
    }
  }
}

export const useExpStore = create<IExpStore>()(
  persist(
    (set, get) => ({
      totalExp: 0,
      level: 1,
      isLoading: true,
      streak: 0,
      dailyGoal: 100,
      history: {},

      addExp: (amount) => {
        const today = new Date().toISOString().split("T")[0]
        
        set((state) => {
          const newExp = Math.max(0, state.totalExp + amount)
          const newLevel = calculateLevelFromExp(newExp)
          
          const newHistory = { ...state.history }
          newHistory[today] = (newHistory[today] || 0) + amount
          
          // Calculate streak
          let currentStreak = 0
          let checkDate = new Date()
          
          while (true) {
            const dateStr = checkDate.toISOString().split("T")[0]
            if ((newHistory[dateStr] || 0) >= state.dailyGoal) {
              currentStreak++
              checkDate.setDate(checkDate.getDate() - 1)
            } else {
              if (dateStr === today) {
                checkDate.setDate(checkDate.getDate() - 1)
                const yesterdayStr = checkDate.toISOString().split("T")[0]
                if ((newHistory[yesterdayStr] || 0) < state.dailyGoal) {
                  break
                }
              } else {
                break
              }
            }
          }

          return { 
            totalExp: newExp, 
            level: newLevel, 
            history: newHistory,
            streak: currentStreak
          }
        })
      },

      getExpForNextLevel: (currentLevel) => {
        return 100 + (currentLevel - 1) * 20
      },

      getExpSinceLastLevel: () => {
        const { totalExp, level } = get()
        const expReqForCurrentLevel = getExpRequiredForLevel(level)
        return totalExp - expReqForCurrentLevel
      },
      
      getXpTitle: () => {
        const { level } = get()
        if (level < 5) return "Novice Focuser"
        if (level < 10) return "Deep Worker"
        if (level < 20) return "Focus Master"
        if (level < 35) return "Zen Archer"
        if (level < 50) return "Time Lord"
        return "Ultimate Productivity Sage"
      },

      getWeeklyStatus: () => {
        const { history, dailyGoal } = get()
        const today = new Date()
        return Array.from({ length: 7 }, (_, i) => {
          const d = new Date(today)
          d.setDate(today.getDate() - (6 - i))
          const dateStr = d.toISOString().split("T")[0]
          return (history[dateStr] || 0) >= dailyGoal
        })
      }
    }),
    {
      name: "focusflow-exp-storage",
      storage: createJSONStorage(() => createZustandStorage()),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) state.isLoading = false
      }
    }
  )
)
