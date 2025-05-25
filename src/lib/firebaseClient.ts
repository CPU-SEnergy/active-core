import { initializeApp, getApps, getApp } from "firebase/app";
import { clientConfig } from "@/lib/config";
import { getAuth, inMemoryPersistence, setPersistence } from "firebase/auth";

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

  // App relies only on server token. We make sure Firebase does not store credentials in the browser.
  // See: https://github.com/awinogrodzki/next-firebase-auth-edge/issues/143
  setPersistence(auth, inMemoryPersistence);

  return auth;
}
