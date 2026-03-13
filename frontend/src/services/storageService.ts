import { ApiService } from "./apiService";
import type { StorageStrategy } from "@/types";

export class LocalStorageStrategy implements StorageStrategy {
  async getData<T>(key: string): Promise<T | null> {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  async saveData<T>(key: string, data: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(data));
  }

  async deleteData(key: string): Promise<void> {
    localStorage.removeItem(key);
  }

  async clearAll(): Promise<void> {
    localStorage.clear();
  }
}

export class ServerStorageStrategy implements StorageStrategy {
  async getData<T>(key: string): Promise<T | null> {
    try {
      return await ApiService.get<T>(`/storage/${key}`);
    } catch (error) {
      console.warn(`Failed to fetch ${key} from server, falling back to null:`, error);
      return null;
    }
  }

  async saveData<T>(key: string, data: T): Promise<void> {
    try {
      await ApiService.post(`/storage/${key}`, data);
    } catch (error) {
      console.error(`Failed to save ${key} to server:`, error);
    }
  }

  async deleteData(key: string): Promise<void> {
    try {
      await ApiService.delete(`/storage/${key}`);
    } catch (error) {
      console.error(`Failed to delete ${key} from server:`, error);
    }
  }
}

export class StorageService {
  private strategy: StorageStrategy;

  constructor(isAuthenticated: boolean) {
    this.strategy = isAuthenticated
      ? new ServerStorageStrategy()
      : new LocalStorageStrategy();
  }

  async getItem<T>(name: string): Promise<T | null> {
    return this.strategy.getData<T>(name);
  }

  async setItem<T>(name: string, value: T): Promise<void> {
    return this.strategy.saveData<T>(name, value);
  }

  async removeItem(name: string): Promise<void> {
    return this.strategy.deleteData(name);
  }
}

/**
 * Creates a Zustand-compatible storage adapter that dynamically
 * switches strategies based on the current Auth state.
 */
export const createZustandStorage = () => {
  return {
    getItem: async (name: string): Promise<string | null> => {
      // We need to peek at the auth state to decide the strategy
      // This is a bit tricky since we can't easily rely on useAuthStore.getState() 
      // during hydration if it's not ready. 
      // For hydration, we'll check localStorage for the auth token/state first.
      const authData = localStorage.getItem("focusflow-auth-storage");
      const isAuthenticated = authData ? JSON.parse(authData).state?.isAuthenticated : false;
      
      const service = new StorageService(isAuthenticated);
      const data = await service.getItem<any>(name);
      return data ? JSON.stringify(data) : null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      const authData = localStorage.getItem("focusflow-auth-storage");
      const isAuthenticated = authData ? JSON.parse(authData).state?.isAuthenticated : false;
      
      const service = new StorageService(isAuthenticated);
      await service.setItem(name, JSON.parse(value));
    },
    removeItem: async (name: string): Promise<void> => {
      const authData = localStorage.getItem("focusflow-auth-storage");
      const isAuthenticated = authData ? JSON.parse(authData).state?.isAuthenticated : false;
      
      const service = new StorageService(isAuthenticated);
      await service.removeItem(name);
    }
  };
};
