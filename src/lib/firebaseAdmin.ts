import "server-only";
import admin from "firebase-admin";
import { serverConfig } from "@/lib/config";

const initializeApp = (): admin.app.App => {
  if (!admin.apps.length) {
    if (!serverConfig?.serviceAccount) {
      throw new Error("Firebase Admin serviceAccount is missing.");
    }

    try {
      admin.initializeApp({
        credential: admin.credential.cert(serverConfig.serviceAccount),
      });
    } catch (error) {
      console.error("Firebase Admin initialization error:", error);
      throw new Error("Firebase Admin could not be initialized.");
    }
  }

  return admin.apps[0]!;
};

export const getFirebaseAdminApp = (): admin.app.App => {
  if (!admin.apps.length) {
    return initializeApp();
  }

  const app = admin.apps[0];
  if (!app) {
    throw new Error("Firebase Admin app is not initialized.");
  }

  return app;
};
