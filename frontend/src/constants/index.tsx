import { CheckCircle2, Timer, BarChart3 } from "lucide-react"
import type { IStatistics, IFeatures } from "@/types"

export const features: IFeatures[] = [
  {
    icon: <CheckCircle2 className="h-7 w-7" />,
    title: "Task Management",
    desc: "Organize your day with intuitive drag-and-drop tasks, subtasks, and priority levels.",
  },
  {
    icon: <Timer className="h-7 w-7" />,
    title: "Pomodoro Timer",
    desc: "Use the classic focus method with customizable session lengths and break intervals.",
  },
  {
    icon: <BarChart3 className="h-7 w-7" />,
    title: "Deep Analytics",
    desc: "Visualize your focus patterns over time and discover when you are most productive.",
  },
]

export const Statistics: IStatistics[] = [
  {
    label: "Active Users",
    value: "10k+",
    growth: "+12%",
    pct: "70%",
  },
  {
    label: "Focus Hours",
    value: "250k+",
    growth: "+18%",
    pct: "85%",
  },
  {
    label: "Tasks Completed",
    value: "1M+",
    growth: "+25%",
    pct: "92%",
  },
]
