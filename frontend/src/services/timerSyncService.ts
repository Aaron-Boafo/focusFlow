import { SessionStore } from "../store/SessionStore";

type SyncMessage = 
  | { type: "TICK"; activeSessionId: string; elapsedTime: number; status: string }
  | { type: "CLAIM_LEAD"; activeSessionId: string }
  | { type: "STOP_SYNC" };

class TimerSyncService {
  private channel: BroadcastChannel;
  private isLeader: boolean = false;
  private lastTickReceived: number = Date.now();

  constructor() {
    this.channel = new BroadcastChannel("focusflow-timer-sync");
    this.channel.onmessage = (event) => this.handleMessage(event.data);
    
    // Check if we should become leader on start
    setTimeout(() => {
      const state = SessionStore.getState();
      if (state.activeSessionId && !state.isPaused) {
        // If we have an active session and haven't heard from anyone, we might be the first tab
        if (Date.now() - this.lastTickReceived > 2000) {
          this.becomeLeader();
        }
      }
    }, 1500);
  }

  private handleMessage(msg: SyncMessage) {
    const state = SessionStore.getState();
    
    switch (msg.type) {
      case "TICK":
        this.lastTickReceived = Date.now();
        // If we are getting ticks from elsewhere, we are definitely NOT the leader
        this.isLeader = false;
        
        // Update local store silently to avoid infinite loops if listeners are poorly placed
        if (state.activeSessionId === msg.activeSessionId) {
          SessionStore.setState((s) => ({
            history: s.history.map(h => 
              h.id === msg.activeSessionId 
                ? { ...h, elapsedTime: msg.elapsedTime, status: msg.status as any } 
                : h
            )
          }));
        }
        break;
        
      case "CLAIM_LEAD":
        this.isLeader = false;
        break;
        
      case "STOP_SYNC":
        this.isLeader = false;
        break;
    }
  }

  public becomeLeader() {
    this.isLeader = true;
    const state = SessionStore.getState();
    if (state.activeSessionId) {
      this.channel.postMessage({ type: "CLAIM_LEAD", activeSessionId: state.activeSessionId });
    }
  }

  public broadcastTick(activeSessionId: string, elapsedTime: number, status: string) {
    if (this.isLeader) {
      this.channel.postMessage({ type: "TICK", activeSessionId, elapsedTime, status });
    }
  }

  public stopSync() {
    this.isLeader = false;
    this.channel.postMessage({ type: "STOP_SYNC" });
  }

  public getIsLeader() {
    return this.isLeader;
  }
}

export const timerSyncService = new TimerSyncService();
