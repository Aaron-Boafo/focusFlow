import type { KanbanTask } from "@/types"
import { KanbanCard } from "./KanbanCard"
import { useDroppable } from "@dnd-kit/core"
import { MoreHorizontal } from "lucide-react"

interface KanbanColumnProps {
  id: string
  title: string
  tasks: KanbanTask[]
  colorClass: string
  badgeClass: string
  containerClass: string
}

export function KanbanColumn({
  id,
  title,
  tasks,
  colorClass,
  badgeClass,
  containerClass,
}: KanbanColumnProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  })

  return (
    <div className="flex flex-col gap-4">
      {/* Column Header */}
      <div className="flex items-center justify-between px-2">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 rounded-full ${colorClass}`} />
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-600 dark:text-slate-400">
            {title}
          </h3>
          <span
            className={`rounded px-2 py-0.5 text-[10px] font-bold ${badgeClass}`}
          >
            {tasks.length}
          </span>
        </div>
        <button className="text-slate-400 hover:text-slate-600">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>

      {/* Droppable Area */}
      <div
        ref={setNodeRef}
        className={`kanban-column flex min-h-[200px] flex-col gap-4 rounded-xl border-2 p-2 transition-colors touch-none ${containerClass} ${
          isOver ? "border-primary bg-primary/5 dark:bg-primary/10" : "border-dashed"
        }`}
      >
        {tasks.map((task) => (
          <KanbanCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  )
}
