import { useProjectStore } from "@/store/ProjectStore"
import { KanbanColumn } from "@/components/dashboard/KanbanColumn"
import { Button } from "@/components/ui/button"
import { PlusSquare, Target } from "lucide-react"
import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { DragOverlay } from "@dnd-kit/core"
import { useState } from "react"
import { KanbanCard } from "@/components/dashboard/KanbanCard"
import { Link, useParams } from "react-router-dom"
import { toast } from "sonner"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BoardScreen() {
  const { projectId } = useParams()
  const { projects, updateTaskStatus } = useProjectStore()
  
  const project = projects.find(p => p.id === projectId)
  const [activeTask, setActiveTask] = useState<any | null>(null)
  
  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Target className="w-16 h-16 text-muted-foreground/20" />
        <h2 className="text-xl font-bold">Project not found</h2>
        <Link to="/tasks">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    )
  }

  const tasks = project.tasks || []
  const todoTasks = tasks.filter((t) => t.status === "To Do")
  const inProgressTasks = tasks.filter((t) => t.status === "In Progress")
  const doneTasks = tasks.filter((t) => t.status === "Done")

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event
    
    if (over && activeTask && projectId) {
      const statusMap: Record<string, string> = {
        "todo": "To Do",
        "in-progress": "In Progress",
        "done": "Done"
      }
      const newStatus = statusMap[over.id as string] as any
      if (newStatus && activeTask.status !== newStatus) {
        const priorityXP = ({ LOW: 10, MEDIUM: 20, HIGH: 30, CRITICAL: 40 } as Record<string, number>)[activeTask.priority?.toUpperCase()] || 10

        updateTaskStatus(projectId, activeTask.id, newStatus)

        // Feedback toast for XP changes
        if (newStatus === "Done" && activeTask.status !== "Done") {
          toast.success(`+${priorityXP} XP earned! Task completed.`, { icon: "🏆" })
        } else if (activeTask.status === "Done" && newStatus !== "Done") {
          toast.warning(`-${priorityXP} XP deducted. Task marked incomplete.`, { icon: "⚠️" })
        }
      }
    }
    setActiveTask(null)
  }

  return (
    <div className="flex flex-col gap-8 p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/tasks">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{project.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-black tracking-tight">{project.title}</h1>
          <p className="mt-1 text-muted-foreground">
            Complete tasks to earn XP: <span className="text-foreground font-medium">Low (10)</span>, <span className="text-foreground font-medium">Medium (20)</span>, <span className="text-foreground font-medium">High (30)</span>, or <span className="text-foreground font-medium">Critical (40)</span>.
          </p>
        </div>
        <Link to={`/tasks/edit/${projectId}`}>
          <Button className="flex items-center gap-2 rounded-xl px-6 py-6 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30">
            <PlusSquare className="h-5 w-5" />
            Create Task
          </Button>
        </Link>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <KanbanColumn
            id="todo"
            title="To Do"
            tasks={todoTasks.map(t => {
              const priorityXP = { LOW: 10, MEDIUM: 20, HIGH: 30, CRITICAL: 40 }[t.priority] || 10
              return { id: t.id, title: t.title, priority: t.priority, status: "todo", xp: priorityXP }
            }) as any}
            colorClass="bg-slate-400"
            badgeClass="bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            containerClass="border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30"
          />
          <KanbanColumn
            id="in-progress"
            title="In Progress"
            tasks={inProgressTasks.map(t => {
              const priorityXP = { LOW: 10, MEDIUM: 20, HIGH: 30, CRITICAL: 40 }[t.priority] || 10
              return { id: t.id, title: t.title, priority: t.priority, status: "in-progress", xp: priorityXP }
            }) as any}
            colorClass="bg-primary"
            badgeClass="bg-primary/10 text-primary"
            containerClass="border-primary/20 bg-primary/5 dark:bg-primary/10 border-solid"
          />
          <KanbanColumn
            id="done"
            title="Done"
            tasks={doneTasks.map(t => {
              const priorityXP = { LOW: 10, MEDIUM: 20, HIGH: 30, CRITICAL: 40 }[t.priority] || 10
              return { id: t.id, title: t.title, priority: t.priority, status: "done", xp: priorityXP }
            }) as any}
            colorClass="bg-emerald-500"
            badgeClass="bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400"
            containerClass="border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-900/10"
          />

          <DragOverlay>
            {activeTask ? <KanbanCard task={activeTask} /> : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  )
}
