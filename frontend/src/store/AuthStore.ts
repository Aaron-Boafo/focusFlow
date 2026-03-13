import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { IAuthStore } from "@/types"

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
      },

      logout: () => {
        set({ user: null, isAuthenticated: false })
      },

      skipToDemo: () => {
        // Just set a flag or just do nothing - the navigation is handled in the component
        // But we could set a "temp" guest state if needed
        set({ isAuthenticated: false, user: null })
      },
    }),
    {
      name: "focusflow-auth-storage",
      version: 1
    }
  )
)
