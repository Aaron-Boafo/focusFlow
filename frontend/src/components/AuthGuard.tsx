import { Navigate, Outlet } from "react-router-dom"
import { useAuthStore } from "@/store/AuthStore"
import { DashboardSkeleton } from "./skeletons/DashboardSkeleton"

interface ProtectedRouteProps {
  allowGuest?: boolean
}

export const ProtectedRoute = ({ allowGuest = true }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthStore()
  
  if (isLoading) {
    return <DashboardSkeleton />
  }
  
  if (!isAuthenticated && !allowGuest) {
    return <Navigate to="/auth" replace />
  }

  return <Outlet />
}

export const GuestGuard = () => {
  const { isAuthenticated, isLoading } = useAuthStore()

  if (isLoading) {
    return <DashboardSkeleton />
  }

  // Only redirect to dashboard if we are definitely authenticated
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return <Outlet />
}
