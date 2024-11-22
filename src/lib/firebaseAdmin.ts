import admin from "firebase-admin";
import { serverConfig } from "@/lib/config";

const initializeApp = (): admin.app.App => {
  if (!serverConfig || !serverConfig.serviceAccount) {
    throw new Error("Firebase Admin serverConfig or serviceAccount is missing or improperly configured.");
  }

  if (typeof serverConfig.serviceAccount !== "object" || Object.keys(serverConfig.serviceAccount).length === 0) {
    throw new Error("Invalid serviceAccount configuration for Firebase Admin.");
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount),
  });
};

export const getFirebaseAdminApp = (): admin.app.App => {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  return initializeApp();
};
