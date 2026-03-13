import { Skeleton } from "@/components/ui/skeleton"

export function SettingsSkeleton() {
  return (
    <div className="mx-auto max-w-4xl space-y-8 px-8 py-12">
      {/* Header */}
      <div className="mb-10 space-y-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-4 w-64" />
      </div>

      <div className="space-y-8">
        {/* Sections */}
        {[1, 2, 3].map((i) => (
          <section key={i} className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
             <div className="p-6 border-b border-border">
                <Skeleton className="h-6 w-48" />
             </div>
             <div className="p-6 space-y-8">
                {[1, 2].map((j) => (
                  <div key={j} className="space-y-4">
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-6 w-12 rounded-lg" />
                    </div>
                    <Skeleton className="h-2 w-full rounded-full" />
                  </div>
                ))}
             </div>
          </section>
        ))}

        {/* Footer Actions */}
        <div className="flex justify-end gap-4 pt-4">
           <Skeleton className="h-10 w-24 rounded-lg" />
           <Skeleton className="h-10 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  )
}
