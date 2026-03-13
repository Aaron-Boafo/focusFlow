import axios from "axios";

export class ApiService {
  private static api = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
  });

  static async get<T>(endpoint: string): Promise<T> {
    const response = await this.api.get<T>(endpoint);
    return response.data;
  }

  static async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.post<T>(endpoint, data);
    return response.data;
  }

  static async put<T>(endpoint: string, data: any): Promise<T> {
    const response = await this.api.put<T>(endpoint, data);
    return response.data;
  }

  static async delete<T>(endpoint: string): Promise<T> {
    const response = await this.api.delete<T>(endpoint);
    return response.data;
  }
}
