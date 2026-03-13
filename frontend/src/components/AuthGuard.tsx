import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/AuthStore"

interface ProtectedRouteProps {
  allowGuest?: boolean
}

export const ProtectedRoute = ({ allowGuest = true }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuthStore()
  
  // Note: For this app, "Guest" mode is essentially when isAuthenticated is false 
  // but we are in the dashboard. If we want to strictly enforce "Logged In" 
  // for certain routes, we set allowGuest=false.
  
  if (!isAuthenticated && !allowGuest) {
    return <Navigate to="/auth" replace />
  }

  // Dashboard is allowed for guests in this app, but if we wanted to block 
  // even internal pages from direct access without /auth or "Skip to Demo", 
  // we could check a "isDemo" flag here.
  
  return <Outlet />
}

export const GuestGuard = () => {
  const { isAuthenticated } = useAuthStore()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
