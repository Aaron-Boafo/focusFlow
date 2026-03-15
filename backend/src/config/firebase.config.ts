import * as admin from "firebase-admin";
import { config } from "dotenv";

config({ quiet: true });

const firebaseConfig = {
  projectId: process.env.FIREBASE_PROJECT_ID,
  privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
};

if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(firebaseConfig),
    });
    console.log("🔥 Firebase Admin initialized successfully");
  } catch (error) {
    console.error("❌ Firebase Admin initialization error:", error);
  }
}

export const db: admin.firestore.Firestore = admin.firestore();
export const auth: admin.auth.Auth = admin.auth();
export const FieldPath = admin.firestore.FieldPath;
