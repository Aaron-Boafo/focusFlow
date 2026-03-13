import { Skeleton } from "@/components/ui/skeleton"

export function TimerSkeleton() {
  return (
    <div className="flex flex-col items-center justify-center mx-auto w-full max-w-4xl px-6 py-12">
      {/* Session Tab Selector */}
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-12 w-fit mx-auto">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-10 w-32 rounded-lg mx-1" />
        ))}
      </div>

      {/* Main Timer Display */}
      <div className="h-[400px] w-[400px] flex items-center justify-center relative">
        <Skeleton className="absolute inset-0 h-full w-full rounded-full" />
        <div className="text-center z-10 space-y-4">
          <Skeleton className="h-24 w-64 mx-auto" />
          <Skeleton className="h-4 w-40 mx-auto" />
        </div>
      </div>

      {/* XP Reward Hint */}
      <div className="mt-8 flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full" />
        <Skeleton className="h-4 w-56" />
      </div>

      {/* Control Buttons */}
      <div className="mt-12 flex items-center gap-6">
        <Skeleton className="h-14 w-14 rounded-full" />
        <Skeleton className="h-20 w-48 rounded-3xl" />
        <Skeleton className="h-14 w-14 rounded-full" />
      </div>

      {/* Session Stats Bar */}
      <div className="mt-20 grid w-full grid-cols-1 gap-8 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-6 flex flex-col items-center space-y-2">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-8 w-16" />
          </div>
        ))}
      </div>
    </div>
  )
}
