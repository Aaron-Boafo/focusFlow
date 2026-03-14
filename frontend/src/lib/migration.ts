import { LocalStorageStrategy, ServerStorageStrategy } from "../services/storageService";
import { SessionStore } from "../store/SessionStore";
import { useProjectStore } from "../store/ProjectStore";
import { useExpStore } from "../store/ExpStore";
import { useAppStore } from "../store/useAppStore";
import { useAuthStore } from "../store/AuthStore";
import { 
  reconcileProjects, 
  reconcileExp, 
  reconcileSessions 
} from "./reconciliation";

export async function migrateGuestData() {
  const local = new LocalStorageStrategy();
  const server = new ServerStorageStrategy();
  const isAuthenticated = useAuthStore.getState().isAuthenticated;

  console.log(`Starting data migration (Mode: ${isAuthenticated ? "AUTHENTICATED" : "GUEST"})...`);

  // If not authenticated, we don't reconcile with cloud, we just ensure local is ready
  if (!isAuthenticated) {
    console.log("Guest mode: Skipping authoritative reconciliation.");
    return;
  }

  // Set initial loading states so UI components can show skeletons during sync
  useProjectStore.setState({ isLoading: true });
  useExpStore.setState({ isLoading: true });
  SessionStore.setState({ isLoading: true });
  useAppStore.setState({ isLoading: true });

  // Define migration tasks
  const syncProjectsTask = async () => {
    try {
      console.log("Syncing Projects...");
      const localData = await local.getData<any>("focusflow-projects-storage");
      const serverData = await server.getData<any>("focusflow-projects-storage");
      
      const localProjects = localData?.state?.projects || [];
      const serverProjects = serverData?.state?.projects || [];
      
      const reconciledProjects = reconcileProjects(localProjects, serverProjects);
      
      // Update local store immediately for re-render
      useProjectStore.setState({ projects: reconciledProjects, isLoading: false });

      // Push to server in background
      server.saveData("focusflow-projects-storage", { 
        state: { projects: reconciledProjects, isLoading: false },
        version: 1 
      }).catch(err => console.error("Cloud push failed:", err));
      
    } catch (error) {
      console.error("Failed to migrate projects:", error);
      useProjectStore.setState({ isLoading: false });
    }
  };

  const syncXPTask = async () => {
    try {
      console.log("Syncing XP & Level...");
      const localData = await local.getData<any>("focusflow-exp-storage");
      const serverData = await server.getData<any>("focusflow-exp-storage");
      
      const localState = {
        totalExp: localData?.state?.totalExp || 0,
        history: localData?.state?.history || {}
      };
      const serverState = {
        totalExp: serverData?.state?.totalExp || 0,
        history: serverData?.state?.history || {}
      };
      
      const reconciled = reconcileExp(localState, serverState);
      const level = calculateLevelFromExp(reconciled.totalExp);
      
      // Update local store immediately
      useExpStore.setState({ 
        ...reconciled, 
        level,
        isLoading: false 
      });

      // Push to server in background
      server.saveData("focusflow-exp-storage", {
        state: { 
          ...reconciled, 
          level,
          dailyGoal: serverData?.state?.dailyGoal || 100,
          isLoading: false 
        },
        version: 1
      }).catch(err => console.error("Cloud push failed:", err));

    } catch (error) {
      console.error("Failed to migrate XP:", error);
      useExpStore.setState({ isLoading: false });
    }
  };

  const syncSessionsTask = async () => {
    try {
      console.log("Syncing Sessions...");
      const localData = await local.getData<any>("focusflow-session-storage");
      const serverData = await server.getData<any>("focusflow-session-storage");
      
      const localHistory = localData?.state?.history || [];
      const serverHistory = serverData?.state?.history || [];
      
      const reconciledHistory = reconcileSessions(localHistory, serverHistory);
      
      // Update local store immediately
      SessionStore.setState({ 
        history: reconciledHistory, 
        isLoading: false,
        settings: serverData?.state?.settings || localData?.state?.settings
      });
      
      // Individual record sync and cloud push
      try {
        await SessionStore.getState().syncWithCloud();
        await server.saveData("focusflow-session-storage", {
          state: { 
            history: reconciledHistory, 
            settings: serverData?.state?.settings || localData?.state?.settings,
            isLoading: false 
          },
          version: 1
        });
      } catch (err) {
        console.error("Session cloud push failed:", err);
      }
      
    } catch (error) {
      console.error("Failed to migrate sessions:", error);
      SessionStore.setState({ isLoading: false });
    }
  };

  const syncAppSettingsTask = async () => {
    try {
      console.log("Syncing App Settings...");
      const localData = await local.getData<any>("focusflow-app-storage");
      const serverData = await server.getData<any>("focusflow-app-storage");
      
      if (serverData) {
        useAppStore.setState({ ...serverData.state, isLoading: false });
      } else if (localData) {
        useAppStore.setState({ isLoading: false });
        await server.saveData("focusflow-app-storage", localData).catch(err => console.error("Cloud push failed:", err));
      } else {
        useAppStore.setState({ isLoading: false });
      }
    } catch (error) {
      console.error("Failed to sync app settings:", error);
      useAppStore.setState({ isLoading: false });
    }
  };

  // Run all tasks in parallel
  await Promise.all([
    syncProjectsTask(),
    syncXPTask(),
    syncSessionsTask(),
    syncAppSettingsTask()
  ]);

  console.log("Data migration and reconciliation complete.");
}

// Helper (duplicated from ExpStore for standalone migration)
function calculateLevelFromExp(exp: number) {
  let tempLevel = 1;
  while (true) {
    let totalNeeded = 0;
    for (let i = 1; i < tempLevel + 1; i++) {
      totalNeeded += 100 + (i - 1) * 20;
    }
    if (exp >= totalNeeded) {
      tempLevel++;
    } else {
      return tempLevel;
    }
  }
}
