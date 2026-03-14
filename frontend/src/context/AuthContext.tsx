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
    // Always check on mount
    useAuthStore.setState({ isLoading: true });

    try {
      await ApiService.post("/auth/refresh", {})
      await fetchUser()
    } catch (error: any) {
      // If we are not authenticated (401), ensure state is cleared
      useAuthStore.setState({ 
        user: null, 
        isAuthenticated: false, 
        isLoading: false 
      })
    } finally {
      // Ensure loading is always cleared even if fetchUser didn't catch it
      useAuthStore.setState({ isLoading: false });
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
