import { Link, useLocation } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import {
  LayoutDashboard,
  KanbanSquare,
  Timer,
  BarChart2,
  Settings,
  LogOut,
} from "lucide-react"

import { useAuth } from "@/context/AuthContext"

export function AppSidebar() {
  const { user: authUser, isAuthenticated } = useAuth()
  const location = useLocation()

  const isActive = (path: string) => location.pathname.startsWith(path)

  return (
    <Sidebar className="border-r border-border bg-card">
      <SidebarHeader className="p-6">
        <Link to="/" className="flex flex-col gap-1">
          <h1 className="text-xl leading-none font-bold text-primary">
            FocusFlow
          </h1>
          <p className="text-xs font-medium text-muted-foreground">
            {isAuthenticated ? (authUser?.plan || "Pro Plan") : "Guest"}
          </p>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="space-y-1 px-4">
            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Dashboard"
                isActive={isActive("/dashboard")}
                className="gap-3 rounded-lg py-5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link to="/dashboard">
                  <LayoutDashboard className="h-5 w-5" />
                  <span className="text-sm">Dashboard</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Task Board"
                isActive={isActive("/tasks")}
                className="gap-3 rounded-lg py-5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link to="/tasks">
                  <KanbanSquare className="h-5 w-5" />
                  <span className="text-sm">Task Board</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Sessions"
                isActive={isActive("/timer")}
                className="gap-3 rounded-lg py-5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link to="/timer">
                  <Timer className="h-5 w-5" />
                  <span className="text-sm">Sessions</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Analytics"
                isActive={isActive("/analytics")}
                className="gap-3 rounded-lg py-5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link to="/analytics">
                  <BarChart2 className="h-5 w-5" />
                  <span className="text-sm">Analytics</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                asChild
                tooltip="Settings"
                isActive={isActive("/settings")}
                className="gap-3 rounded-lg py-5 font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
              >
                <Link to="/settings">
                  <Settings className="h-5 w-5" />
                  <span className="text-sm">Settings</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="space-y-4 border-t border-border p-4">
        <SidebarMenu className="space-y-1">
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Logout"
              className="gap-3 py-4 text-muted-foreground transition-colors hover:text-destructive"
            >
              <LogOut className="h-5 w-5" />
              <span className="flex-1 text-sm">Logout</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
