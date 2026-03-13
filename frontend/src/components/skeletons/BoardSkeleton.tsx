import { Skeleton } from "@/components/ui/skeleton"

export function BoardSkeleton() {
  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex gap-2 items-center">
             <Skeleton className="h-4 w-16" />
             <Skeleton className="h-4 w-4" />
             <Skeleton className="h-4 w-24" />
          </div>
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-96 mt-2" />
        </div>
        <Skeleton className="h-14 w-40 rounded-xl" />
      </div>

      {/* Kanban columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl border border-border bg-slate-100/50 dark:bg-slate-900/30 p-4 space-y-4 min-h-[500px]">
             <div className="flex items-center justify-between p-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-3 w-3 rounded-full" />
                  <Skeleton className="h-5 w-24" />
                </div>
                <Skeleton className="h-6 w-8 rounded-full" />
             </div>
             {[1, 2, 3].map((j) => (
               <div key={j} className="bg-card rounded-xl p-4 shadow-sm border border-border space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-8 rounded" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                  <Skeleton className="h-6 w-full" />
                  <div className="flex justify-between items-center ">
                    <div className="flex -space-x-2">
                       <Skeleton className="h-6 w-6 rounded-full border-2 border-background" />
                    </div>
                    <Skeleton className="h-4 w-12" />
                  </div>
               </div>
             ))}
          </div>
        ))}
      </div>
    </div>
  )
}
