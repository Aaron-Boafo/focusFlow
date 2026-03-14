import { Request, Response } from "express";
import { db } from "../config/firebase.config";

interface AuthenticatedRequest extends Request {
  user?: {
    email: string;
    uid: string;
  };
}

export class StorageController {
  private static collection = db.collection("storage");

  static async getData(req: AuthenticatedRequest, res: Response) {
    try {
      const key = req.params.key as string;
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const docRef = this.collection.doc(userId).collection("data").doc(key);
      const doc = await docRef.get();

      if (!doc.exists) {
        res.status(200).json(null);
        return;
      }

      const data = doc.data()?.value;
      res.status(200).json(data);
    } catch (error: any) {
      console.error("Error fetching storage data:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async saveData(req: AuthenticatedRequest, res: Response) {
    try {
      const key = req.params.key as string;
      const value = req.body;
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const docRef = this.collection.doc(userId).collection("data").doc(key);
      await docRef.set({ value, updatedAt: Date.now() });

      res.status(200).json({ status: "success", message: "Data saved" });
    } catch (error: any) {
      console.error("Error saving storage data:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }

  static async deleteData(req: AuthenticatedRequest, res: Response) {
    try {
      const key = req.params.key as string;
      const userId = req.user?.uid;

      if (!userId) {
        res.status(401).json({ status: "error", message: "Unauthorized" });
        return;
      }

      const docRef = this.collection.doc(userId).collection("data").doc(key);
      await docRef.delete();

      res.status(200).json({ status: "success", message: "Data deleted" });
    } catch (error: any) {
      console.error("Error deleting storage data:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }
}
