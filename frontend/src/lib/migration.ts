import { LocalStorageStrategy, ServerStorageStrategy } from "../services/storageService";

export async function migrateGuestData() {
  const local = new LocalStorageStrategy();
  const server = new ServerStorageStrategy();

  const keysToMigrate = [
    "focusflow-projects-storage",
    "focusflow-exp-storage",
    "focusflow-session-storage",
    "focusflow-app-storage",
  ];

  console.log("Starting data migration from guest to authenticated state...");

  for (const key of keysToMigrate) {
    try {
      const guestData = await local.getData(key);
      if (guestData) {
        console.log(`Migrating ${key}...`);
        await server.saveData(key, guestData);
        // We keep local data but the strategy will switch to server
        console.log(`Successfully migrated ${key}`);
      }
    } catch (error) {
      console.error(`Failed to migrate ${key}:`, error);
    }
  }
  
  console.log("Data migration complete.");
}
