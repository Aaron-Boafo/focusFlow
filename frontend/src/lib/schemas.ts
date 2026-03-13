import { z } from "zod"

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
})

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

// Project & Task Schemas
export const projectTaskSchema = z.object({
  title: z.string().min(1, "Task title is required"),
  status: z.enum(["To Do", "In Progress", "Done"]),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  description: z.string().optional(),
})

export const projectSchema = z.object({
  title: z.string().min(2, "Project title must be at least 2 characters"),
  description: z.string().min(5, "Please provide a more detailed description"),
  status: z.enum(["In Progress", "Completed", "Archived"]),
  icon: z.string().min(1, "Icon selection is required"),
  tasks: z.array(projectTaskSchema).min(1, "At least one task is required"),
})

// Account Settings Schema
export const accountUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  password: z.string().min(8, "New password must be at least 8 characters").optional().or(z.string().length(0)),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type ProjectInput = z.infer<typeof projectSchema>
export type AccountUpdateInput = z.infer<typeof accountUpdateSchema>
