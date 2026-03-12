import { Link } from "react-router-dom"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useAppStore } from "@/store/useAppStore"
import type { Project, ProjectTask } from "@/store/useAppStore"
import * as lucideIcons from "lucide-react"
import { Info, CalendarDays, Calendar, Plus, Trash2, Edit, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

const AVAILABLE_ICONS = [
  "Rocket", "Brush", "Code", "Camera", "Database", "Palette", 
  "Globe", "Terminal", "Megaphone", "Activity", "Users", "LayoutDashboard",
  "Target", "Smartphone", "TrendingUp", "HeadphonesIcon", "CodeSquare", "Briefcase",
  "Lightbulb", "Compass", "Layers", "Cpu", "Server", "Shield",
  "Wrench", "Zap", "Anchor", "Award", "Book", "Box",
  "Coffee", "Command", "Cpu", "Crosshair", "Feather", "Flag",
  "Gift", "Key", "Map", "Monitor", "Navigation", "Package"
]

export function NewProjectScreen() {
  const navigate = useNavigate()
  const { addProject } = useAppStore()

  // Form State
  const [title, setTitle] = useState("")
  const [status, setStatus] = useState<Project["status"]>("Active")
  const [description, setDescription] = useState("")
  const [selectedIcon, setSelectedIcon] = useState("Rocket")
  
  const [difficulty, setDifficulty] = useState<Project["difficulty"]>("Medium")
  const [importance, setImportance] = useState<Project["importance"]>("MEDIUM")
  const [deadline, setDeadline] = useState("2024-12-31")

  // Tasks State
  const [tasks, setTasks] = useState<ProjectTask[]>([
    { id: "t1", title: "Create Initial Wireframes", status: "To Do" }
  ])

  const handleAddTask = () => {
    setTasks([...tasks, { id: `t${Date.now()}`, title: "", status: "To Do" }])
  }

  const handleUpdateTask = (id: string, updates: Partial<ProjectTask>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates } : t))
  }

  const handleDeleteTask = (id: string) => {
    setTasks(tasks.filter(t => t.id !== id))
  }

  const handleSubmit = () => {
    if (!title) return alert("Please enter a project title.")

    // Build payload mapping strictly to Project interface
    const newProject: Omit<Project, "id"> = {
      title,
      status,
      description,
      icon: selectedIcon,
      iconColor: "text-primary dark:text-primary",
      iconBg: "bg-primary/10",
      difficulty,
      importance,
      deadline,
      progress: 0,
      tasksLeft: tasks.length,
      contributors: [], // could be expanded later
      tasks
    }

    addProject(newProject)
    navigate("/tasks")
  }

  return (
    <div className="flex flex-col min-h-full">
      {/* Content Area */}
      <div className="p-4 md:p-8 max-w-5xl mx-auto w-full space-y-8">
        
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
                <BreadcrumbPage>Create New Project</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <div>
          <h2 className="text-3xl font-black tracking-tight">Create New Project</h2>
        </div>

        {/* Section: Project Details */}
        <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
          <div className="mb-6">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Info className="w-5 h-5 text-primary" />
              Project Details
            </h3>
            <p className="text-sm text-muted-foreground">Define the core information of your project</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Title</label>
              <input 
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-background focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 px-3 outline-none transition-all" 
                placeholder="e.g. Brand Refresh 2024" 
                type="text" 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold">Project Status</label>
              <select 
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-background focus:border-primary focus:ring-4 focus:ring-primary/20 h-12 px-3 outline-none transition-all"
                value={status}
                onChange={(e) => setStatus(e.target.value as Project["status"])}
              >
                <option value="Active">Active</option>
                <option value="Planned">Planned</option>
                <option value="On Track">On Track</option>
                <option value="At Risk">At Risk</option>
                <option value="Completed">Completed</option>
                <option value="Archived">Archived</option>
              </select>
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm font-semibold">Description</label>
              <textarea 
                className="w-full rounded-lg border-2 border-slate-300 dark:border-slate-700 bg-background focus:border-primary focus:ring-4 focus:ring-primary/20 p-3 outline-none transition-all" 
                placeholder="Briefly describe the project goals and objectives..." 
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Section: Customization */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Icon Selector */}
          <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
            <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Select Project Icon</h3>
            <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-6 gap-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {AVAILABLE_ICONS.map((iconName) => {
                const IconComponent = (lucideIcons as any)[iconName]
                if (!IconComponent) return null
                
                const isSelected = selectedIcon === iconName
                
                return (
                  <button
                    key={iconName}
                    type="button"
                    onClick={() => setSelectedIcon(iconName)}
                    className={`aspect-square flex items-center justify-center rounded-lg transition-all ${
                      isSelected 
                        ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 dark:ring-offset-background scale-110 shadow-lg" 
                        : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </button>
                )
              })}
            </div>
          </div>

          {/* Difficulty & Importance */}
          <div className="space-y-6">
            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Difficulty Level</h3>
              <div className="flex p-1 bg-muted rounded-lg">
                <button 
                  type="button"
                  onClick={() => setDifficulty("Easy")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${difficulty === "Easy" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >Easy</button>
                <button 
                  type="button"
                  onClick={() => setDifficulty("Medium")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${difficulty === "Medium" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >Medium</button>
                <button 
                  type="button"
                  onClick={() => setDifficulty("Hard")}
                  className={`flex-1 py-2 text-sm font-semibold rounded-md transition-all ${difficulty === "Hard" ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"}`}
                >Hard</button>
              </div>
            </div>
            
            <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
              <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-6">Importance Level</h3>
              <div className="flex flex-wrap gap-3">
                <span onClick={() => setImportance("LOW")} className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${importance === "LOW" ? "bg-primary/20 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}>LOW</span>
                <span onClick={() => setImportance("MEDIUM")} className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${importance === "MEDIUM" ? "bg-primary/20 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}>MEDIUM</span>
                <span onClick={() => setImportance("HIGH")} className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${importance === "HIGH" ? "bg-primary/20 text-primary ring-1 ring-primary/30" : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"}`}>HIGH</span>
                <span onClick={() => setImportance("CRITICAL")} className={`px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer transition-all ${importance === "CRITICAL" ? "bg-destructive/20 text-destructive ring-1 ring-destructive/30" : "bg-muted text-muted-foreground hover:bg-destructive/10 hover:text-destructive"}`}>CRITICAL</span>
              </div>
            </div>
          </div>

        </div>

        {/* Section: Timeline */}
        <div className="bg-card p-8 rounded-xl border border-border shadow-sm">
          <div className="flex items-end gap-4 max-w-lg">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-semibold">Deadline Date</label>
              <div className="relative">
                <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input 
                  className="w-full pl-10 pr-4 py-3 border-2 border-slate-300 dark:border-slate-700 bg-background rounded-lg focus:ring-4 focus:ring-primary/20 focus:border-primary outline-none transition-all" 
                  type="date" 
                  value={deadline}
                  onChange={(e) => setDeadline(e.target.value)}
                />
              </div>
            </div>
            <button className="h-[50px] px-4 border border-primary text-primary hover:bg-primary/5 rounded-lg text-sm font-bold transition-all flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Extend
            </button>
          </div>
        </div>

        {/* Section: Task Management */}
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold">Tasks Management</h3>
              <p className="text-sm text-muted-foreground">Break down the project into smaller tasks</p>
            </div>
            <Button type="button" onClick={handleAddTask} className="flex items-center gap-2 px-4 py-2 font-bold transition-all">
              <Plus className="w-4 h-4" />
              Add Task
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {tasks.map(task => (
              <div key={task.id} className="bg-card p-5 rounded-xl border-2 border-slate-200 dark:border-slate-800 shadow-sm flex flex-col gap-4 transition-all focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <input 
                      className="text-base font-bold bg-transparent border-none p-0 focus:ring-0 w-full mb-1 outline-none placeholder:text-muted-foreground" 
                      type="text" 
                      placeholder="Task Title..."
                      value={task.title}
                      onChange={e => handleUpdateTask(task.id, { title: e.target.value })}
                    />
                    <div className="flex items-center gap-2 mt-1">
                      <select 
                        className="text-xs font-semibold bg-muted border-none rounded px-2 py-1 outline-none focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
                        value={task.status}
                        onChange={e => handleUpdateTask(task.id, { status: e.target.value as "To Do" | "In Progress" | "Done" })}
                      >
                        <option value="To Do">To Do</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Done">Done</option>
                      </select>
                    </div>
                  </div>
                  <button 
                    type="button"
                    onClick={() => handleDeleteTask(task.id)}
                    className="p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive rounded-md transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                
                {/* Image Upload Area Placeholder */}
                {task.image ? (
                  <div className="relative group cursor-pointer h-32 rounded-lg border-2 border-dashed border-border overflow-hidden">
                    <img alt="Task preview" className="w-full h-full object-cover" src={task.image} />
                    <div className="absolute inset-0 bg-background/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity gap-3">
                      <button type="button" className="size-8 rounded-full bg-background text-foreground flex items-center justify-center hover:bg-muted shadow">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button type="button" onClick={() => handleUpdateTask(task.id, { image: undefined })} className="size-8 rounded-full bg-background text-destructive flex items-center justify-center hover:bg-muted shadow">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="h-32 rounded-lg border-2 border-dashed border-slate-300 dark:border-slate-700 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900/50 hover:bg-muted hover:border-primary/50 transition-colors cursor-pointer text-muted-foreground group">
                    <ImageIcon className="w-8 h-8 mb-2 group-hover:text-primary transition-colors" />
                    <span className="text-xs font-medium group-hover:text-primary transition-colors">Click to upload image</span>
                  </div>
                )}
              </div>
            ))}
            
          </div>
        </div>

        {/* Form Actions */}
        <div className="pt-8 border-t border-border flex items-center justify-end gap-4 pb-12">
          <Button variant="outline" type="button" onClick={() => navigate("/tasks")} className="px-6 py-5 rounded-lg text-sm font-bold">
            Cancel
          </Button>
          <Button type="button" onClick={handleSubmit} className="px-8 py-5 rounded-lg text-sm font-bold shadow-lg shadow-primary/20">
            Create Project
          </Button>
        </div>

      </div>
    </div>
  )
}
