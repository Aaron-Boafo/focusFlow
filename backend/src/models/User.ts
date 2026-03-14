import { Project } from "./Project";
import { Session } from "./Session";

export interface UserSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  desktopNotifications: boolean;
  autoStartBreaks: boolean;
}

export interface User {
  uid: string;
  email: string;
  name: string;
  avatar?: string;
  plan: string;
  
  // Progression
  xpLevel: number;
  xpTitle: string;
  xpProgress: number; // 0-100
  xpToNext: number;
  
  // Stats
  streak: number;
  dailyGoal: number; // in hours or sessions? (frontend uses hours in some places, but let's stick to simple number)
  
  settings: UserSettings;
  
  createdAt: number;
  updatedAt: number;
}
