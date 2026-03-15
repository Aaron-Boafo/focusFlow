import { useEffect, useState, useMemo } from "react"
import { SessionStore } from "@/store/SessionStore"
import { 
  Calendar, 
  Clock, 
  MoreVertical, 
  Search, 
  Trash2, 
  Bolt, 
  Coffee, 
  Palmtree, 
  Download,
  ChevronLeft,
  ChevronRight,
  Filter
} from "lucide-react"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { format } from "date-fns"
import type { Session, SessionType } from "@/types"

export default function TimerHistoryPage() {
  const { history, isLoading, fetchHistory, deleteSession } = SessionStore()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"All" | "Focus" | "Breaks">("All")
  const [page, setPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const filteredHistory = useMemo(() => {
    return history.filter(session => {
      const matchesSearch = session.type.toLowerCase().includes(search.toLowerCase())
      const matchesFilter = 
        filter === "All" || 
        (filter === "Focus" && session.type === "Focus") || 
        (filter === "Breaks" && (session.type === "Short Break" || session.type === "Long Break"))
      
      return matchesSearch && matchesFilter
    }).sort((a, b) => b.startTime - a.startTime)
  }, [history, search, filter])

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const paginatedHistory = filteredHistory.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  const stats = useMemo(() => {
    const focusSeconds = history
      .filter(s => s.type === "Focus")
      .reduce((acc, s) => acc + s.elapsedTime, 0)
    
    const sessionsCount = history.length
    
    const avgSeconds = sessionsCount > 0 ? focusSeconds / history.filter(s => s.type === "Focus").length : 0

    return {
      totalFocus: `${Math.floor(focusSeconds / 3600)}h ${Math.floor((focusSeconds % 3600) / 60)}m`,
      sessionsCount,
      avgSession: `${Math.floor(avgSeconds / 60)}m`
    }
  }, [history])

  const handleDelete = async (id: string) => {
    try {
      await deleteSession(id)
      toast.success("Session deleted successfully")
    } catch (error) {
      toast.error("Failed to delete session")
    }
  }

  const getSessionIcon = (type: SessionType) => {
    switch (type) {
      case "Focus": return <Bolt className="h-4 w-4 fill-primary text-primary" />
      case "Short Break": return <Coffee className="h-4 w-4 text-amber-600" />
      case "Long Break": return <Palmtree className="h-4 w-4 text-indigo-600" />
    }
  }

  const getSessionBadgeClass = (type: SessionType) => {
    switch (type) {
      case "Focus": return "bg-primary/10 text-primary"
      case "Short Break": return "bg-amber-100 text-amber-700"
      case "Long Break": return "bg-indigo-100 text-indigo-700"
    }
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header Section */}
      <header className="mb-10 flex flex-wrap justify-between items-end gap-4">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2">Timer History</h2>
          <p className="text-slate-500 dark:text-slate-400 leading-relaxed">
            Review your past productivity sessions, analyze your breaks, and see where your time goes.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      {/* Summary Stats */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Focus Time</p>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalFocus}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Sessions Completed</p>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Bolt className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.sessionsCount}</p>
        </div>

        <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Avg Session Length</p>
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.avgSession}</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-6 flex flex-wrap gap-3 items-center">
        <div className="flex bg-card border border-border rounded-lg p-1">
          {(["All", "Focus", "Breaks"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${
                filter === t ? "bg-primary text-white" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..."
              className="pl-10 min-w-[240px]"
            />
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="bg-card border border-border rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/50 border-b border-border">
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Date & Time</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Session Type</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">Duration</th>
                <th className="px-6 py-4 text-xs font-bold uppercase tracking-wider text-muted-foreground text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    Loading history...
                  </td>
                </tr>
              ) : paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-muted-foreground">
                    No sessions found.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((session) => (
                  <tr key={session.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm">{format(new Date(session.startTime), "MMM dd, yyyy")}</p>
                      <p className="text-xs text-muted-foreground">{format(new Date(session.startTime), "hh:mm a")}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 py-1 px-3 rounded-full text-xs font-bold ${getSessionBadgeClass(session.type)}`}>
                        {getSessionIcon(session.type)}
                        {session.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium">
                      {Math.floor(session.elapsedTime / 60)}m {session.elapsedTime % 60}s
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem 
                            className="text-destructive focus:text-destructive gap-2 cursor-pointer"
                            onClick={() => handleDelete(session.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete Entry
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-muted/50 border-t border-border flex items-center justify-between">
          <p className="text-xs text-muted-foreground font-medium tracking-wide">
            SHOWING {paginatedHistory.length} OF {filteredHistory.length} SESSIONS
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center justify-center h-8 px-3 rounded border border-border bg-primary text-white text-xs font-bold">
              {page}
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              disabled={page === totalPages || totalPages === 0}
              onClick={() => setPage(page + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
