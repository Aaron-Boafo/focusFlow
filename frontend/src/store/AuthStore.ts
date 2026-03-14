import { create } from "zustand"
import { persist } from "zustand/middleware"
import { ApiService } from "@/services/apiService"
import type { IAuthStore, AuthResponse } from "@/types"
import { migrateGuestData } from "@/lib/migration"

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, password) => {
        set({ isLoading: true })
        try {
          const response = await ApiService.post<AuthResponse>("/auth/login", { email, password })
          
          // Set authentication state immediately so migration knows we are authenticated
          set({ 
            user: response.user, 
            isAuthenticated: true 
          })

          // Trigger migration and sync
          await migrateGuestData()

          // Mark as done loading
          set({ isLoading: false })
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || "Login failed")
        }
      },

      signup: async (name, email, password) => {
        set({ isLoading: true })
        try {
          await ApiService.post<{ status: string }>("/auth/signup", { displayName: name, email, password })
          // After signup, we log them in
          await get().login(email, password)
        } catch (error: any) {
          set({ isLoading: false })
          throw new Error(error.response?.data?.message || "Signup failed")
        }
      },

      logout: async () => {
        try {
          await ApiService.post("/auth/logout", {})
        } catch (err) {
          console.error("Logout error:", err)
        }
        set({ user: null, isAuthenticated: false })
      },

      skipToDemo: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: "focusflow-auth-storage",
      version: 1,
      partialize: (state) => ({ 
        user: state.user,
      }),
    }
  )
)
