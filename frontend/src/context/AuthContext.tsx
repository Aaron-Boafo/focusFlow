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
      
      // Update auth state immediately
      useAuthStore.setState({ user: userData, isAuthenticated: true })
      
      // For authenticated users, we enforce wait for migration/sync
      await migrateGuestData()
      
      // Finally mark loading as over
      useAuthStore.setState({ isLoading: false })
    } catch (error) {
      // If fetching user fails, we are likely a guest or session expired
      useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
    }
  }, [])

  const refresh = useCallback(async () => {
    // Explicitly start loading
    useAuthStore.setState({ isLoading: true });

    try {
      // First try to refresh the session cookie
      await ApiService.post("/auth/refresh", {})
      // Then fetch the actual user data
      await fetchUser()
    } catch (error: any) {
      // If ANY part fails, we are definitely a guest
      useAuthStore.setState({ 
        user: null, 
        isAuthenticated: false,
        isLoading: false 
      })
    } finally {
      // Final guard to ensure we NEVER stay stuck in a loading state
      useAuthStore.setState({ isLoading: false });
    }
  }, [fetchUser])

  useEffect(() => {
    ApiService.setupInterceptors(() => {
      // CLEAR LOADING state here too, otherwise guards stay stuck in skeleton
      useAuthStore.setState({ user: null, isAuthenticated: false, isLoading: false })
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
