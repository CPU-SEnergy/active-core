import "server-only";
import admin from "firebase-admin";
import { serverConfig } from "@/lib/config";

const initializeApp = (): admin.app.App => {
  if (!serverConfig?.serviceAccount) {
    throw new Error(
      "Firebase Admin serverConfig or serviceAccount is missing or improperly configured."
    );
  }

  const { projectId, privateKey, clientEmail } = {
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
  };

  if (!projectId || !privateKey || !clientEmail) {
    throw new Error(
      "Missing required environment variables for Firebase Admin initialization."
    );
  }

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        privateKey,
        clientEmail,
      }),
    });
  }

  if (!admin.apps[0]) {
    throw new Error("Firebase Admin app initialization failed.");
  }
  return admin.apps[0];
};

export const getFirebaseAdminApp = (): admin.app.App => {
  return admin.apps.length > 0 && admin.apps[0]
    ? admin.apps[0]
    : initializeApp();
};

export { initializeApp };
