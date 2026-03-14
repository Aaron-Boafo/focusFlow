export type ProjectStatus = "In Progress" | "Completed" | "Archived";

export interface ProjectTask {
  id: string;
  title: string;
  description: string;
  status: "To Do" | "In Progress" | "Done";
  priority: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  completedAt?: string; // ISO string
}

export interface Project {
  id: string;
  userId: string;
  title: string;
  status: ProjectStatus;
  description: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  progress: number;
  tasksLeft: number;
  contributors: string[];
  deadline?: string;
  tasks: ProjectTask[];
  createdAt: number;
  updatedAt: number;
}
