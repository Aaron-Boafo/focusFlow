import { Link, useNavigate, useParams } from "react-router-dom"
import { useState, useEffect } from "react"
import {
  useProjectStore,
  type Project,
  type ProjectTask,
} from "@/store/ProjectStore"
import * as lucideIcons from "lucide-react"
import { Info, CalendarDays, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import { AVAILABLE_ICONS } from "@/constants"

export function NewProjectScreen() {
  const navigate = useNavigate()
  const { projectId } = useParams()
  const { projects, addProject, updateProject } = useProjectStore()

  const isEditMode = !!projectId
  const projectToEdit = isEditMode
    ? projects.find((p) => p.id === projectId)
    : null

  // Form State
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<Project["status"]>("In Progress")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("Rocket")

  const [deadline, setDeadline] = useState("2024-12-31")

  // Tasks State
  const [tasks, setTasks] = useState<ProjectTask[]>([
    {
      id: "t1",
      title: "Create Initial Wireframes",
      description: "",
      status: "To Do",
      priority: "MEDIUM",
    },
  ])

  useEffect(() => {
    if (isEditMode && projectToEdit) {
      setTitle(projectToEdit.title)
      setStatus(projectToEdit.status)
      setDescription(projectToEdit.description)
      setSelectedIcon(projectToEdit.icon)
      if (projectToEdit.deadline) setDeadline(projectToEdit.deadline)
      setTasks(projectToEdit.tasks)
    }
  }, [isEditMode, projectToEdit])

  const handleAddTask = () => {
    setTasks([
      ...tasks,
      {
        id: `t${Date.now()}`,
        title: "",
        description: "",
        status: "To Do",
        priority: "MEDIUM",
      },
    ])
  }

  const handleUpdateTask = (id: string, updates: Partial<ProjectTask>) => {
    setTasks(tasks.map((t) => (t.id === id ? { ...t, ...updates } : t)))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter((t) => t.id !== id))
  }

  const handleSubmit = (e?: React.MouseEvent) => {
    if (e) e.preventDefault()
    if (!title) return alert("Please enter a project title.")

    // Build payload mapping strictly to Project interface
    const newProject: Omit<Project, "id" | "progress" | "tasksLeft"> = {
      title,
      status,
      description,
      icon: selectedIcon,
      iconColor: "text-primary dark:text-primary",
      iconBg: "bg-primary/10",
      deadline,
      contributors: projectToEdit ? projectToEdit.contributors : [],
      tasks,
    }

    if (isEditMode && projectToEdit) {
      updateProject(projectToEdit.id, {
        ...newProject,
        id: projectToEdit.id,
        progress: projectToEdit.progress,
        tasksLeft: projectToEdit.tasksLeft,
      } as Project)
      toast.success("Project updated successfully!")
      navigate("/tasks")
    } else {
      addProject(newProject as unknown as Omit<Project, "id">)
      navigate("/tasks")
    }
  }

  return (
    <div className="flex min-h-full flex-col">
      {/* Content Area */}
      <div className="mx-auto w-full max-w-5xl space-y-8 p-4 md:p-8">
        {/* Breadcrumb Header */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/tasks">Projects</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>
                  {isEditMode ? "Update Project" : "Create New Project"}
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight">
            {isEditMode ? "Update Project" : "Create New Project"}
          </h2>
        </div>

        {/* Section: Project Details */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="mb-6">
            <h3 className="flex items-center gap-2 text-lg font-bold">
              <Info className="h-5 w-5 text-primary" />
              Project Details
            </h3>
            <p className="text-sm text-muted-foreground">
              Define the core information of your project
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Title</label>
              <input
                className="h-12 w-full rounded-lg border-2 border-slate-300 bg-background px-3 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-slate-700"
                placeholder="e.g. Brand Refresh 2024"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Status</label>
              <select
                className="h-12 w-full rounded-lg border-2 border-slate-300 bg-background px-3 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-slate-700"
                value={status}
                onChange={(e) => setStatus(e.target.value as Project["status"])}
              >
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea
                className="w-full rounded-lg border-2 border-slate-300 bg-background p-3 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-slate-700"
                placeholder="Briefly describe the project goals and objectives..."
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Icon Selector */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <h3 className="mb-6 text-sm font-bold tracking-wider text-muted-foreground uppercase">
            Select Project Icon
          </h3>
          <div className="custom-scrollbar grid max-h-[300px] grid-cols-5 gap-2 overflow-y-auto p-2 pr-2 sm:grid-cols-8 md:grid-cols-14">
            {AVAILABLE_ICONS.map((iconName) => {
              const IconComponent = (lucideIcons as any)[iconName]
              if (!IconComponent) return null

              const isSelected = selectedIcon === iconName

              return (
                <button
                  key={iconName}
                  type="button"
                  onClick={() => setSelectedIcon(iconName)}
                  className={`flex items-center justify-center rounded-xl p-3 transition-all ${
                    isSelected
                      ? "scale-110 bg-primary text-primary-foreground shadow-lg ring-2 ring-primary ring-offset-2 dark:ring-offset-background"
                      : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <IconComponent className="h-5 w-5" />
                </button>
              )
            })}
          </div>
        </div>

        {/* Section: Timeline */}
        <div className="rounded-xl border border-border bg-card p-8 shadow-sm">
          <div className="flex max-w-lg items-end gap-4">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold">
                Deadline Date {"(Extend Deadline)"}
              </label>
              <div className="relative">
                <CalendarDays className="absolute top-1/2 left-3 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
                <input
                  className="w-full rounded-lg border-2 border-slate-300 bg-background py-3 pr-4 pl-10 transition-all outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 dark:border-slate-700"
                  type="date"
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section: Task Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Tasks Management</h3>
              <p className="text-sm text-muted-foreground">
                Break down the project into smaller tasks
              </p>
            </div>
            <Button
              type="button"
              onClick={handleAddTask}
              className="flex items-center gap-2 px-4 py-2 font-bold transition-all"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </Button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="flex flex-col gap-4 rounded-xl border-2 border-slate-200 bg-card p-5 shadow-sm transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 dark:border-slate-800"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <input
                      className="mb-1 w-full border-none bg-transparent p-0 text-base font-bold outline-none placeholder:text-muted-foreground focus:ring-0"
                      type="text"
                      placeholder="Task Title..."
                      value={task.title}
                      onChange={(e) =>
                        handleUpdateTask(task.id, { title: e.target.value })
                      }
                    />
                    <div className="mt-1 flex items-center gap-2">
                      <select
                        className="cursor-pointer rounded border-none bg-muted px-2 py-1 text-xs font-semibold transition-all outline-none focus:ring-2 focus:ring-primary/20"
                        value={task.status}
                        onChange={(e) =>
                          handleUpdateTask(task.id, {
                            status: e.target.value as
                              | "To Do"
                              | "In Progress"
                              | "Done",
                          })
                        }
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                      <select
                        className="cursor-pointer rounded border-none bg-muted px-2 py-1 text-xs font-semibold transition-all outline-none focus:ring-2 focus:ring-primary/20"
                        value={task.priority || "MEDIUM"}
                        onChange={(e) =>
                          handleUpdateTask(task.id, {
                            priority: e.target.value as
                              | "LOW"
                              | "MEDIUM"
                              | "HIGH"
                              | "CRITICAL",
                          })
                        }
                      >
                        <option value="LOW">Low Priority </option>
                        <option value="MEDIUM">Medium Priority </option>
                        <option value="HIGH">High Priority </option>
                        <option value="CRITICAL">Critical Priority </option>
                      </select>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="rounded-md p-1.5 text-muted-foreground transition-all hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <textarea
                  className="w-full resize-none border-none bg-transparent p-0 text-sm outline-none placeholder:text-muted-foreground/70 focus:ring-0"
                  rows={2}
                  placeholder="Task description (optional)..."
                  value={task.description}
                  onChange={(e) =>
                    handleUpdateTask(task.id, { description: e.target.value })
                  }
                />
              </div>
            ))}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-4 border-t border-border pt-8 pb-12">
          <Button
            variant="outline"
            type="button"
            onClick={() => navigate("/tasks")}
            className="rounded-lg px-6 py-5 text-sm font-bold"
          >
            Cancel
          </Button>

          {isEditMode ? (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  type="button"
                  className="rounded-lg px-8 py-5 text-sm font-bold shadow-lg shadow-primary/20"
                >
                  Update Project
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Confirm Update</AlertDialogTitle>
                  <AlertDialogDescription>
                    Are you sure you want to update this project with the new
                    details?
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleSubmit}>
                    Update Project
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          ) : (
            <Button
              type="button"
              onClick={() => handleSubmit()}
              className="rounded-lg px-8 py-5 text-sm font-bold shadow-lg shadow-primary/20"
            >
              Create Project
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
