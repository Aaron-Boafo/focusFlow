import axios, { type AxiosInstance } from "axios";

export class ApiService {
  private static api: AxiosInstance = axios.create({
    baseURL: "http://localhost:5000/api",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });

  private static isRefreshing = false;
  private static refreshSubscribers: ((token: string) => void)[] = [];

  private static onRefreshed(token: string) {
    this.refreshSubscribers.map((cb) => cb(token));
    this.refreshSubscribers = [];
  }

  private static addRefreshSubscriber(cb: (token: string) => void) {
    this.refreshSubscribers.push(cb);
  }

  static setupInterceptors(onAuthFailure: () => void) {
    this.api.interceptors.response.use(
      (response) => response,
      async (error) => {
        const { config, response } = error;
        const originalRequest = config;

        if (response?.status === 401 && !originalRequest._retry) {
          if (this.isRefreshing) {
            return new Promise((resolve) => {
              this.addRefreshSubscriber(() => {
                resolve(this.api(originalRequest));
              });
            });
          }

          originalRequest._retry = true;
          this.isRefreshing = true;

          try {
            // Refresh call will use HttpOnly refresh cookie
            await this.post("/auth/refresh", {});
            this.isRefreshing = false;
            this.onRefreshed("refreshed"); // dummy signal
            
            return this.api(originalRequest);
          } catch (refreshError) {
            this.isRefreshing = false;
            onAuthFailure();
            return Promise.reject(refreshError);
          }
        }

        return Promise.reject(error);
      }
    );
  }

  static async getUser<T>(): Promise<T> {
    return this.get<T>("/auth/me");
  }

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
