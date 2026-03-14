import type { Project, Session } from "@/types";

/**
 * Reconciles local projects with server projects.
 * Logic: 
 * 1. Merge by ID.
 * 2. If ID exists in both, prefer more recent or server version (depending on app logic).
 * 3. For FocusFlow, we'll merge tasks by title/ID and keep the most complete state.
 */
export function reconcileProjects(local: Project[], server: Project[]): Project[] {
  const mergedMap = new Map<string, Project>();

  // Add all server projects (Authoritative)
  server.forEach(p => mergedMap.set(p.id, p));

  // Merge local projects
  local.forEach(localProject => {
    const existing = mergedMap.get(localProject.id);
    if (!existing) {
      mergedMap.set(localProject.id, localProject);
    } else {
      // Both exist - reconcile tasks
      const reconciledTasks = [...existing.tasks];
      localProject.tasks.forEach(localTask => {
        const existingTaskIdx = reconciledTasks.findIndex(t => t.id === localTask.id);
        if (existingTaskIdx === -1) {
          reconciledTasks.push(localTask);
        } else {
          // Task exists in both - if local is "Done" and server isn't, prefer "Done"
          if (localTask.status === "Done" && reconciledTasks[existingTaskIdx].status !== "Done") {
            reconciledTasks[existingTaskIdx] = localTask;
          }
        }
      });

      const tasksLeft = reconciledTasks.filter(t => t.status !== "Done").length;
      const totalTasks = reconciledTasks.length;
      const progress = totalTasks === 0 ? 0 : Math.round(((totalTasks - tasksLeft) / totalTasks) * 100);

      mergedMap.set(localProject.id, {
        ...existing,
        tasks: reconciledTasks,
        tasksLeft,
        progress,
        status: tasksLeft === 0 && totalTasks > 0 ? "Completed" : existing.status
      });
    }
  });

  return Array.from(mergedMap.values());
}

/**
 * Reconciles local XP history with server XP history.
 */
export function reconcileExp(local: { totalExp: number; history: Record<string, number> }, 
                             server: { totalExp: number; history: Record<string, number> }) {
  const reconciledHistory = { ...server.history };

  // Merge history by date
  Object.keys(local.history).forEach(date => {
    // If date exists in both, take the max (or sum if appropriate, but max is safer for idempotent sync)
    // Actually, FocusFlow adds XP throughout the day, so sum might be risky if we aren't careful about idempotency.
    // Given the architecture, server is usually authoritative for what was recorded.
    // We'll take the max as the safest "recorded progress" indicator for a specific date.
    reconciledHistory[date] = Math.max(reconciledHistory[date] || 0, local.history[date]);
  });

  // Recalculate total XP from history
  const totalExp = Object.values(reconciledHistory).reduce((acc, xp) => acc + xp, 0);

  return {
    totalExp,
    history: reconciledHistory
  };
}

/**
 * Reconciles local sessions with server sessions.
 */
export function reconcileSessions(local: Session[], server: Session[]): Session[] {
  const mergedMap = new Map<string, Session>();

  // Add server sessions
  server.forEach(s => mergedMap.set(s.id, s));

  // Merge local
  local.forEach(localSession => {
    const existing = mergedMap.get(localSession.id);
    if (!existing) {
      mergedMap.set(localSession.id, localSession);
    } else {
      // Prioritize completed sessions or higher elapsed time
      if (localSession.status === "complete" || localSession.elapsedTime > existing.elapsedTime) {
        mergedMap.set(localSession.id, localSession);
      }
    }
  });

  return Array.from(mergedMap.values());
}
