import { initializeApp, getApps, getApp } from "firebase/app";
import { clientConfig } from "@/lib/config";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export const app = (() => {
  if (!clientConfig || Object.keys(clientConfig).length === 0) {
    throw new Error(
      "Firebase clientConfig is missing or improperly configured."
    );
  }

  if (!getApps().length) {
    return initializeApp({
      ...clientConfig,
      authDomain: clientConfig.authDomain || "",
      projectId: clientConfig.projectId || "",
      databaseURL: clientConfig.databaseURL || "",
      messagingSenderId: clientConfig.messagingSenderId || "",
    });
  }

  return getApp();
})();

export const database = getDatabase(app);
export const auth = getAuth(app);
export const firestore = getFirestore(app);
