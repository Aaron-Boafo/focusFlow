import { Link, useLocation, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {  Settings } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Progress } from "@/components/ui/progress"
import { useExpStore } from "@/store/ExpStore"
import { Star } from "lucide-react"

export function AppHeader() {
  const location = useLocation()
  const navigate = useNavigate()

  const getPageTitle = (pathname: string) => {
    if (pathname.startsWith("/tasks")) return "Task Board"
    if (pathname.startsWith("/timer")) return "Focus Timer"
    if (pathname.startsWith("/analytics")) return "Analytics"
    if (pathname.startsWith("/settings")) return "Settings"
    return "Dashboard"
  }

  const title = getPageTitle(location.pathname)

  // XP Store
  const { totalExp, level, getExpForNextLevel, getExpSinceLastLevel } =
    useExpStore()

  const expForNextLevel = getExpForNextLevel(level)
  const expSinceLast = getExpSinceLastLevel()
  const progressPercentage = Math.min(
    100,
    Math.max(0, (expSinceLast / expForNextLevel) * 100)
  )

  return (
    <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1" />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              {title === "Dashboard" ? (
                <BreadcrumbPage>Dashboard</BreadcrumbPage>
              ) : (
                <BreadcrumbLink asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </BreadcrumbLink>
              )}
            </BreadcrumbItem>
            {title !== "Dashboard" && (
              <>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{title}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            )}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex items-center gap-4">
        {/* XP Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="relative flex items-center gap-2 rounded-lg bg-card hover:bg-muted"
            >
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
              <span className="font-bold text-slate-700 dark:text-slate-200">
                Lvl {level}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64" align="end">
            <div className="grid gap-4">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 leading-none font-medium">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-500" />
                  Level {level}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Complete Focus sessions to earn XP and level up!
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-muted-foreground">
                    Progress
                  </span>
                  <span className="font-bold">
                    {expSinceLast} / {expForNextLevel} XP
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
                <p className="text-right text-[10px] text-muted-foreground">
                  Total XP: {totalExp}
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        <Button
          variant="outline"
          size="icon"
          className="rounded-lg bg-card hover:bg-muted"
          onClick={() => navigate("/settings")}
        >
          <Settings className="h-5 w-5 text-muted-foreground" />
        </Button>
      </div>
    </header>
  )
}
