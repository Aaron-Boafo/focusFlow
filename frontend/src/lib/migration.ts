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

const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

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

  // 1. Projects Reconciliation
  try {
    console.log("Syncing Projects...");
    const localData = await local.getData<any>("focusflow-projects-storage");
    const serverData = await server.getData<any>("focusflow-projects-storage");
    
    const localProjects = localData?.state?.projects || [];
    const serverProjects = serverData?.state?.projects || [];
    
    const reconciledProjects = reconcileProjects(localProjects, serverProjects);
    
    // Push to server
    await server.saveData("focusflow-projects-storage", { 
      state: { projects: reconciledProjects, isLoading: false },
      version: 1 
    });
    
    // Update local store
    useProjectStore.setState({ projects: reconciledProjects, isLoading: false });
    
    await sleep(5000); // 5s Window
  } catch (error) {
    console.error("Failed to migrate projects:", error);
  }

  // 2. XP & Level Reconciliation
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
    
    // Push to server
    await server.saveData("focusflow-exp-storage", {
      state: { 
        ...reconciled, 
        level: calculateLevelFromExp(reconciled.totalExp),
        dailyGoal: serverData?.state?.dailyGoal || 100,
        isLoading: false 
      },
      version: 1
    });

    // Update local store
    useExpStore.setState({ 
      ...reconciled, 
      level: calculateLevelFromExp(reconciled.totalExp),
      isLoading: false 
    });
    
    await sleep(5000);
  } catch (error) {
    console.error("Failed to migrate XP:", error);
  }

  // 3. Sessions Reconciliation
  try {
    console.log("Syncing Sessions...");
    const localData = await local.getData<any>("focusflow-session-storage");
    const serverData = await server.getData<any>("focusflow-session-storage");
    
    const localHistory = localData?.state?.history || [];
    const serverHistory = serverData?.state?.history || [];
    
    const reconciledHistory = reconcileSessions(localHistory, serverHistory);
    
    // Push to server
    await server.saveData("focusflow-session-storage", {
      state: { 
        history: reconciledHistory, 
        settings: serverData?.state?.settings || localData?.state?.settings,
        isLoading: false 
      },
      version: 1
    });

    // Update local store
    SessionStore.setState({ history: reconciledHistory, isLoading: false });
    
    // Final sync for individual individual records (idempotent)
    await SessionStore.getState().syncWithCloud();
    
    await sleep(5000);
  } catch (error) {
    console.error("Failed to migrate sessions:", error);
  }

  // 4. App Settings (Simple merge, server wins)
  try {
    console.log("Syncing App Settings...");
    const localData = await local.getData<any>("focusflow-app-storage");
    const serverData = await server.getData<any>("focusflow-app-storage");
    
    if (serverData) {
      useAppStore.setState({ ...serverData.state, isLoading: false });
    } else if (localData) {
      await server.saveData("focusflow-app-storage", localData);
    }
  } catch (error) {
    console.error("Failed to sync app settings:", error);
  }

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
