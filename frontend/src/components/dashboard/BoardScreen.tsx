import { useAppStore } from "@/store/useAppStore"
import type { KanbanTask } from "@/types"
import { KanbanColumn } from "@/components/dashboard/KanbanColumn"
import { Button } from "@/components/ui/button"
import { PlusSquare } from "lucide-react"
import {
  DndContext,
  closestCorners,
} from "@dnd-kit/core"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { DragOverlay } from "@dnd-kit/core"
import { useState } from "react"
import { KanbanCard } from "@/components/dashboard/KanbanCard"
import { Link, useParams } from "react-router-dom"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export function BoardScreen() {
  const { kanbanTasks, moveKanbanTask } = useAppStore()
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null)
  
  // Example mapping for project title based on URL paraameter
  const { projectId } = useParams()
  const projectTitle = projectId === 'focusflow-redesign' 
    ? "FocusFlow Redesign" 
    : (projectId ? projectId.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) : "Project Board")

  const todoTasks = kanbanTasks.filter((t) => t.status === "todo")
  const inProgressTasks = kanbanTasks.filter((t) => t.status === "in-progress")
  const doneTasks = kanbanTasks.filter((t) => t.status === "done")

  function handleDragStart(event: DragStartEvent) {
    const { active } = event
    const task = kanbanTasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  function handleDragEnd(event: DragEndEvent) {
    const { over } = event
    
    if (over) {
      const newStatus = over.id as "todo" | "in-progress" | "done"
      if (activeTask && activeTask.status !== newStatus) {
        moveKanbanTask(activeTask.id, newStatus)
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
                <BreadcrumbPage>{projectTitle}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-4xl font-black tracking-tight">Task Board</h1>
          <p className="mt-1 text-muted-foreground">
            Manage your workflow and earn XP for every completed task.
          </p>
        </div>
        <Button className="flex items-center gap-2 rounded-xl px-6 py-6 font-bold shadow-lg shadow-primary/20 transition-all hover:shadow-xl hover:shadow-primary/30">
          <PlusSquare className="h-5 w-5" />
          Create Task
        </Button>
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
            tasks={todoTasks}
            colorClass="bg-slate-400"
            badgeClass="bg-slate-200 text-slate-600 dark:bg-slate-800 dark:text-slate-400"
            containerClass="border-slate-200 dark:border-slate-800 bg-slate-100/50 dark:bg-slate-900/30"
          />
          <KanbanColumn
            id="in-progress"
            title="In Progress"
            tasks={inProgressTasks}
            colorClass="bg-primary"
            badgeClass="bg-primary/10 text-primary"
            containerClass="border-primary/20 bg-primary/5 dark:bg-primary/10 border-solid"
          />
          <KanbanColumn
            id="done"
            title="Done"
            tasks={doneTasks}
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
