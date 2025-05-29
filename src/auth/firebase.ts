import { clientConfig } from "@/lib/config";
import { getApp, getApps, initializeApp, FirebaseOptions } from "firebase/app";
import {
  getAuth,
  inMemoryPersistence,
  setPersistence,
} from "firebase/auth";

export const getFirebaseApp = () => {
  if (getApps().length) {
    return getApp();
  }

  const firebaseConfigForInit: FirebaseOptions = {
    apiKey: clientConfig.apiKey,
  };

  if (clientConfig.authDomain !== undefined) {
    firebaseConfigForInit.authDomain = clientConfig.authDomain;
  }
  if (clientConfig.databaseURL !== undefined) {
    firebaseConfigForInit.databaseURL = clientConfig.databaseURL;
  }
  if (clientConfig.projectId !== undefined) {
    firebaseConfigForInit.projectId = clientConfig.projectId;
  }
  if (clientConfig.messagingSenderId !== undefined) {
    firebaseConfigForInit.messagingSenderId = clientConfig.messagingSenderId;
  }

  const app = initializeApp(firebaseConfigForInit);

  return app;
};

export function getFirebaseAuth() {
  const auth = getAuth(getFirebaseApp());

  // App relies only on server token. We make sure Firebase does not store credentials in the browser.
  // See: https://github.com/awinogrodzki/next-firebase-auth-edge/issues/143
  setPersistence(auth, inMemoryPersistence);

  return auth;
}
