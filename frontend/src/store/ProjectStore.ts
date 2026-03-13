import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"
import { useExpStore } from "./ExpStore"
import { createZustandStorage } from "@/services/storageService"
import type { IProjectStore, Project, ProjectStatus, ProjectTask } from "@/types"

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
          const now = new Date().toISOString()
          initialTasks = initialTasks.map(t => ({ ...t, status: "Done", completedAt: now }))
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
          projects: state.projects.map(p => {
            if (p.id !== projectId) return p
            
            const tasksLeft = projectData.tasks.filter(t => t.status !== "Done").length
            const totalTasks = projectData.tasks.length
            const progress = totalTasks === 0 ? 0 : Math.round(((totalTasks - tasksLeft) / totalTasks) * 100)

            return {
              ...projectData,
              tasksLeft,
              progress
            }
          })
        }))
      },

      deleteProject: (projectId) => {
        set((state) => ({
          projects: state.projects.filter(p => p.id !== projectId)
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
                  tasks: p.tasks.map(t => ({ ...t, status: "Done", completedAt: t.completedAt || new Date().toISOString() }))
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
                  const priorityXP = {
                    LOW: 10,
                    MEDIUM: 20,
                    HIGH: 30,
                    CRITICAL: 40
                  }[t.priority] || 10

                  // If task is moving to Done, reward XP
                  if (newStatus === "Done" && t.status !== "Done") {
                    xpToReward = priorityXP
                  } 
                  // If task is moving OUT of Done, reduce XP
                  else if (t.status === "Done" && newStatus !== "Done") {
                    xpToReward = -priorityXP
                  }

                  return { 
                    ...t, 
                    status: newStatus,
                    completedAt: newStatus === "Done" ? (t.completedAt || new Date().toISOString()) : undefined
                  }
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
          
          if (xpToReward !== 0) {
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
      name: "focusflow-projects-storage",
      storage: createJSONStorage(() => createZustandStorage()),
      version: 1
    }
  )
)
