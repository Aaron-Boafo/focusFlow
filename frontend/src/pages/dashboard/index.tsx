import { Outlet } from "react-router-dom"
import { SidebarProvider } from "@/components/ui/sidebar"
import { TooltipProvider } from "@/components/ui/tooltip"
import { AppSidebar } from "@/components/dashboard/AppSidebar"
import { AppHeader } from "@/components/dashboard/AppHeader"

export default function DashboardLayout() {
  return (
    <TooltipProvider>
      <SidebarProvider>
        <AppSidebar />
        
        <main className="flex w-full min-w-0 flex-1 flex-col bg-muted/20">
          <AppHeader />
          
          <div className="flex-1 pb-16">
            <Outlet />
          </div>
        </main>
      </SidebarProvider>
    </TooltipProvider>
  )
}
