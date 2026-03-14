export type SessionStatus = "complete" | "ended" | "progress";
export type SessionType = "Focus" | "Short Break" | "Long Break";

export interface Session {
  id: string;
  userId: string;
  type: SessionType;
  startTime: number; // timestamp
  duration: number; // target in seconds
  elapsedTime: number; // actual worked in seconds
  status: SessionStatus;
  date: string; // YYYY-MM-DD
  exp?: number;
  createdAt: number;
}
