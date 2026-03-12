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

export interface ProjectTask {
    id: string
    title: string
    status: "To Do" | "In Progress" | "Done"
    image?: string // optional image URL
}

export interface Project {
    id: string
    title: string
    status: "Active" | "Completed" | "Archived" | "Planned" | "At Risk" | "On Track"
    description: string
    icon: string // Lucide icon name, e.g., "Target"
    iconColor: string // Tailwind color class, e.g., "text-blue-600 dark:text-blue-400"
    iconBg: string // Tailwind bg class
    difficulty: "Easy" | "Medium" | "Hard"
    importance: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
    deadline: string // e.g. "2024-12-31"
    progress: number // 0-100
    tasksLeft: number
    contributors: string[] // User avatars or IDs
    tasks: ProjectTask[]
}

export interface AppState {
    user: {
        name: string
        plan: string
        xpLevel: number
        xpTitle: string
        xpProgress: number
        xpToNext: number
    }
    stats: {
        tasksCompletedToday: number
        tasksTotalToday: number
        tasksGrowth: string
        sessions: number
        sessionsGrowth: string
        focusHours: number
        focusHoursGrowth: string
        streakDays: number
    }
    productivityData: ProductivityData[]
    nextTasks: Task[]
    kanbanTasks: KanbanTask[]
    projects: Project[]

    // Actions
    completeTask: (taskId: string) => void
    addFocusSession: (durationHours: number) => void
    moveKanbanTask: (taskId: string, newStatus: KanbanStatus) => void
    addKanbanTask: (task: Omit<KanbanTask, "id">) => void
    addProject: (project: Omit<Project, "id">) => void
}
