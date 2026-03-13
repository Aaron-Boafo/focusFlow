import type { KanbanTask } from "@/types"
import { useDraggable } from "@dnd-kit/core"
import {
  CalendarDays,
  Paperclip,
  CheckCircle2,
  Award,
} from "lucide-react"

export function KanbanCard({ task }: { task: KanbanTask }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 50, // elevate when dragging
      }
    : undefined

  // Styling maps based on priority/status
  const priorityColors: Record<string, string> = {
    LOW: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400",
    MEDIUM: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
    HIGH: "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400",
    CRITICAL: "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  }

  const isDone = task.status === "done"

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`group relative cursor-grab active:cursor-grabbing rounded-xl border p-4 shadow-sm transition-colors hover:border-primary ${
        isDone
          ? "border-slate-200 dark:border-slate-700 bg-white/60 dark:bg-slate-800/60 opacity-80"
          : task.status === "in-progress"
          ? "border-l-4 border-l-primary border-y-slate-200 border-r-slate-200 bg-white dark:border-y-slate-700 dark:border-r-slate-700 dark:bg-slate-800"
          : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800"
      }`}
    >
      {/* Done XP Badge Decoration */}
      {isDone && (
        <div className="absolute -right-2 -top-2 rotate-12 transform rounded-full bg-emerald-500 px-2 py-1 text-[10px] font-black text-white shadow-lg">
          +{task.xp} XP
        </div>
      )}

      {/* Header Row */}
      <div className="mb-3 flex items-start justify-between">
        <span
          className={`rounded px-2 py-1 text-[10px] font-bold ${
            priorityColors[task.priority?.toUpperCase()] || priorityColors["MEDIUM"]
          }`}
        >
          {task.priority?.charAt(0).toUpperCase() + task.priority?.slice(1).toLowerCase()}
        </span>

        {!isDone && (
          <div
            className={`text-[10px] font-bold transition-colors ${
              task.status === "in-progress"
                ? "text-primary group-hover:animate-pulse"
                : "text-muted-foreground group-hover:text-primary"
            }`}
          >
            +{task.xp} XP
          </div>
        )}
      </div>

      {/* Content */}
      <h4
        className={`mb-1 font-bold ${
          isDone
            ? "text-muted-foreground line-through decoration-slate-400"
            : "text-foreground"
        }`}
      >
        {task.title}
      </h4>
      <p
        className={`line-clamp-2 text-sm ${
          isDone
            ? "text-muted-foreground line-through decoration-slate-400"
            : "text-muted-foreground"
        }`}
      >
        {task.description}
      </p>

      {/* Progress Bar for In-Progress */}
      {task.status === "in-progress" && task.progress !== undefined && (
        <div className="mt-4">
          <div className="mb-1 flex justify-between text-[10px] font-bold text-muted-foreground">
            <span>Progress</span>
            <span>{task.progress}%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-slate-100 dark:bg-slate-700">
            <div
              className="h-full rounded-full bg-primary"
              style={{ width: `${task.progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer Meta Row */}
      <div className="mt-4 flex items-center justify-between">
        {/* Left Footer Area (Avatars / Sub-badges) */}
        {!isDone ? (
          <div className="flex -space-x-2">
            {task.assignees?.map((avatar, idx) => (
              <img
                key={idx}
                src={avatar}
                alt="Assignee"
                className="h-6 w-6 rounded-full border-2 border-white dark:border-slate-800"
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-1 text-xs font-bold text-emerald-500">
            <Award className="h-4 w-4" />
            <span>Awarded</span>
          </div>
        )}

        {/* Right Footer Area (Stats / Dates) */}
        <div
          className={`flex items-center gap-3 text-xs ${
            isDone ? "text-muted-foreground" : "text-muted-foreground"
          }`}
        >
          {task.attachments ? (
            <span className="flex items-center gap-0.5">
              <Paperclip className="h-3.5 w-3.5" />
              {task.attachments}
            </span>
          ) : null}

          {task.checklistData ? (
            <span className="flex items-center gap-0.5">
              <CheckCircle2 className="h-3.5 w-3.5" />
              {task.checklistData}
            </span>
          ) : null}

          {task.date ? (
            <span className="flex items-center gap-1">
              {!isDone && <CalendarDays className="h-3.5 w-3.5" />}
              <span>{task.date}</span>
            </span>
          ) : null}
        </div>
      </div>
    </div>
  )
}
