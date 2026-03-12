import { create } from "zustand"
import { persist } from "zustand/middleware"

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

interface AppState {
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

  // Actions
  completeTask: (taskId: string) => void
  addFocusSession: (durationHours: number) => void
  moveKanbanTask: (taskId: string, newStatus: KanbanStatus) => void
  addKanbanTask: (task: Omit<KanbanTask, "id">) => void
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Design UI Dashboard",
    category: "Product Design",
    time: "10:00 AM",
    completed: false,
  },
  {
    id: "2",
    title: "Team Meeting",
    category: "Communication",
    time: "2:00 PM",
    completed: false,
  },
  {
    id: "3",
    title: "Review Pull Requests",
    category: "Development",
    time: "4:30 PM",
    completed: false,
  },
]

const initialProductivity: ProductivityData[] = [
  { day: "Mon", hours: 6.5, total: 10 },
  { day: "Tue", hours: 4.5, total: 10 },
  { day: "Wed", hours: 8.5, total: 10 },
  { day: "Thu", hours: 5.5, total: 10 },
  { day: "Fri", hours: 9.5, total: 10 },
  { day: "Sat", hours: 3.0, total: 10 },
  { day: "Sun", hours: 4.0, total: 10 },
]

const initialKanbanTasks: KanbanTask[] = [
  {
    id: "k1",
    title: "Design System Update",
    description: "Update the UI components to rounded-lg corners across all landing pages.",
    status: "todo",
    priority: "High Priority",
    xp: 50,
    date: "Oct 24",
    assignees: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcMdyZzhXY4c_j9qJUwzbgFhia2DNqWhZsl1bUCALc4hO8bXgXwKOgMywYKXFTgRXpSEuzTXmr2C7tBFq0mqvzGMnzu2trQVjgTLIc_IwU7X4SX1PfF5q2c_Hxw3z0e95db8OsE6aIPsKfTLdZ3krmLzfS-j-1JzFza3hQH5-Brk15LqsSx95GQ0lbCXu0w-H0pNNX1czxLtms6fqdhFMB7POzQaeLs2xC05ZPGoBJCZ4gQnuauQ-FVPN-x3yJqtB3Qy5rPHwVwg",
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBdLR2eaYpE8wTZ16LCEdkYiugRXXlbuF582FEl7mlc5ICfjrqxLjtomZ3hVieVqfNQ2MHIYsyE3xcHMalTPovzrpijdQ6NwQIcPW66bg1oAQOrUJslNTrv0KcUFQ-u1fddO5F6ikSFEW9o5BNya63BE1N_lzczZAfJyZQOXIsLPFRwP-nd3usclOtieT2ZtB8S1-hrEnAAIBZHJxWki480PaOVsTZY9Hy2xwp0Hm0eAkpS8qtF6ReC8vHZAteFF7bz3DMusJ-U2Q"
    ],
  },
  {
    id: "k2",
    title: "User Feedback Analysis",
    description: "Compile and categorize the feedback from last month's beta testers.",
    status: "todo",
    priority: "Medium",
    xp: 30,
    assignees: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCgxCEmw_erLIRki_bo1ODqoF6aSlv8ht7_7nsLhYz0IsxWaMjLoaN48HGolC18hwj6C122ZoeyD4RGYg-wxbXnicV6tSUN2fxe_16jhNUrOI4EHT7bLRBnHj_Mx03A1Q-9gF9LeDnR_899pDfR_SWU5ZuQrLUxAQNhalO4SmKoxj3E35fMA4pDdC1L-8LYBDEdOj7vh5YNfONZ_RPmulp8MdzLtzgAg1hznIyrFTIeHupO7OsBuAMDz7_bNMRzOKjWLIA38F870Q"
    ],
  },
  {
    id: "k3",
    title: "API Integration: Stripe",
    description: "Finish the subscription management webhooks and testing.",
    status: "in-progress",
    priority: "In Review",
    xp: 75,
    progress: 65,
    attachments: 3,
    checklistData: "8/12",
    assignees: [
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCKkfZ7NVKQxuzuy3yaWvc5v_oL_7Dnp_La-k-GreERhy1d-0EbW4U6IMtm7zvcKFZ9ETN2gm_XRc8oJyjfWTftMPkvPGG8Ag_RjCiIDP2u2MHx-Rg3u6B5ZByDq0wDxB6G49mAPWtXerllk5QfzQFfkTHsFlGw0ar_obMn55feQOn3MWZon2r4a4cAIkvK392QcBvnRcjKGhhqsJqCWYuXXvNtosB_GySZD_t57q3gVh9vUi2NrRhekqv1J57UV8hSosqw0sy8CA"
    ],
  },
  {
    id: "k4",
    title: "Landing Page Hero Animation",
    description: "Implement the Lottie animations for the main hero section.",
    status: "done",
    priority: "Completed",
    xp: 100,
    date: "Yesterday",
  },
  {
    id: "k5",
    title: "Bug: Login Redirect",
    description: "Fixed the issue where users were redirected to 404 after login.",
    status: "done",
    priority: "Completed",
    xp: 50,
    date: "Oct 20",
  },
]

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: {
        name: "Alex",
        plan: "Pro Plan",
        xpLevel: 12,
        xpTitle: "Focus Master",
        xpProgress: 65,
        xpToNext: 350,
      },
      stats: {
        tasksCompletedToday: 12,
        tasksTotalToday: 15,
        tasksGrowth: "+12%",
        sessions: 8,
        sessionsGrowth: "+4%",
        focusHours: 28.5,
        focusHoursGrowth: "+2.4h",
        streakDays: 5,
      },
      productivityData: initialProductivity,
      nextTasks: initialTasks,
      kanbanTasks: initialKanbanTasks,

      completeTask: (taskId) =>
        set((state) => ({
          nextTasks: state.nextTasks.map((t) =>
            t.id === taskId ? { ...t, completed: true } : t
          ),
          stats: {
            ...state.stats,
            tasksCompletedToday: state.stats.tasksCompletedToday + 1,
          },
        })),

      addFocusSession: (hours) =>
        set((state) => ({
          stats: {
            ...state.stats,
            sessions: state.stats.sessions + 1,
            focusHours: state.stats.focusHours + hours,
          },
        })),

      moveKanbanTask: (taskId, newStatus) =>
        set((state) => ({
          kanbanTasks: state.kanbanTasks.map((t) =>
            t.id === taskId ? { ...t, status: newStatus } : t
          ),
        })),

      addKanbanTask: (task) =>
        set((state) => ({
          kanbanTasks: [
            ...state.kanbanTasks,
            { ...task, id: `k${Date.now()}` },
          ],
        })),
    }),
    {
      name: "focusflow-storage", // unique name for localStorage key
    }
  )
)
