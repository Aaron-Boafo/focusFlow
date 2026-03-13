import { Link } from "react-router-dom"
import { Search, Plus, Target, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useProjectStore } from "@/store/ProjectStore"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb"

import * as lucideIcons from "lucide-react"
import { useState } from "react"
import { type ProjectStatus } from "@/store/ProjectStore"

export function ProjectsScreen() {
  const { projects } = useProjectStore()
  const [searchQuery, setSearchQuery] = useState("")
  const [activeTab, setActiveTab] = useState<ProjectStatus | "All">("All")

  const filteredProjects = projects.filter((project) => {
    const matchesSearch = 
      project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      project.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesTab = activeTab === "All" || project.status === activeTab

    return matchesSearch && matchesTab
  })

  return (
    <div className="flex flex-col min-h-full">
      {/* Content Area */}
      <div className="p-4 md:p-8 max-w-7xl mx-auto w-full">
        <div className="mb-8">
          <div className="mb-4">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbPage>Projects</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="text-3xl font-black tracking-tight mb-2">My Initiatives</h3>
              <p className="text-muted-foreground">Manage and track your ongoing team projects and deliverables.</p>
            </div>
            
            <div className="hidden md:flex items-center gap-4">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                <input 
                  className="pl-10 pr-4 py-2 bg-muted border-none rounded-lg text-sm w-64 focus:ring-2 focus:ring-primary transition-all outline-none" 
                  placeholder="Search projects..." 
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Link to="/tasks/new">
                <Button className="flex items-center gap-2 rounded-lg font-bold shadow hover:shadow-lg hover:shadow-primary/20 transition-all">
                  <Plus className="w-4 h-4" />
                  New Project
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-border mb-8 gap-8 overflow-x-auto">
          {[
            { label: "All Projects", id: "All" },
            { label: "In Progress", id: "In Progress" },
            { label: "Completed", id: "Completed" },
            { label: "Archived", id: "Archived" }
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-4 border-b-2 text-sm transition-colors whitespace-nowrap ${
                activeTab === tab.id 
                  ? "border-primary text-primary font-bold" 
                  : "border-transparent text-muted-foreground hover:text-foreground font-medium"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Project Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {filteredProjects.map((project) => {
            const Icon = (lucideIcons as any)[project.icon] || Target

            // Generate status badge styling dynamically based on status text
            let statusBadge = "bg-slate-100 dark:bg-slate-800 text-slate-500"
            if (project.status === "In Progress") statusBadge = "bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400"
            if (project.status === "Completed") statusBadge = "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"

            return (
              <div key={project.id} className="bg-card border border-border rounded-xl p-6 hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-none transition-all flex flex-col">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${project.iconBg} ${project.iconColor}`}>
                    <Icon className="w-7 h-7" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Link to={`/tasks/edit/${project.id}`} className="p-1.5 text-muted-foreground hover:bg-muted rounded-md transition-all">
                      <Edit className="w-4 h-4" />
                    </Link>
                    <span className={`text-xs font-bold px-2 py-1 rounded ${statusBadge}`}>{project.status}</span>
                  </div>
                </div>
                <h4 className="text-lg font-bold mb-2">{project.title}</h4>
                <p className="text-muted-foreground text-sm mb-6 line-clamp-2">{project.description}</p>
                <div className="mt-auto">
                  <div className="flex justify-between items-center text-sm mb-2">
                    <span className="font-medium text-muted-foreground">Progress</span>
                    <span className="font-bold">{project.progress}%</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mb-6 relative">
                    <div className="absolute top-0 left-0 h-full bg-primary rounded-full transition-all duration-500" style={{ width: `${project.progress}%` }}></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-3 overflow-hidden">
                      {project.tasks.slice(0, 6).map((task, i) => {
                        const initial = task.title.trim().charAt(0).toUpperCase() || "?"
                        // Cycle through some colors based on index or title char code
                        const bgColors = [
                          "bg-blue-500", "bg-purple-500", "bg-pink-500", 
                          "bg-amber-500", "bg-emerald-500", "bg-indigo-500"
                        ]
                        const bgColor = bgColors[i % bgColors.length]
                        
                        return (
                          <div 
                            key={task.id} 
                            className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-white shadow-sm ${bgColor}`}
                            title={task.title}
                          >
                            {initial}
                          </div>
                        )
                      })}
                      {project.tasks.length > 6 && (
                        <div className="w-8 h-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-[10px] font-bold text-muted-foreground shadow-sm">
                          +{project.tasks.length - 6}
                        </div>
                      )}
                    </div>
                    {project.tasksLeft > 0 && <span className="text-xs text-muted-foreground font-medium">{project.tasksLeft} tasks left</span>}
                  </div>
                  <Link to={`/tasks/${project.id}`}>
                    <button className="w-full mt-6 py-2 border border-border text-foreground text-sm font-bold rounded-lg hover:bg-muted transition-colors">
                      View Board
                    </button>
                  </Link>
                </div>
              </div>
            )
          })}

          {/* Add New Project Card Placeholder */}
          <Link to="/tasks/new" className="block w-full h-full">
            <button className="w-full border-2 border-dashed border-border rounded-xl p-6 flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-all group min-h-[320px]">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                <Plus className="w-8 h-8" />
              </div>
              <span className="text-sm font-bold text-foreground group-hover:text-primary">Start New Project</span>
              <span className="text-xs mt-1">Add a new initiative to your flow</span>
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}
