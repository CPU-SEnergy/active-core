import { initializeApp, getApps, getApp } from "firebase/app";
import { clientConfig } from "@/lib/config";
import { getAuth } from "firebase/auth";

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

export function getFirebaseAuth() {
  const auth = getAuth(app);

  return auth;
}