import { create } from "zustand"
import { ApiService } from "@/services/apiService"
import type { ILeaderboardStore, LeaderboardEntry } from "@/types"
import { toast } from "sonner"

export const useLeaderboardStore = create<ILeaderboardStore>((set, get) => ({
  entries: [],
  isLoading: false,
  filter: "Weekly",

  fetchLeaderboard: async () => {
    set({ isLoading: true })
    try {
      const response = await ApiService.get<{ data: LeaderboardEntry[] }>(
        "/leaderboard"
      )
      set({ entries: response.data })
    } catch (error: any) {
      console.error("Failed to fetch leaderboard:", error)
      toast.error("Failed to load leaderboard rankings")
    } finally {
      set({ isLoading: false })
    }
  },

  setFilter: (filter) => {
    set({ filter })
    get().fetchLeaderboard()
  },
}))
