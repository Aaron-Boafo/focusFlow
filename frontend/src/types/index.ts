export interface IFeatures {
    icon: React.ReactNode;
    title: string;
    desc: string;
}

export interface IStatistics {
    label: string;
    value: string;
    growth: string;
    pct: string;
}

export type Task = {
    id: string
    title: string
    category: string
    time: string
    completed: boolean
}

export type ProductivityData = {
    day: string
    hours: number
    total: number
}

export type KanbanStatus = "todo" | "in-progress" | "done"

export interface KanbanTask {
    id: string
    title: string
    description: string
    status: KanbanStatus
    priority: "High Priority" | "Medium" | "Low" | "Completed" | "In Review"
    xp: number
    assignees?: string[] // avatar URLs
    date?: string
    progress?: number // 0-100 for "In Progress" tasks
    attachments?: number
    checklistData?: string // e.g. "8/12"
}

export interface AppState {
    user: {
        name: string
        password?: string
        plan: string
        xpLevel: number
        xpTitle: string
        xpProgress: number
        xpToNext: number
    }
    
    // Actions
    updateUser: (data: Partial<AppState["user"]>) => void
}

export interface AuthUser {
  id: string
  email: string
  name: string
  avatar?: string
}

export interface IAuthStore {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  signup: (name: string, email: string, pass: string) => Promise<void>
  logout: () => void
  skipToDemo: () => void
}
