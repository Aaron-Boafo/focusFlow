import type { AuthUser } from "./index";

/**
 * Authentication Types
 */
export interface LoginRequest {
  email: string;
  password?: string; // Optional for now as backend is mocked
}

export interface LoginResponse {
  user: AuthUser;
  token: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password?: string;
}

export interface SignupResponse {
  user: AuthUser;
  token: string;
}

/**
 * Storage Types
 * The key in the URL identifies what data is being retrieved/saved.
 */
export type StorageKey = 
  | "focusflow-project-storage" 
  | "focusflow-exp-storage" 
  | "focusflow-session-storage"
  | "focusflow-auth-storage";

export interface StorageGetResponse<T> {
  data: T | null;
}

export interface StorageSaveRequest<T> {
  data: T;
}

export interface StorageDeleteResponse {
  success: boolean;
  message?: string;
}
