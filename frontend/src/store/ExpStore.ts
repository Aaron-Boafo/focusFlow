import { create } from "zustand"
import { persist } from "zustand/middleware"

interface IExpStore {
  totalExp: number
  level: number
  addExp: (amount: number) => void
  getExpForNextLevel: (currentLevel: number) => number
  getExpSinceLastLevel: () => number
  getXpTitle: () => string
  streak: number
  dailyGoal: number
  history: Record<string, number> // date -> xp
  getWeeklyStatus: () => boolean[] // last 7 days
}

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
          
          // If we haven't hit today's goal yet, we check from yesterday backwards
          // But if we HAVE hit today's goal, we include today.
          // For simplicity, we'll count how many consecutive days have ANY XP or hit a goal?
          // Let's go with "Days with >= dailyGoal XP"
          
          while (true) {
            const dateStr = checkDate.toISOString().split("T")[0]
            if ((newHistory[dateStr] || 0) >= state.dailyGoal) {
              currentStreak++
              checkDate.setDate(checkDate.getDate() - 1)
            } else {
              // Special case: if today is not yet complete, the streak shouldn't break 
              // UNLESS yesterday was also not complete.
              if (dateStr === today) {
                // Today not yet complete, check yesterday
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

      // Returns the delta XP needed *for this specific level tier* 
      // i.e., at Level N, how much XP from start of Level N to Level N+1
      getExpForNextLevel: (currentLevel) => {
        return 100 + (currentLevel - 1) * 20
      },

      // Returns how much XP the user has earned *since hitting their current level*
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
      name: "focusFlow-exp-storage",
    }
  )
)
