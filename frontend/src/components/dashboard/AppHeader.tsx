import { useLocation } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Bell, User } from "lucide-react"

export function AppHeader() {
  const location = useLocation()

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/tasks")) return "Task Board"
    if (pathname.startsWith("/timer")) return "Focus Timer"
    if (pathname.startsWith("/analytics")) return "Analytics"
    if (pathname.startsWith("/settings")) return "Settings"
    return "Dashboard"
  }

  const title = getPageTitle(location.pathname)

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <h2 className="text-xl font-bold">{title}</h2>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" className="relative rounded-lg bg-card hover:bg-muted">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-card bg-red-500" />
        </Button>

        <Button variant="outline" size="icon" className="rounded-lg bg-card hover:bg-muted">
          <User className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}

