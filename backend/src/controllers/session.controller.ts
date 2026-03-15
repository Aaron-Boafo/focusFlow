import { Request, Response } from "express";
import { db } from "../config/firebase.config";
import { Session } from "../models/Session";

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    uid: string;
  };
}

export class SessionController {
  private static collection = db.collection("sessions");

  static async getSessions(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const snapshot = await this.collection.where("userId", "==", userId).orderBy("startTime", "desc").get();
      const sessions = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

      res.status(200).json({ status: "success", data: sessions });
    } catch (error: any) {
      console.error("Error fetching sessions:", error);
      res.status(500).json({ status: "error", message: "Failed to fetch sessions" });
    }
  }

  static async createSession(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const sessionData: Session = req.body;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      // Ensure userId matches the authenticated user
      sessionData.userId = userId;
      sessionData.createdAt = Date.now();

      const docRef = sessionData.id ? this.collection.doc(sessionData.id) : this.collection.doc();
      await docRef.set(sessionData);

      res.status(201).json({ status: "success", data: { ...sessionData, id: docRef.id } });
    } catch (error: any) {
      console.error("Error creating session:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async updateSession(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.uid;
      const updates = req.body;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data()?.userId !== userId) {
        res.status(404).json({ status: "error", message: "Session not found" });
        return;
      }

      await docRef.update(updates);
      res.status(200).json({ status: "success", message: "Session updated" });
    } catch (error: any) {
      console.error("Error updating session:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async syncSessions(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const { sessions }: { sessions: Session[] } = req.body;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const batch = db.batch();

      sessions.forEach((session) => {
        const docRef = this.collection.doc(session.id);
        batch.set(docRef, { ...session, userId }, { merge: true });
      });

      await batch.commit();

      res.status(200).json({ status: "success", message: `${sessions.length} sessions synced` });
    } catch (error: any) {
      console.error("Error syncing sessions:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async deleteSession(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const docRef = this.collection.doc(id);
      const doc = await docRef.get();

      if (!doc.exists || doc.data()?.userId !== userId) {
        res.status(404).json({ status: "error", message: "Session not found" });
        return;
      }

      await docRef.delete();
      res.status(200).json({ status: "success", message: "Session deleted" });
    } catch (error: any) {
      console.error("Error deleting session:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async deleteMultipleSessions(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.uid;
      const { ids }: { ids: string[] } = req.body;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      if (!ids || !Array.isArray(ids) || ids.length === 0) {
        res.status(400).json({ status: "error", message: "No session IDs provided" });
        return;
      }

      const batch = db.batch();

      // Verify ownership and add to batch
      const snapshots = await Promise.all(ids.map(id => this.collection.doc(id).get()));

      for (const doc of snapshots) {
        if (!doc.exists || doc.data()?.userId !== userId) {
          continue; // Skip if not found or not owned
        }
        batch.delete(doc.ref);
      }

      await batch.commit();

      res.status(200).json({ status: "success", message: `${ids.length} sessions deletion processed` });
    } catch (error: any) {
      console.error("Error deleting multiple sessions:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}
