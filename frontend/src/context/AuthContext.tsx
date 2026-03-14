import React, { createContext, useContext, useEffect, useCallback } from "react"
import { ApiService } from "@/services/apiService"
import { useAuthStore } from "@/store/AuthStore"
import { migrateGuestData } from "@/lib/migration"
import type { AuthContextType, AuthUser } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAuthenticated, isLoading, login, signup, logout } = useAuthStore()

  const fetchUser = useCallback(async () => {
    try {
      const userData = await ApiService.getUser<AuthUser>()
      // For authenticated users, we enforce wait for migration/sync
      await migrateGuestData()
      useAuthStore.setState({ user: userData, isAuthenticated: true, isLoading: false })
    } catch (error) {
      // If fetching user fails, we are likely a guest or session expired
      useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  const refresh = useCallback(async () => {
    // Only set loading if we previously though we were authenticated (rehydration from storage)
    // Otherwise, let guests start immediately while we check in background
    const wasAuthenticated = useAuthStore.getState().isAuthenticated;
    if (wasAuthenticated) {
      useAuthStore.setState({ isLoading: true });
    }

    try {
      await ApiService.post("/auth/refresh", {})
      await fetchUser()
    } catch (error: any) {
      // Silently fail for 401s - user is a guest
      useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [fetchUser])

  useEffect(() => {
    ApiService.setupInterceptors(() => {
      useAuthStore.setState({ user: null, isAuthenticated: false })
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, signup, logout, refresh, fetchUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
