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
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { format } from "date-fns"
import type { SessionType } from "@/types"

export default function TimerHistoryPage() {
  const { history, isLoading, fetchHistory, deleteSession } = SessionStore()
  const [search, setSearch] = useState("")
  const [filter, setFilter] = useState<"All" | "Focus" | "Breaks">("All")
  const [page, setPage] = useState(1)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const itemsPerPage = 10

  useEffect(() => {
    fetchHistory()
  }, [fetchHistory])

  const filteredHistory = useMemo(() => {
    return history
      .filter((session) => {
        const matchesSearch = session.type
          .toLowerCase()
          .includes(search.toLowerCase())
        const matchesFilter =
          filter === "All" ||
          (filter === "Focus" && session.type === "Focus") ||
          (filter === "Breaks" &&
            (session.type === "Short Break" || session.type === "Long Break"))

        return matchesSearch && matchesFilter
      })
      .sort((a, b) => b.startTime - a.startTime)
  }, [history, search, filter])

  const totalPages = Math.ceil(filteredHistory.length / itemsPerPage)
  const paginatedHistory = filteredHistory.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  )

  const stats = useMemo(() => {
    const focusSeconds = history
      .filter((s) => s.type === "Focus")
      .reduce((acc, s) => acc + s.elapsedTime, 0)

    const sessionsCount = history.length

    const avgSeconds =
      sessionsCount > 0
        ? focusSeconds / history.filter((s) => s.type === "Focus").length
        : 0

    return {
      totalFocus: `${Math.floor(focusSeconds / 3600)}h ${Math.floor((focusSeconds % 3600) / 60)}m`,
      sessionsCount,
      avgSession: `${Math.floor(avgSeconds / 60)}m`,
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

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return

    try {
      const { deleteMultipleSessions } = SessionStore.getState()
      await deleteMultipleSessions(selectedIds)
      toast.success(`${selectedIds.length} sessions deleted successfully`)
      setSelectedIds([])
    } catch (error) {
      toast.error("Failed to delete sessions")
    }
  }

  const exportToCSV = () => {
    if (filteredHistory.length === 0) {
      toast.error("No data to export")
      return
    }

    const headers = [
      "Date",
      "Time",
      "Type",
      "Duration (s)",
      "Duration (Formatted)",
    ]
    const rows = filteredHistory.map((s) => [
      format(new Date(s.startTime), "yyyy-MM-dd"),
      format(new Date(s.startTime), "HH:mm:ss"),
      s.type,
      s.elapsedTime,
      `${Math.floor(s.elapsedTime / 60)}m ${s.elapsedTime % 60}s`,
    ])

    const csvContent = [headers, ...rows].map((e) => e.join(",")).join("\n")
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute(
      "download",
      `focusflow_history_${format(new Date(), "yyyyMMdd")}.csv`
    )
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("History exported successfully")
  }

  const getSessionIcon = (type: SessionType) => {
    switch (type) {
      case "Focus":
        return <Bolt className="h-4 w-4 fill-primary text-primary" />
      case "Short Break":
        return <Coffee className="h-4 w-4 text-amber-600" />
      case "Long Break":
        return <Palmtree className="h-4 w-4 text-indigo-600" />
    }
  }

  const getSessionBadgeClass = (type: SessionType) => {
    switch (type) {
      case "Focus":
        return "bg-primary/10 text-primary"
      case "Short Break":
        return "bg-amber-100 text-amber-700"
      case "Long Break":
        return "bg-indigo-100 text-indigo-700"
    }
  }

  return (
    <div className="p-8 lg:p-12">
      {/* Header Section */}
      <header className="mb-10 flex flex-wrap items-end justify-between gap-4">
        <div className="max-w-2xl">
          <h2 className="mb-2 text-3xl font-black tracking-tight text-slate-900 dark:text-white">
            Timer History
          </h2>
          <p className="leading-relaxed text-slate-500 dark:text-slate-400">
            Review your past productivity sessions, analyze your breaks, and see
            where your time goes.
          </p>
        </div>
        <div className="flex gap-2">
          {selectedIds.length > 0 && (
            <Button
              variant="destructive"
              size="sm"
              className="gap-2"
              onClick={handleBulkDelete}
            >
              <Trash2 className="h-4 w-4" />
              Delete Selected ({selectedIds.length})
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={exportToCSV}
          >
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </header>

      {/* Summary Stats */}
      <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
              Total Focus Time
            </p>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Clock className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.totalFocus}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
              Sessions Completed
            </p>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Bolt className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.sessionsCount}</p>
        </div>

        <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-medium tracking-wider text-muted-foreground uppercase">
              Avg Session Length
            </p>
            <div className="rounded-lg bg-primary/10 p-2 text-primary">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
          <p className="text-3xl font-bold">{stats.avgSession}</p>
        </div>
      </section>

      {/* Filters Section */}
      <section className="mb-6 flex flex-wrap items-center gap-3">
        <div className="flex rounded-lg border border-border bg-card p-1">
          {(["All", "Focus", "Breaks"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t)}
              className={`rounded-md px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === t
                  ? "bg-primary text-white"
                  : "text-muted-foreground hover:text-primary"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search sessions..."
              className="min-w-[240px] pl-10"
            />
          </div>
        </div>
      </section>

      {/* Data Table */}
      <section className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Date & Time
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Session Type
                </th>
                <th className="px-6 py-4 text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Duration
                </th>
                <th className="px-6 py-4 text-right text-xs font-bold tracking-wider text-muted-foreground uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Loading history...
                  </td>
                </tr>
              ) : paginatedHistory.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    No sessions found.
                  </td>
                </tr>
              ) : (
                paginatedHistory.map((session) => (
                  <tr
                    key={session.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <p className="text-sm font-semibold">
                        {format(new Date(session.startTime), "MMM dd, yyyy")}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(session.startTime), "hh:mm a")}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${getSessionBadgeClass(session.type)}`}
                      >
                        {getSessionIcon(session.type)}
                        {session.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-mono text-sm font-medium">
                      {Math.floor(session.elapsedTime / 60)}m{" "}
                      {session.elapsedTime % 60}s
                    </td>
                    <td className="px-6 py-4 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            className="cursor-pointer gap-2 text-destructive focus:text-destructive"
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
        <div className="flex items-center justify-between border-t border-border bg-muted/50 px-6 py-4">
          <p className="text-xs font-medium tracking-wide text-muted-foreground">
            SHOWING {paginatedHistory.length} OF {filteredHistory.length}{" "}
            SESSIONS
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
            <div className="flex h-8 items-center justify-center rounded border border-border bg-primary px-3 text-xs font-bold text-white">
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
