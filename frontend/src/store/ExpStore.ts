import { create } from "zustand"
import { persist } from "zustand/middleware"

interface IExpStore {
  totalExp: number
  level: number
  addExp: (amount: number) => void
  getExpForNextLevel: (currentLevel: number) => number
  getExpSinceLastLevel: () => number
  getXpTitle: () => string
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

      addExp: (amount) => {
        set((state) => {
          const newExp = Math.max(0, state.totalExp + amount)
          const newLevel = calculateLevelFromExp(newExp)
          return { totalExp: newExp, level: newLevel }
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
      }
    }),
    {
      name: "focusFlow-exp-storage",
    }
  )
)
