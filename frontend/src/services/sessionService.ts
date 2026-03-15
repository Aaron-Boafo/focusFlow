import { ApiService } from "./apiService";
import type { Session } from "@/types";

export class SessionService {
  private static baseURL = "/sessions";

  static async getSessions(): Promise<Session[]> {
    const response = await ApiService.get<{ status: string; data: Session[] }>(this.baseURL);
    return response.data;
  }

  static async createSession(session: Session): Promise<Session> {
    const response = await ApiService.post<{ status: string; data: Session }>(this.baseURL, session);
    return response.data;
  }

  static async updateSession(id: string, updates: Partial<Session>): Promise<void> {
    await ApiService.put(`${this.baseURL}/${id}`, updates);
  }

  static async deleteSession(id: string): Promise<void> {
    await ApiService.delete(`${this.baseURL}/${id}`);
  }

  static async deleteMultipleSessions(ids: string[]): Promise<void> {
    await ApiService.delete(`${this.baseURL}/bulk`, { ids });
  }

  static async syncSessions(sessions: Session[]): Promise<void> {
    await ApiService.post(`${this.baseURL}/sync`, { sessions });
  }
}
