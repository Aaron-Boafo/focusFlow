import { Request, Response } from "express";
import { db, FieldPath } from "../config/firebase.config";
import { randomUUID } from "crypto";



export class LeaderboardController {
  private static usersCollection = db.collection("users");

  /**
   * Fetches the global leaderboard.
   */
  static async getLeaderboard(req: Request, res: Response) {
    try {
      // 1. Fetch all users from the users collection
      const usersSnapshot = await LeaderboardController.usersCollection.get();

      if (usersSnapshot.empty) {
        res.status(200).json({ status: "success", data: [] });
        return;
      }

      const userDocs = usersSnapshot.docs;

      // 2. Prepare storage document references for all users
      // Path: storage/{userId}/data/focusflow-exp-storage
      const storageRefs = userDocs.map(doc =>
        db.collection("storage").doc(doc.id).collection("data").doc("focusflow-exp-storage")
      );

      // 3. Fetch all storage documents in chunks (db.getAll limit is 1000)
      const storageDataMap: Record<string, any> = {};

      for (let i = 0; i < storageRefs.length; i += 1000) {
        const chunk = storageRefs.slice(i, i + 1000);
        const storageDocs = await db.getAll(...chunk);

        storageDocs.forEach((sDoc, index) => {
          if (sDoc.exists) {
            const userId = userDocs[i + index].id;
            storageDataMap[userId] = sDoc.data();
          }
        });
      }

      // 4. Combine user profiles with XP data from storage
      const combinedEntries = userDocs.map(doc => {
        const profile = doc.data();
        const storageDoc = storageDataMap[doc.id];
        const xpData = storageDoc?.value?.state || {};

        // Use XP from storage as primary, fallback to profile data
        return {
          id: randomUUID(),
          displayName: profile.displayName || "Anonymous",
          avatar: profile.avatar || "",
          status: profile.status || "Idle",
          totalExp: xpData.totalExp ?? profile.totalExp ?? 0,
          streak: xpData.streak ?? profile.streak ?? 0,
          xpLevel: xpData.level ?? profile.xpLevel ?? 1,
          xpTitle: profile.xpTitle || "Novice"
        };
      });

      // 5. Sort by totalExp desc
      combinedEntries.sort((a, b) => b.totalExp - a.totalExp);

      // 6. Calculate ranks with tie-handling
      let currentRank = 1;
      let prevExp = -1;

      const finalEntries = combinedEntries.map((entry, index) => {
        if (entry.totalExp !== prevExp) {
          currentRank = index + 1;
          prevExp = entry.totalExp;
        }

        return {
          ...entry,
          rank: currentRank
        };
      });

      res.status(200).json({ status: "success", data: finalEntries });
    } catch (error: any) {
      console.error("Error fetching leaderboard:", error);
      res.status(500).json({ status: "error", message: error.message });
    }
  }


}
