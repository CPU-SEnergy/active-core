import { initializeApp, getApps, getApp } from "firebase/app";
import { clientConfig } from "@/lib/config";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";

export const app = (() => {
  if (!clientConfig || Object.keys(clientConfig).length === 0) {
    throw new Error(
      "Firebase clientConfig is missing or improperly configured."
    );
  }

  if (!getApps().length) {
    return initializeApp({
      projectId: clientConfig.projectId || "",
      apiKey: clientConfig.apiKey || "",
      authDomain: clientConfig.authDomain || "",
      databaseURL: clientConfig.databaseURL || "",
      messagingSenderId: clientConfig.messagingSenderId || "",
    });
  }

  return getApp();
})();

export const rtdb = getDatabase(app);
export const fireauth = getAuth(app);
export const firestore = getFirestore(app);
