import { create } from "zustand"
import { persist } from "zustand/middleware"
import { useExpStore } from "./ExpStore"

export type ProjectStatus = "In Progress" | "Completed" | "Archived"

export interface ProjectTask {
  id: string
  title: string
  description: string
  status: "To Do" | "In Progress" | "Done"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
}

export interface Project {
  id: string
  title: string
  status: ProjectStatus
  description: string
  icon: string
  iconColor: string
  iconBg: string
  progress: number
  tasksLeft: number
  contributors: string[]
  deadline?: string
  tasks: ProjectTask[]
}

interface IProjectStore {
  projects: Project[]
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (projectId: string, projectData: Project) => void
  updateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void
  updateTaskStatus: (projectId: string, taskId: string, newStatus: ProjectTask["status"]) => void
}

export const useProjectStore = create<IProjectStore>()(
  persist(
    (set) => ({
      projects: [],

      addProject: (project) => {
        const id = crypto.randomUUID()
        
        let initialTasks = project.tasks.map(t => ({
          ...t,
          id: t.id || crypto.randomUUID()
        }))

        // Auto-complete tasks if project is born completed
        if (project.status === "Completed") {
          initialTasks = initialTasks.map(t => ({ ...t, status: "Done" }))
        }
        
        const tasksLeft = initialTasks.filter(t => t.status !== "Done").length
        const totalTasks = initialTasks.length
        const progress = totalTasks === 0 ? 0 : Math.round(((totalTasks - tasksLeft) / totalTasks) * 100)

        const newProject: Project = {
          ...project,
          id,
          tasks: initialTasks,
          tasksLeft,
          progress
        }

        set((state) => ({ projects: [...state.projects, newProject] }))
      },

      updateProject: (projectId, projectData) => {
        set((state) => ({
          projects: state.projects.map(p => p.id === projectId ? projectData : p)
        }))
      },

      updateProjectStatus: (projectId, newStatus) => {
        set((state) => {
          return {
            projects: state.projects.map((p) => {
              if (p.id !== projectId) return p

              // If marking as completed, all tasks become done
              if (newStatus === "Completed") {
                return {
                  ...p,
                  status: newStatus,
                  tasksLeft: 0,
                  progress: 100,
                  tasks: p.tasks.map(t => ({ ...t, status: "Done" }))
                }
              }

              // Otherwise just update status
              return { ...p, status: newStatus }
            })
          }
        })
      },

      updateTaskStatus: (projectId, taskId, newStatus) => {
        set((state) => {
          // If task is completed, we want to grant XP outside the set operation later
          let xpToReward = 0

          const newState = {
            projects: state.projects.map((p) => {
              if (p.id !== projectId) return p

              const updatedTasks = p.tasks.map((t) => {
                if (t.id === taskId) {
                  // Capture priority to grant XP if it transitioned to Done
                  if (newStatus === "Done" && t.status !== "Done") {
                    switch (t.priority) {
                      case "LOW": xpToReward = 10; break;
                      case "MEDIUM": xpToReward = 20; break;
                      case "HIGH": xpToReward = 30; break;
                      case "CRITICAL": xpToReward = 40; break;
                      default: xpToReward = 10;
                    }
                  }
                  return { ...t, status: newStatus }
                }
                return t
              })

              const tasksLeft = updatedTasks.filter((t) => t.status !== "Done").length
              const totalTasks = updatedTasks.length
              const progress = totalTasks === 0 ? 0 : Math.round(((totalTasks - tasksLeft) / totalTasks) * 100)

              // Auto-complete project if all tasks are done
              let projectStatus = p.status
              if (tasksLeft === 0 && totalTasks > 0) {
                projectStatus = "Completed"
              } else if (projectStatus === "Completed" && tasksLeft > 0) {
                projectStatus = "In Progress" // reverted from completed
              }

              return {
                ...p,
                status: projectStatus,
                tasks: updatedTasks,
                tasksLeft,
                progress
              }
            })
          }
          
          if (xpToReward > 0) {
            // Wait until next tick to avoid updating another store while rendering
            setTimeout(() => {
              useExpStore.getState().addExp(xpToReward)
            }, 0)
          }

          return newState
        })
      }
    }),
    {
      name: "focusflow-projects-storage"
    }
  )
)
