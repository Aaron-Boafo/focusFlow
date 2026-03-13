import React, { createContext, useContext, useEffect, useState, useCallback } from "react"
import { ApiService } from "@/services/apiService"
import type { AuthUser, AuthContextType, AuthResponse } from "@/types"

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const fetchUser = useCallback(async () => {
    try {
      const data = await ApiService.getUser<AuthUser>()
      setUser(data)
      setIsAuthenticated(true)
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }, [])

  const refresh = useCallback(async () => {
    try {
      await ApiService.post("/auth/refresh", {})
      await fetchUser()
    } catch (error) {
      setUser(null)
      setIsAuthenticated(false)
      setIsLoading(false)
    }
  }, [fetchUser])

  useEffect(() => {
    ApiService.setupInterceptors(() => {
      setUser(null)
      setIsAuthenticated(false)
    })
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const login = async (email: string, pass: string) => {
    setIsLoading(true)
    try {
      await ApiService.post<AuthResponse>("/auth/login", { email, password: pass })
      await fetchUser()
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const signup = async (name: string, email: string, pass: string) => {
    setIsLoading(true)
    try {
      await ApiService.post<AuthResponse>("/auth/signup", { name, email, password: pass })
      await fetchUser()
    } catch (error) {
      throw error
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      await ApiService.post("/auth/logout", {})
    } catch (error) {
      console.error("Logout failed", error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
    }
  }

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
