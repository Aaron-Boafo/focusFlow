
// --- UI & Statistics ---
export interface IStatistics {
    label: string;
    value: string;
    growth: string;
    pct: string;
}

// --- Project Types ---
export type ProjectStatus = "In Progress" | "Completed" | "Archived"

export interface ProjectTask {
  id: string
  title: string
  description: string
  status: "To Do" | "In Progress" | "Done"
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL"
  completedAt?: string
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

export interface IProjectStore {
  projects: Project[]
  isLoading: boolean
  addProject: (project: Omit<Project, "id">) => void
  updateProject: (projectId: string, projectData: Project) => void
  deleteProject: (projectId: string) => void
  updateProjectStatus: (projectId: string, newStatus: ProjectStatus) => void
  updateTaskStatus: (projectId: string, taskId: string, newStatus: ProjectTask["status"]) => void
}

// --- Exp Types ---
export interface IExpStore {
  totalExp: number
  level: number
  isLoading: boolean
  addExp: (amount: number) => void
  getExpForNextLevel: (currentLevel: number) => number
  getExpSinceLastLevel: () => number
  getXpTitle: () => string
  streak: number
  dailyGoal: number
  history: Record<string, number> // date -> xp
  getWeeklyStatus: () => boolean[] // last 7 days
}

// --- Session Types ---
export type SessionStatus = "complete" | "ended" | "progress"
export type SessionType = "Focus" | "Short Break" | "Long Break"

export interface Session {
  id: string
  type: SessionType
  startTime: number // timestamp
  duration: number // total target in seconds
  elapsedTime: number // actual worked in seconds
  status: SessionStatus
  date: string // YYYY-MM-DD for grouping
  exp?: number
}

export interface ISessionStore {
  settings: {
    focus: number
    shortBreak: number
    longBreak: number
    desktopNotifications: boolean
    autoStartBreaks: boolean
  }

  history: Session[]
  activeSessionId: string | null
  isPaused: boolean
  isLoading: boolean

  // Actions
  startSession: (type: SessionType, duration: number) => string
  updateSession: (id: string, elapsedTime: number, status: SessionStatus) => void
  completeSession: (id: string) => void
  endSession: (id: string) => void
  updateSettings: (settings: Partial<ISessionStore["settings"]>) => void

  setActiveSession: (id: string | null) => void
  setPaused: (paused: boolean) => void
  tick: () => void
  resetActiveSession: () => void
  getTodayStats: () => {
    focusHours: number
    streak: number
    rank: number
    sessionsGrowth: string
    focusHoursGrowth: string
    totalStreakDays: number
  }
  syncWithCloud: () => Promise<void>
}

// --- Auth Types ---
export interface AuthUser {
  email: string
  displayName: string
  avatar?: string
  plan?: string
  createdAt?: string
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

export interface AuthResponse {
  status: string
  message?: string
  user: AuthUser
}

export interface AuthContextType {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, pass: string) => Promise<void>
  signup: (name: string, email: string, pass: string) => Promise<void>
  logout: () => void
  refresh: () => Promise<void>
  fetchUser: () => Promise<void>
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
    isLoading: boolean
    
    // Actions
    updateUser: (data: Partial<AppState["user"]>) => void
    addFocusSession: (hours: number) => void
}

// --- Storage Types ---
export interface StorageStrategy {
  getData<T>(key: string): Promise<T | null>;
  saveData<T>(key: string, data: T): Promise<void>;
  deleteData(key: string): Promise<void>;
  clearAll?(): Promise<void>;
}

// --- Legacy/Common Types ---
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
