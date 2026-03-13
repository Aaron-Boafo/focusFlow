import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { IAuthStore } from "@/types"
import { migrateGuestData } from "@/lib/migration"

export const useAuthStore = create<IAuthStore>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,

      login: async (email, _pass) => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        // Mock successful login
        const mockUser = {
          id: crypto.randomUUID(),
          email,
          name: email.split("@")[0].charAt(0).toUpperCase() + email.split("@")[0].slice(1),
        }
        
        set({ 
          user: mockUser, 
          isAuthenticated: true, 
          isLoading: false 
        })

        // Trigger migration
        await migrateGuestData()
      },

      signup: async (name, email, _pass) => {
        set({ isLoading: true })
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1500))
        
        const mockUser = {
          id: crypto.randomUUID(),
          email,
          name,
        }
        
        set({ 
          user: mockUser, 
          isAuthenticated: true, 
          isLoading: false 
        })

        // Trigger migration
        await migrateGuestData()
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
        // Note: Strategy will switch back to local on next access
      },

      skipToDemo: () => {
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: "focusflow-auth-storage",
      version: 1,
    }
  )
)
