import React, { useEffect, useState } from "react"
import { Trophy, Search, TrendingUp, Users } from "lucide-react"
import { useLeaderboardStore } from "@/store/LeaderboardStore"
import { useAuthStore } from "@/store/AuthStore"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useNavigate } from "react-router-dom"

const LeaderboardPage: React.FC = () => {
  const { entries, isLoading, fetchLeaderboard } = useLeaderboardStore()
  const { user } = useAuthStore()
  const [searchQuery, setSearchQuery] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    fetchLeaderboard()
  }, [])

  const filteredEntries = entries.filter((entry) =>
    entry.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Use backend ranks for podium (Top 3 global)
  const topThree = entries.slice(0, 3)

  // Reorder for visual podium: 2nd, 1st, 3rd
  const displayPodium = [
    topThree.find((e) => e.rank === 2) || topThree[1],
    topThree.find((e) => e.rank === 1) || topThree[0],
    topThree.find((e) => e.rank === 3) || topThree[2],
  ].filter(Boolean) as typeof entries

  // Table shows filtered results that aren't in the podium (global rank > 3)
  const tableEntries = filteredEntries

  const myRank = entries.find((e) => e.displayName === user?.displayName)

  return (
    <div className="flex flex-1 flex-col overflow-y-auto p-4 md:p-8">
      <header className="mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Global Leaderboard
          </h2>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Top performers focusing this week across the globe.
          </p>
        </div>

        <div className="flex w-full flex-col items-center gap-4 sm:flex-row md:w-auto">
          <div className="relative flex w-full items-center sm:w-64">
            <Search className="absolute left-3 h-4 w-4 text-slate-400" />
            <Input
              className="pl-10"
              placeholder="Search users..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </header>

      {/* Podium Section */}
      {!searchQuery && displayPodium.length > 0 && (
        <div className="mx-auto mb-12 grid w-full max-w-4xl grid-cols-3 items-end gap-4 md:gap-6">
          {displayPodium.map((entry) => (
            <div key={entry.id} className="flex flex-col items-center">
              <div className="relative mb-4">
                {entry.rank === 1 && (
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 animate-bounce text-yellow-400">
                    <Trophy className="h-8 w-8 fill-current" />
                  </div>
                )}
                <div
                  className={`overflow-hidden rounded-full border-4 bg-white p-1 shadow-lg ${
                    entry.rank === 1
                      ? "h-24 w-24 border-yellow-400 md:h-28 md:w-28"
                      : entry.rank === 2
                        ? "h-20 w-20 border-slate-300"
                        : "h-20 w-20 border-orange-300"
                  }`}
                >
                  <img
                    alt={entry.displayName}
                    className="h-full w-full rounded-full object-cover"
                    src={
                      entry.avatar ||
                      `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.displayName}`
                    }
                  />
                </div>
                <div
                  className={`absolute -bottom-2 left-1/2 flex h-8 w-8 -translate-x-1/2 items-center justify-center rounded-full text-sm font-bold shadow-md ${
                    entry.rank === 1
                      ? "bg-yellow-400 text-yellow-950"
                      : entry.rank === 2
                        ? "bg-slate-300 text-slate-800"
                        : "bg-orange-300 text-orange-900"
                  }`}
                >
                  {entry.rank}
                </div>
              </div>

              <div
                className={`w-full rounded-xl border bg-white p-4 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800 ${
                  entry.rank === 1
                    ? "border-primary/20 md:scale-110 md:p-6 dark:border-primary/40"
                    : "border-slate-100"
                }`}
              >
                <h3 className="truncate font-bold text-slate-900 dark:text-white">
                  {entry.displayName}
                </h3>
                <p className="text-sm font-bold text-primary">
                  {entry.totalExp.toLocaleString()} pts
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Leaderboard Table */}
      <div className="mb-24 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-800">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50">
                <th className="w-20 px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Rank
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Streak Points
                </th>
                <th className="px-6 py-4 text-left text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-4 text-right text-xs font-semibold tracking-wider text-slate-500 uppercase">
                  Trend
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-4" />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-16" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="h-4 w-20 rounded-full" />
                    </td>
                    <td className="px-6 py-4">
                      <Skeleton className="ml-auto h-4 w-8" />
                    </td>
                  </tr>
                ))
              ) : tableEntries.length > 0 ? (
                tableEntries.map((entry) => (
                  <tr
                    key={entry.id}
                    className="transition-colors hover:bg-slate-50/50 dark:hover:bg-slate-900/30"
                  >
                    <td className="px-6 py-4 text-sm font-bold whitespace-nowrap text-slate-500">
                      {entry.rank}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <img
                          className="h-8 w-8 rounded-full bg-slate-200 object-cover"
                          src={
                            entry.avatar ||
                            `https://api.dicebear.com/7.x/avataaars/svg?seed=${entry.displayName}`
                          }
                          alt={entry.displayName}
                        />
                        <span className="text-sm font-medium text-slate-900 dark:text-white">
                          {entry.displayName}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm whitespace-nowrap text-slate-600 dark:text-slate-300">
                      {entry.totalExp.toLocaleString()} pts
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase ${
                          entry.status === "Focusing"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-slate-100 text-slate-500 dark:bg-slate-900/30 dark:text-slate-400"
                        }`}
                      >
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      {(() => {
                        // Deterministic but "random" trend based on ID
                        const hash = entry.id
                          .split("")
                          .reduce((acc, char) => acc + char.charCodeAt(0), 0)
                        const trend = (hash % 5) + 1
                        const goingUp = hash % 2 === 0

                        return (
                          <div
                            className={`flex items-center justify-end ${goingUp ? "text-green-500" : "text-slate-400"} gap-1`}
                          >
                            <TrendingUp
                              className={`h-4 w-4 ${goingUp ? "" : "rotate-180 opacity-50"}`}
                            />
                            <span className="text-xs font-bold">{trend}</span>
                          </div>
                        )
                      })()}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-slate-500 dark:text-slate-400"
                  >
                    <Users className="mx-auto mb-4 h-12 w-12 opacity-20" />
                    <p>No rankings found matching your search.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sticky My Rank */}
      {myRank && (
        <div className="fixed bottom-8 left-1/2 z-40 w-full max-w-4xl -translate-x-1/2 px-4 md:translate-x-[32px] md:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/10 bg-primary p-4 text-white shadow-2xl backdrop-blur-sm md:flex-nowrap">
            <div className="flex items-center gap-4 md:gap-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20 text-lg font-bold">
                {myRank.rank}
              </div>
              <div className="flex items-center gap-3">
                <img
                  className="h-10 w-10 rounded-full border-2 border-white/30 object-cover"
                  src={
                    myRank.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${myRank.displayName}`
                  }
                  alt="You"
                />
                <div>
                  <p className="text-xs font-medium text-white/70">
                    Your Current Rank
                  </p>
                  <h4 className="font-bold">{myRank.displayName}</h4>
                </div>
              </div>
            </div>

            <div className="ml-auto flex items-center gap-6 overflow-hidden md:ml-0 md:gap-12">
              <div className="text-center">
                <p className="text-[10px] tracking-wider text-white/70 uppercase">
                  Streak Points
                </p>
                <p className="font-bold">
                  {myRank.totalExp.toLocaleString()} pts
                </p>
              </div>

              <Button
                variant="secondary"
                size="sm"
                className="shrink-0 bg-white font-bold text-primary hover:bg-slate-50"
                onClick={() => navigate("/timer")}
              >
                Focus Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LeaderboardPage
