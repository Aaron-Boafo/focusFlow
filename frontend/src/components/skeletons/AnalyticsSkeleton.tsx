import { Skeleton } from "@/components/ui/skeleton"

export function AnalyticsSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-4 md:p-8">
      {/* Hero Titles */}
      <div className="space-y-1">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-xl border border-border bg-card p-6 space-y-4">
            <div className="flex justify-between">
              <Skeleton className="h-10 w-10 rounded-lg" />
              <Skeleton className="h-4 w-16 rounded-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* XP Progress Section */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-2xl" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
          <div className="w-full max-w-md flex-1 space-y-2">
            <div className="flex justify-between">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-3 w-full rounded-full" />
          </div>
        </div>
      </div>

      {/* Weekly Chart Section */}
      <div className="rounded-xl border border-border bg-card p-8 shadow-sm space-y-8">
        <div className="flex flex-col sm:flex-row justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <div className="flex gap-2">
             <Skeleton className="h-9 w-24 rounded-lg" />
             <Skeleton className="h-9 w-28 rounded-lg" />
          </div>
        </div>
        
        <div className="flex h-64 items-end justify-between gap-2 px-0 sm:gap-4 sm:px-4">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="flex flex-col items-center gap-3 flex-1 h-full justify-end">
              <Skeleton className="w-full rounded-t-lg" style={{ height: `${Math.random() * 60 + 20}%` }} />
              <Skeleton className="h-3 w-8" />
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row justify-between pt-8 border-t border-border items-center gap-6">
           <div className="flex gap-8">
             <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-12" /></div>
             <div className="space-y-2"><Skeleton className="h-3 w-16" /><Skeleton className="h-6 w-24" /></div>
           </div>
           <Skeleton className="h-4 w-24" />
        </div>
      </div>

      {/* Achievement Banner */}
      <div className="rounded-2xl bg-slate-900 border border-border p-8 h-40">
        <div className="flex justify-between items-center h-full">
           <div className="space-y-4">
              <Skeleton className="h-6 w-32 rounded-full" />
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-4 w-96" />
           </div>
           <div className="flex -space-x-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-12 w-12 rounded-full border-4 border-slate-900" />
              ))}
           </div>
        </div>
      </div>
    </div>
  )
}
