import admin from 'firebase-admin';
import {serverConfig} from '@/lib/config';

const initializeApp = () => {
  if (!serverConfig.serviceAccount) {
    return admin.initializeApp();
  }

  return admin.initializeApp({
    credential: admin.credential.cert(serverConfig.serviceAccount)
  });
};

export const getFirebaseAdminApp = () => {
  if (admin.apps.length > 0) {
    return admin.apps[0] as admin.app.App;
  }

  // admin.firestore.setLogFunction(console.log);

  return initializeApp();
};