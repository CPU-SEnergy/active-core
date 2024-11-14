import { AppOptions, cert, getApps, initializeApp, ServiceAccount } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getDatabase } from "firebase-admin/database";

const credentials: ServiceAccount = {
  projectId: process.env.FIREBASE_ADMIN_SDK_PROJECT_ID,
  privateKey: process.env.FIREBASE_ADMIN_SDK_PRIVATE_KEY?.replace(/\\n/g, "\n"),
  clientEmail: process.env.FIREBASE_ADMIN_SDK_CLIENT_EMAIL,
};

const options: AppOptions = {
  credential: cert(credentials),
  databaseURL: process.env.FIREBASE_DATABASE_URL,
};

export const initializeFirebaseAdmin = () => {
  const firebaseAdminApps = getApps();
  if (firebaseAdminApps.length > 0) {
    return firebaseAdminApps[0];
  }

  return initializeApp(options);
}

const firebaseAdmin = initializeFirebaseAdmin();

export const adminFirestore = getFirestore(firebaseAdmin);
export const adminDatabase = getDatabase(firebaseAdmin);  